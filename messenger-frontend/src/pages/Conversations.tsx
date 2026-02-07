import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { fetchChats, startChat } from '../store/chatSlice';
import type { AppDispatch, RootState } from '../store';

const Conversations = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { chats, loading, error } = useSelector((state: RootState) => state.chat);
    const [title, setTitle] = useState('');
    const [participants, setParticipants] = useState('');
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q')?.toLowerCase() || '';

    useEffect(() => {
        dispatch(fetchChats());
    }, [dispatch]);

    const filteredChats = useMemo(() => {
        if (!query) return chats;
        return chats.filter((chat) => {
            const titleMatch = chat.title?.toLowerCase().includes(query);
            const participantMatch = chat.participants.some((participant) =>
                participant.email.toLowerCase().includes(query)
            );
            return titleMatch || participantMatch;
        });
    }, [chats, query]);

    const handleCreateChat = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const emails = participants
            .split(',')
            .map((email) => email.trim())
            .filter(Boolean);
        if (emails.length === 0) {
            return;
        }
        await dispatch(startChat({ title: title.trim() || undefined, participants: emails }));
        setTitle('');
        setParticipants('');
    };

    return (
        <div className="page">
            <section className="page-header">
                <div>
                    <p className="eyebrow">Your inbox</p>
                    <h2>Conversations</h2>
                    <p className="muted">Start a chat by adding participant emails.</p>
                </div>
                <form className="new-chat" onSubmit={handleCreateChat}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Chat title (optional)"
                    />
                    <input
                        type="text"
                        value={participants}
                        onChange={(e) => setParticipants(e.target.value)}
                        placeholder="Participant emails, comma separated"
                        required
                    />
                    <button className="btn primary" type="submit">
                        New chat
                    </button>
                </form>
            </section>
            <section className="card">
                {loading && <p className="muted">Loading chats...</p>}
                {error && <p className="alert">{error}</p>}
                {!loading && filteredChats.length === 0 && <p className="muted">No conversations yet.</p>}
                <ul className="chat-list">
                    {filteredChats.map((chat) => (
                        <li key={chat.id} className="chat-list-item">
                            <Link to={`/chat/${chat.id}`}>
                                <div>
                                    <p className="chat-title">{chat.title || 'Untitled chat'}</p>
                                    <p className="chat-meta">
                                        {chat.participants.map((user) => user.email).join(', ')}
                                    </p>
                                </div>
                                <span className="chat-link">Open</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default Conversations;
