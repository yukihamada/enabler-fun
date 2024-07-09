'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { IoSend } from 'react-icons/io5';
import styles from './Chat.module.css';

interface Message {
  text: string;
  from: 'user' | 'bot';
  createdAt: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(50));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newMessages = snapshot.docs.map(doc => doc.data() as Message).reverse();
        setMessages(newMessages);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const sendMessage = async () => {
    if (!user || !input.trim()) return;

    const newMessage: Message = {
      text: input,
      from: 'user',
      createdAt: new Date()
    };

    try {
      await addDoc(collection(db, 'messages'), newMessage);

      // ここでボットの応答を生成するCloud Functionを呼び出す
      const botResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({ message: input }),
      });

      const botData = await botResponse.json() as { text: string }[];
      
      for (const botMessage of botData) {
        await addDoc(collection(db, 'messages'), {
          text: botMessage.text,
          from: 'bot',
          createdAt: new Date()
        });
      }

      setInput('');
    } catch (error) {
      console.error("メッセージの送信中にエラーが発生しました:", error);
      alert("メッセージの送信に失敗しました。もう一度お試しください。");
    }
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