import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, updateMyProfile } from '../services/api';
import { setUser } from '../store/authSlice';
import type { AppDispatch, RootState } from '../store';

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleProfileSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('');
    const updated = await updateMyProfile({ displayName });
    dispatch(setUser(updated));
    setStatus('Profile updated.');
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('');
    await changePassword({ currentPassword, newPassword });
    setCurrentPassword('');
    setNewPassword('');
    setStatus('Password updated.');
  };

  return (
    <div className="page profile-page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Profile</p>
          <h2>Manage your account</h2>
          <p className="muted">Update your profile details and password.</p>
        </div>
      </section>
      {status && <p className="alert">{status}</p>}
      <section className="card">
        <h3>Profile details</h3>
        <form className="auth-form" onSubmit={handleProfileSave}>
          <label className="field">
            <span>Email</span>
            <input value={user?.email || ''} disabled />
          </label>
          <label className="field">
            <span>Display name</span>
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </label>
          <button className="btn primary" type="submit">
            Save profile
          </button>
        </form>
      </section>
      <section className="card">
        <h3>Change password</h3>
        <form className="auth-form" onSubmit={handlePasswordChange}>
          <label className="field">
            <span>Current password</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>New password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>
          <button className="btn primary" type="submit">
            Update password
          </button>
        </form>
      </section>
    </div>
  );
};

export default Profile;
