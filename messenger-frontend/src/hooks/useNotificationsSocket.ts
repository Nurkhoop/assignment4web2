import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification, addIncomingMessage } from '../store/chatSlice';
import type { RootState, AppDispatch } from '../store';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

const useNotificationsSocket = (activeChatId?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!token) return;
    let socket: Socket | null = null;

    socket = io(SOCKET_URL, {
      auth: { token },
    });

    socket.on('message:new', (message) => {
      if (message.sender?._id === user?.id || message.sender?.id === user?.id) {
        return;
      }

      if (activeChatId && message.chat === activeChatId) {
        dispatch(addIncomingMessage(message));
      } else {
        dispatch(addNotification(message));
      }
    });

    return () => {
      socket?.disconnect();
    };
  }, [token, user, activeChatId, dispatch]);
};

export default useNotificationsSocket;
