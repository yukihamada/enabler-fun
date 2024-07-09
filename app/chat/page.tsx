'use client';

import { useState, useRef, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '../../lib/firebase';
import { IoSend } from 'react-icons/io5';
import styles from './Chat.module.css';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => setUser(user));
  }, []);

  const sendMessage = async () => {
    if (!user) return;
    const idToken = await user.getIdToken();
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, idToken }),
    });
    const data = await res.json();
    setMessages([...messages, { text: input, from: 'user' }, ...data.map(d => ({ text: d.text, from: 'bot' }))]);
    setInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>チャットボット</h1>
      <div className={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${styles[msg.from]}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className={styles.inputArea}>
        <input
          className={styles.input}
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="メッセージを入力..."
        />
        <button className={styles.button} onClick={sendMessage}>
          <IoSend />
        </button>
      </div>
    </div>
  );
}