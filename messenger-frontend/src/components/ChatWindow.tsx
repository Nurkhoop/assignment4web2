import React from 'react';
import MessageItem from './MessageItem';
import type { Message } from '../types';

interface ChatWindowProps {
    messages: Message[];
    currentUserId?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, currentUserId }) => {
    return (
        <div className="chat-window">
            <div className="messages">
                {messages.map((message) => (
                    <MessageItem
                        key={message.id}
                        sender={message.sender.email}
                        content={message.text}
                        timestamp={new Date(message.createdAt).toLocaleString()}
                        isOwn={message.sender.id === currentUserId}
                        edited={message.edited}
                    />
                ))}
            </div>
        </div>
    );
};

export default ChatWindow;
