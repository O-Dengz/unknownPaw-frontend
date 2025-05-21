// src/components/ChatBox.tsx
import { useState } from "react";
import './ChatBox.css'; // CSS 분리

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, message]);
    setMessage("");
  };

  return (
    <div className="chat-box">
      <div className="chat-header">채팅</div>

      <div className="chat-messages">
  {messages.map((msg, i) => (
    <div
      key={i}
      className={`chat-message ${i % 2 === 0 ? 'sent' : 'received'}`} // 보낸/받은 메시지 스타일 구분
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
