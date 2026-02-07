import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setUser } from '../store/authSlice';
import { startChat } from '../store/chatSlice';
import { updateMySettings } from '../services/api';
import type { AppDispatch, RootState } from '../store';

const Header: React.FC = () => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const { notifications } = useSelector((state: RootState) => state.chat);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState(new URLSearchParams(location.search).get('q') || '');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showNewChat, setShowNewChat] = useState(false);
    const [chatTitle, setChatTitle] = useState('');
    const [participants, setParticipants] = useState('');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [notificationsEnabled, setNotificationsEnabled] = useState(
        user?.preferences?.notifications ?? true
    );

    useEffect(() => {
        if (user?.preferences?.theme && user.preferences.theme !== theme) {
            setTheme(user.preferences.theme);
            localStorage.setItem('theme', user.preferences.theme);
            document.body.classList.toggle('theme-dark', user.preferences.theme === 'dark');
        }
    }, [user, theme]);

    useEffect(() => {
        const currentQuery = new URLSearchParams(location.search).get('q') || '';
        if (currentQuery !== search) {
            setSearch(currentQuery);
        }
    }, [location.search, search]);

    useEffect(() => {
        if (user?.preferences?.notifications !== undefined) {
            setNotificationsEnabled(user.preferences.notifications);
        }
    }, [user]);

    const unreadCount = useMemo(() => {
        if (!user) return 0;
        return notifications.filter(
            (message) => message.sender.id !== user.id && message.isRead === false
        ).length;
    }, [notifications, user]);

    const recentNotifications = useMemo(() => {
        if (!user) return [];
        return notifications
            .filter((message) => message.sender.id !== user.id)
            .slice(0, 5)
            .map((message) => ({
                id: message.id,
                text: `${message.sender.email}: ${message.text}`,
            }));
    }, [notifications, user]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        const params = new URLSearchParams(location.search);
        if (value.trim()) {
            params.set('q', value.trim());
        } else {
            params.delete('q');
        }
        navigate(`/conversations?${params.toString()}`);
    };

    const handleToggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
        localStorage.setItem('theme', nextTheme);
        document.body.classList.toggle('theme-dark', nextTheme === 'dark');
        if (user) {
            updateMySettings({ theme: nextTheme }).then((updatedUser) => {
                dispatch(setUser(updatedUser));
                localStorage.setItem('user', JSON.stringify(updatedUser));
            });
        }
    };

    const handleToggleNotifications = () => {
        const nextValue = !notificationsEnabled;
        setNotificationsEnabled(nextValue);
        if (user) {
            updateMySettings({ notifications: nextValue }).then((updatedUser) => {
                dispatch(setUser(updatedUser));
                localStorage.setItem('user', JSON.stringify(updatedUser));
            });
        }
    };

    const handleCreateChat = async () => {
        const emails = participants
            .split(',')
            .map((email) => email.trim())
            .filter(Boolean);
        if (emails.length === 0) return;
        await dispatch(startChat({ title: chatTitle.trim() || undefined, participants: emails }));
        setChatTitle('');
        setParticipants('');
        setShowNewChat(false);
        navigate('/conversations');
    };

    return (
        <header className="site-header">
            <div className="header-inner">
                <Link to="/" className="brand">
                    <span className="brand-mark">M</span>
                    <span>Vibegram</span>
                </Link>
                <div className="header-actions">
                    {isAuthenticated ? (
                        <>
                            <div className="search">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) => handleSearchChange(event.target.value)}
                                    placeholder="Search chats or participants..."
                                />
                            </div>
                            <button
                                className="icon-btn"
                                onClick={() => setShowNotifications(!showNotifications)}
                                aria-label="Notifications"
                            >
                                <span className="icon">🛎</span>
                                <span>Alerts</span>
                                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                            </button>
                            <button
                                className="icon-btn"
                                onClick={() => setShowNewChat(true)}
                                aria-label="New chat"
                            >
                                <span className="icon">➕</span>
                                <span>New chat</span>
                            </button>
                            <button className="icon-btn" onClick={() => setShowSettings(true)} aria-label="Settings">
                                <span className="icon">⚙</span>
                                <span>Settings</span>
                            </button>
                            <button className="icon-btn" onClick={handleToggleTheme} aria-label="Toggle theme">
                                <span className="icon">{theme === 'light' ? '🌙' : '☀'}</span>
                                <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
                            </button>
                            <button className="icon-btn" onClick={() => setShowHelp(true)} aria-label="Help">
                                <span className="icon">❓</span>
                                <span>Help</span>
                            </button>
                            {user?.role === 'admin' && (
                                <Link className="icon-btn" to="/admin" aria-label="Admin panel">
                                    <span className="icon">🛡</span>
                                    <span>Admin</span>
                                </Link>
                            )}
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn ghost">
                                Login
                            </Link>
                            <Link to="/register" className="btn primary">
                                Register
                            </Link>
                        </>
                    )}
                </div>
                {isAuthenticated && user && (
                    <div className="profile-pill">
                        <button className="profile-trigger" onClick={() => setShowProfile(!showProfile)}>
                            <span className="profile-email">{user.email}</span>
                            <span className="role-tag">{user.role}</span>
                        </button>
                        {showProfile && (
                            <div className="profile-dropdown">
                                <p className="dropdown-title">Profile</p>
                                <p className="muted">Email: {user.email}</p>
                                {user.displayName && <p className="muted">Name: {user.displayName}</p>}
                                <p className="muted">Role: {user.role}</p>
                                <p className="muted">Theme: {user?.preferences?.theme || theme}</p>
                                <div className="dropdown-actions">
                                    <Link to="/profile" className="btn ghost" onClick={() => setShowProfile(false)}>
                                        View profile
                                    </Link>
                                    <button className="btn ghost" onClick={() => setShowProfile(false)}>
                                        Close
                                    </button>
                                    <button className="btn primary" onClick={handleLogout}>
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {isAuthenticated && showNotifications && (
                <div className="dropdown notifications">
                    <p className="dropdown-title">Notifications</p>
                    {recentNotifications.length === 0 && <p className="muted">No recent alerts.</p>}
                    {recentNotifications.map((note) => (
                        <p key={note.id} className="dropdown-item">
                            {note.text}
                        </p>
                    ))}
                </div>
            )}
            {isAuthenticated && showNewChat && (
                <div className="modal">
                    <div className="modal-card">
                        <h3>Start a new chat</h3>
                        <input
                            type="text"
                            value={chatTitle}
                            onChange={(event) => setChatTitle(event.target.value)}
                            placeholder="Chat title (optional)"
                        />
                        <input
                            type="text"
                            value={participants}
                            onChange={(event) => setParticipants(event.target.value)}
                            placeholder="Participant emails, comma separated"
                        />
                        <div className="modal-actions">
                            <button className="btn ghost" onClick={() => setShowNewChat(false)}>
                                Cancel
                            </button>
                            <button className="btn primary" onClick={handleCreateChat}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isAuthenticated && showSettings && (
                <div className="modal">
                    <div className="modal-card">
                        <h3>Settings</h3>
                        <p className="muted">Profile, theme, and notifications.</p>
                        <div className="toggle-row">
                            <span>Dark mode</span>
                            <button className="btn ghost" onClick={handleToggleTheme}>
                                {theme === 'light' ? 'Enable' : 'Disable'}
                            </button>
                        </div>
                        <div className="toggle-row">
                            <span>Notifications</span>
                            <button className="btn ghost" onClick={handleToggleNotifications}>
                                {notificationsEnabled ? 'Enabled' : 'Disabled'}
                            </button>
                        </div>
                        <div className="modal-actions">
                            <button className="btn primary" onClick={() => setShowSettings(false)}>
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isAuthenticated && showHelp && (
                <div className="modal">
                    <div className="modal-card">
                        <h3>Quick help</h3>
                        <p className="muted">Use the search bar to filter chats, open conversations, and send messages.</p>
                        <p className="muted">Admins can manage users and review feedback in the admin panel.</p>
                        <div className="modal-actions">
                            <button className="btn primary" onClick={() => setShowHelp(false)}>
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
