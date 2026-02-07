import { useEffect, useRef, useState } from 'react';

const useWebSocket = (url: string) => {
    const [messages, setMessages] = useState<string[]>([]);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        socketRef.current = new WebSocket(url);

        socketRef.current.onmessage = (event) => {
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        socketRef.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            socketRef.current?.close();
        };
    }, [url]);

    const sendMessage = (message: string) => {
        if (socketRef.current) {
            socketRef.current.send(message);
        }
    };

    return { messages, sendMessage };
};

export default useWebSocket;