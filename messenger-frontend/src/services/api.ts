import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (credentials: { email: string; password: string }) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: { email: string; password: string }) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

export const getUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};

export const updateUserRole = async (id: string, role: 'user' | 'admin') => {
  const response = await apiClient.put(`/users/${id}/role`, { role });
  return response.data;
};

export const setUserBlocked = async (id: string, isBlocked: boolean) => {
  const response = await apiClient.put(`/users/${id}/block`, { isBlocked });
  return response.data;
};

export const restoreUser = async (id: string) => {
  const response = await apiClient.put(`/users/${id}/restore`);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};

export const updateMySettings = async (payload: { theme?: 'light' | 'dark'; notifications?: boolean }) => {
  const response = await apiClient.put('/users/me/settings', payload);
  return response.data;
};

export const updateMyProfile = async (payload: { displayName?: string }) => {
  const response = await apiClient.put('/users/me/profile', payload);
  return response.data;
};

export const changePassword = async (payload: { currentPassword: string; newPassword: string }) => {
  const response = await apiClient.put('/users/me/password', payload);
  return response.data;
};

export const getChats = async () => {
  const response = await apiClient.get('/chats');
  return response.data;
};

export const getAllChats = async () => {
  const response = await apiClient.get('/chats/admin/all');
  return response.data;
};

export const updateChat = async (id: string, payload: { title?: string; participants?: string[] }) => {
  const response = await apiClient.put(`/chats/${id}`, payload);
  return response.data;
};

export const deleteChat = async (id: string) => {
  const response = await apiClient.delete(`/chats/${id}`);
  return response.data;
};
export const createChat = async (payload: { title?: string; participants: string[] }) => {
  const response = await apiClient.post('/chats', payload);
  return response.data;
};

export const getMessagesByChat = async (chatId: string) => {
  const response = await apiClient.get(`/messages/chat/${chatId}`);
  return response.data;
};

export const sendMessage = async (chatId: string, messageData: { text: string }) => {
  const response = await apiClient.post(`/messages/chat/${chatId}`, messageData);
  return response.data;
};

export const markChatRead = async (chatId: string) => {
  const response = await apiClient.put(`/messages/chat/${chatId}/read`);
  return response.data;
};

export const searchMessages = async (chatId: string, query: string) => {
  const response = await apiClient.get(`/messages/chat/${chatId}/search`, {
    params: { q: query },
  });
  return response.data;
};

export const submitFeedback = async (payload: { name?: string; email: string; message: string }) => {
  const response = await apiClient.post('/feedback', payload);
  return response.data;
};

export const getFeedback = async () => {
  const response = await apiClient.get('/feedback');
  return response.data;
};
