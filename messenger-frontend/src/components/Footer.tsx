import React, { useState } from 'react';
import { submitFeedback } from '../services/api';

const Footer: React.FC = () => {
    const [showContact, setShowContact] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('');
        try {
            await submitFeedback({ name, email, message });
            setStatus('Thanks! We received your message.');
            setName('');
            setEmail('');
            setMessage('');
        } catch (error: any) {
            setStatus(error.response?.data?.message || 'Failed to send feedback.');
        }
    };

    return (
        <footer className="site-footer">
            <p>&copy; 2026 Vibegram. All rights reserved.</p>
            <div className="footer-links">
                <span>Secure messaging</span>
                <span>API ready</span>
                <span>Responsive UI</span>
            </div>
            <button className="btn ghost" onClick={() => setShowContact(true)}>
                Contact us
            </button>
            {showContact && (
                <div className="modal">
                    <div className="modal-card">
                        <h3>Contact us</h3>
                        <form className="auth-form" onSubmit={handleSubmit}>
                            <label className="field">
                                <span>Name (optional)</span>
                                <input value={name} onChange={(e) => setName(e.target.value)} />
                            </label>
                            <label className="field">
                                <span>Email</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </label>
                            <label className="field">
                                <span>Message</span>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={4}
                                    required
                                />
                            </label>
                            {status && <p className="muted">{status}</p>}
                            <div className="modal-actions">
                                <button className="btn ghost" type="button" onClick={() => setShowContact(false)}>
                                    Close
                                </button>
                                <button className="btn primary" type="submit">
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </footer>
    );
};

export default Footer;
