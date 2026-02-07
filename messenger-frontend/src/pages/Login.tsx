import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../store/authSlice';
import type { AppDispatch, RootState } from '../store';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await dispatch(loginUser({ email, password })).unwrap();
            navigate('/conversations');
        } catch {
            // handled by slice
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <p className="eyebrow">Welcome back</p>
                    <h2>Sign in to continue</h2>
                    <p className="muted">Access your conversations and messages.</p>
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
                            placeholder="••••••••"
                        />
                    </label>
                    <button type="submit" className="btn primary" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
                <p className="auth-footer">
                    New here? <Link to="/register">Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
