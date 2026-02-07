import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchChats, fetchMessages, markMessagesRead, sendChatMessage, clearNotificationsForChat } from '../store/chatSlice';
import type { AppDispatch, RootState } from '../store';
import MessageItem from '../components/MessageItem';
import { searchMessages } from '../services/api';

const Chat: React.FC = () => {
    const { conversationId } = useParams<{ conversationId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { messages, chats, loading, error } = useSelector((state: RootState) => state.chat);
    const { user } = useSelector((state: RootState) => state.auth);
    const [text, setText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);
    const activeChat = chats.find((chat) => chat.id === conversationId);

    if (!conversationId) {
        return (
            <div className="page">
                <section className="card">
                    <p className="muted">Select a conversation to start chatting.</p>
                </section>
            </div>
        );
    }

    useEffect(() => {
        if (conversationId) {
            dispatch(fetchMessages(conversationId));
            dispatch(markMessagesRead(conversationId));
            dispatch(clearNotificationsForChat(conversationId));
        }
    }, [conversationId, dispatch]);

    useEffect(() => {
        if (!activeChat) {
            dispatch(fetchChats());
        }
    }, [activeChat, dispatch]);

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!conversationId || !text.trim()) {
            return;
        }
        await dispatch(sendChatMessage({ chatId: conversationId, text: text.trim() }));
        setText('');
    };

    const handleSearch = async () => {
        if (!conversationId || !searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        setSearching(true);
        try {
            const data = await searchMessages(conversationId, searchQuery.trim());
            setSearchResults(data);
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="page chat-page">
            <section className="page-header">
                <div>
                    <p className="eyebrow">Conversation</p>
                    <h2>{activeChat?.title || 'Chat'}</h2>
                    <p className="muted">
                        {activeChat?.participants.map((participant) => participant.email).join(', ')}
                    </p>
                </div>
                <Link to="/conversations" className="btn ghost">
                    Back to list
                </Link>
            </section>
            <section className="card chat-search">
                <div className="search-row">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search messages in this chat..."
                    />
                    <button className="btn ghost" onClick={handleSearch} type="button">
                        {searching ? 'Searching...' : 'Search'}
                    </button>
                    {searchResults.length > 0 && (
                        <button className="btn ghost" onClick={() => setSearchResults([])} type="button">
                            Clear
                        </button>
                    )}
                </div>
                {searchResults.length > 0 && (
                    <div className="search-results">
                        {searchResults.map((message) => (
                            <MessageItem
                                key={message._id || message.id}
                                sender={message.sender.email}
                                content={message.text}
                                timestamp={new Date(message.createdAt).toLocaleString()}
                                isOwn={message.sender._id === user?.id || message.sender.id === user?.id}
                                edited={message.edited}
                            />
                        ))}
                    </div>
                )}
            </section>
            <section className="card chat-window">
                {loading && <p className="muted">Loading messages...</p>}
                {error && <p className="alert">{error}</p>}
                <div className="messages">
                    {messages.length === 0 && !loading && (
                        <p className="muted">No messages yet. Start the conversation.</p>
                    )}
                    {messages.map((message) => (
                        <MessageItem
                            key={message.id}
                            sender={message.sender.email}
                            content={message.text}
                            timestamp={new Date(message.createdAt).toLocaleString()}
                            isOwn={message.sender.id === user?.id}
                            edited={message.edited}
                        />
                    ))}
                </div>
                <form className="composer" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type your message..."
                    />
                    <button type="submit" className="btn primary">
                        Send
                    </button>
                </form>
            </section>
        </div>
    );
};

export default Chat;
