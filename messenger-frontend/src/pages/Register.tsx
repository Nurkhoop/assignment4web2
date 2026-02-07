import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../store/authSlice';
import type { AppDispatch, RootState } from '../store';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await dispatch(registerUser({ email, password })).unwrap();
            navigate('/conversations');
        } catch {
            // handled by slice
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <p className="eyebrow">Get started</p>
                    <h2>Create your account</h2>
                    <p className="muted">Join the conversation in seconds.</p>
                </div>
                {error && <p className="alert">{error}</p>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <label className="field">
                        <span>Email</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </label>
                    <label className="field">
                        <span>Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Create a secure password"
                        />
                    </label>
                    <button type="submit" className="btn primary" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>
                <p className="auth-footer">
                    Already registered? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
