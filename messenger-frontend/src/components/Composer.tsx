import React, { useState } from 'react';

interface ComposerProps {
    onSend: (message: string) => void;
}

const Composer: React.FC<ComposerProps> = ({ onSend }) => {
    const [message, setMessage] = useState('');

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (message.trim()) {
            onSend(message.trim());
            setMessage('');
        }
    };

    return (
        <div className="composer">
            <form onSubmit={handleSendMessage} className="composer-form">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit" className="btn primary">
                    Send
                </button>
            </form>
        </div>
    );
};

export default Composer;
