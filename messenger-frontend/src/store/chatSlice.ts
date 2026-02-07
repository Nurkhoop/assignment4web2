import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createChat, getChats, getMessagesByChat, markChatRead, sendMessage } from '../services/api';
import type { Chat, ChatState, Message, User } from '../types';

const normalizeUser = (user: any): User => ({
  id: user?._id || user?.id || user,
  _id: user?._id || user?.id,
  email: user?.email || 'unknown',
  role: user?.role || 'user',
  preferences: user?.preferences,
  displayName: user?.displayName,
});

const initialState: ChatState = {
  chats: [],
  messages: [],
  notifications: [],
  loading: false,
  error: null,
};

export const fetchChats = createAsyncThunk('chat/fetchChats', async (_, { rejectWithValue }) => {
  try {
    const data = await getChats();
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load chats');
  }
});

export const startChat = createAsyncThunk(
  'chat/startChat',
  async (payload: { title?: string; participants: string[] }, { rejectWithValue }) => {
    try {
      const data = await createChat(payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create chat');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (chatId: string, { rejectWithValue }) => {
    try {
      const data = await getMessagesByChat(chatId);
      return { chatId, messages: data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load messages');
    }
  }
);

export const markMessagesRead = createAsyncThunk(
  'chat/markMessagesRead',
  async (chatId: string, { rejectWithValue }) => {
    try {
      await markChatRead(chatId);
      return { chatId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark read');
    }
  }
);

export const sendChatMessage = createAsyncThunk(
  'chat/sendChatMessage',
  async (payload: { chatId: string; text: string }, { rejectWithValue }) => {
    try {
      const data = await sendMessage(payload.chatId, { text: payload.text });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<any>) {
      const message = action.payload;
      state.notifications.unshift({
        id: message._id || message.id,
        _id: message._id || message.id,
        chatId: message.chat,
        sender: normalizeUser(message.sender),
        text: message.text,
        createdAt: message.createdAt,
        edited: message.edited,
        isRead: message.isRead,
      });
    },
    clearNotificationsForChat(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter((note) => note.chatId !== action.payload);
    },
    addIncomingMessage(state, action: PayloadAction<any>) {
      const message = action.payload;
      state.messages.push({
        id: message._id || message.id,
        _id: message._id || message.id,
        chatId: message.chat,
        sender: normalizeUser(message.sender),
        text: message.text,
        createdAt: message.createdAt,
        edited: message.edited,
        isRead: message.isRead,
      });
    },
    clearMessages(state) {
      state.messages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.chats = action.payload.map((chat) => ({
          id: chat._id || chat.id,
          _id: chat._id || chat.id,
          title: chat.title,
          participants: (chat.participants || []).map(normalizeUser),
          createdBy: normalizeUser(chat.createdBy),
          createdAt: chat.createdAt,
        })) as Chat[];
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(startChat.fulfilled, (state, action: PayloadAction<any>) => {
        state.chats.unshift({
          id: action.payload._id || action.payload.id,
          _id: action.payload._id || action.payload.id,
          title: action.payload.title,
          participants: (action.payload.participants || []).map(normalizeUser),
          createdBy: normalizeUser(action.payload.createdBy),
          createdAt: action.payload.createdAt,
        });
      })
      .addCase(startChat.pending, (state) => {
        state.error = null;
      })
      .addCase(startChat.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action: PayloadAction<{ chatId: string; messages: any[] }>) => {
        state.loading = false;
        state.messages = action.payload.messages.map((message: any) => ({
          id: message._id || message.id,
          _id: message._id || message.id,
          chatId: message.chat,
          sender: normalizeUser(message.sender),
          text: message.text,
          createdAt: message.createdAt,
          edited: message.edited,
          isRead: message.isRead,
        })) as Message[];
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markMessagesRead.fulfilled, (state) => {
        state.messages = state.messages.map((message) => ({ ...message, isRead: true }));
      })
      .addCase(sendChatMessage.fulfilled, (state, action: PayloadAction<any>) => {
        state.messages.push({
          id: action.payload._id || action.payload.id,
          _id: action.payload._id || action.payload.id,
          chatId: action.payload.chat,
          sender: normalizeUser(action.payload.sender),
          text: action.payload.text,
          createdAt: action.payload.createdAt,
          edited: action.payload.edited,
          isRead: action.payload.isRead,
        });
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages, addNotification, clearNotificationsForChat, addIncomingMessage } = chatSlice.actions;

export default chatSlice.reducer;
