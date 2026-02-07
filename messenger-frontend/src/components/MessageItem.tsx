import React from 'react';

interface MessageItemProps {
  sender: string;
  content: string;
  timestamp: string;
  isOwn?: boolean;
  edited?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ sender, content, timestamp, isOwn = false, edited = false }) => {
  return (
    <div className={`message-item ${isOwn ? 'sent' : 'received'}`}>
      <div className="message-header">
        <span className="message-sender">{sender}</span>
        <span className="message-timestamp">
          {timestamp} {edited && <span>(edited)</span>}
        </span>
      </div>
      <div className="message-content">{content}</div>
    </div>
  );
};

export default MessageItem;
