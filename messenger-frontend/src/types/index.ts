export interface User {
  id: string;
  _id?: string;
  email: string;
  role: 'user' | 'admin';
  preferences?: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  displayName?: string;
}

export interface Message {
  id: string;
  _id?: string;
  chatId: string;
  sender: User;
  text: string;
  createdAt: string;
  edited: boolean;
  isRead?: boolean;
}

export interface Chat {
  id: string;
  _id?: string;
  title: string;
  participants: User[];
  createdBy: User;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface ChatState {
  chats: Chat[];
  messages: Message[];
  notifications: Message[];
  loading: boolean;
  error: string | null;
}

export interface Feedback {
  id: string;
  email: string;
  message: string;
  name?: string;
  createdAt: string;
}
