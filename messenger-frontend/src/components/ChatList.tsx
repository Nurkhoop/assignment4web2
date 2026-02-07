import React from 'react';
import { Link } from 'react-router-dom';
import type { Chat } from '../types';

interface ChatListProps {
    chats: Chat[];
}

const ChatList: React.FC<ChatListProps> = ({ chats }) => {
    return (
        <div className="chat-list">
            <h2>Conversations</h2>
            <ul>
                {chats.map((chat) => (
                    <li key={chat.id}>
                        <Link to={`/chat/${chat.id}`}>
                            {chat.title || 'Untitled chat'}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;
