import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  deleteChat,
  deleteUser,
  getAllChats,
  getFeedback,
  getUsers,
  restoreUser,
  setUserBlocked,
  updateChat,
  updateUserRole,
} from '../services/api';
import type { RootState } from '../store';

const Admin: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [usersData, feedbackData, chatsData] = await Promise.all([
          getUsers(),
          getFeedback(),
          getAllChats(),
        ]);
        setUsers(usersData);
        setFeedback(feedbackData);
        setChats(chatsData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load admin data');
      }
    };
    if (user?.role === 'admin') {
      load();
    }
  }, [user]);

  if (user?.role !== 'admin') {
    return (
      <div className="page">
        <section className="card">
          <p className="muted">Admin access required.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="page admin-page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Admin Panel</p>
          <h2>Manage users and feedback</h2>
          <p className="muted">Review your platform activity in one place.</p>
        </div>
      </section>
      {error && <p className="alert">{error}</p>}
      <section className="card">
        <h3>Users</h3>
        <ul className="admin-list">
          {users.map((item) => (
            <li key={item._id || item.id}>
              <div>
                <p className="chat-title">{item.email}</p>
                <p className="muted">
                  Role: {item.role || 'user'} | Blocked: {item.isBlocked ? 'Yes' : 'No'} | Deleted:{' '}
                  {item.isDeleted ? 'Yes' : 'No'}
                </p>
              </div>
              <div className="admin-actions">
                <select
                  value={item.role || 'user'}
                  onChange={async (event) => {
                    const updated = await updateUserRole(item._id || item.id, event.target.value as 'user' | 'admin');
                    setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
                  }}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
                <button
                  className="btn ghost"
                  onClick={async () => {
                    const updated = await setUserBlocked(item._id || item.id, !item.isBlocked);
                    setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
                  }}
                >
                  {item.isBlocked ? 'Unblock' : 'Block'}
                </button>
                {!item.isDeleted ? (
                  <button
                    className="btn ghost"
                    onClick={async () => {
                      await deleteUser(item._id || item.id);
                      setUsers((prev) =>
                        prev.map((u) => (u._id === item._id ? { ...u, isDeleted: true } : u))
                      );
                    }}
                  >
                    Delete
                  </button>
                ) : (
                  <button
                    className="btn ghost"
                    onClick={async () => {
                      const updated = await restoreUser(item._id || item.id);
                      setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
                    }}
                  >
                    Restore
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="card">
        <h3>Chats</h3>
        <ul className="admin-list">
          {chats.map((chat) => (
            <li key={chat._id || chat.id}>
              <div>
                <p className="chat-title">{chat.title || 'Untitled chat'}</p>
                <p className="muted">
                  Participants: {(chat.participants || []).map((p: any) => p.email).join(', ')}
                </p>
              </div>
              <div className="admin-actions">
                <button
                  className="btn ghost"
                  onClick={async () => {
                    const title = window.prompt('New chat title', chat.title || 'Chat');
                    if (title === null) return;
                    const updated = await updateChat(chat._id || chat.id, { title });
                    setChats((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
                  }}
                >
                  Rename
                </button>
                <button
                  className="btn ghost"
                  onClick={async () => {
                    await deleteChat(chat._id || chat.id);
                    setChats((prev) => prev.filter((c) => c._id !== chat._id));
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="card">
        <h3>Feedback</h3>
        <ul className="admin-list">
          {feedback.map((item) => (
            <li key={item._id || item.id}>
              <p className="chat-title">{item.email}</p>
              <p className="muted">{item.message}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Admin;
