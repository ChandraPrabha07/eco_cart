import React from 'react';

export default function Notification({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="notification">
      {message}
      <button className="notification-close" onClick={onClose}>×</button>
      <style jsx>{`
        .notification {
          position: fixed;
          top: 30px;
          right: 30px;
          background: #2ecc71;
          color: white;
          padding: 16px 32px;
          border-radius: 8px;
          font-size: 1.1rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.12);
          z-index: 1000;
          display: flex;
          align-items: center;
        }
        .notification-close {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          margin-left: 16px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

