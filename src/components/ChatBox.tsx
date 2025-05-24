// src/components/ChatBox.tsx
import { useState } from "react";
import './ChatBox.css';

type ChatBoxProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ChatBox({ isOpen, onClose }: ChatBoxProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, message]);
    setMessage("");
  };

  if (!isOpen) return null;

  return (
    <div className="chat-box">
      <div className="chat-header">
        채팅
        <button
          onClick={onClose}
          style={{
            float: "right",
            background: "none",
            border: "none",
            fontSize: "18px",
            cursor: "pointer"
          }}
        >
          ✖
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${i % 2 === 0 ? 'sent' : 'received'}`}
          >
            {msg}
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="chat-input"
        />
        <button onClick={handleSend} className="chat-send-btn">전송</button>
      </div>
    </div>
  );
}
