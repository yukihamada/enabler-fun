'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getFirestore, collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
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
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (user) {
      const db = getFirestore();
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(50));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedMessages = querySnapshot.docs.map(doc => doc.data() as Message);
        setMessages(fetchedMessages.reverse());
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
      const db = getFirestore();
      await addDoc(collection(db, 'messages'), {
        ...newMessage,
        createdAt: serverTimestamp()
      });

      // ここでボットの応答を生成するCloud Functionを呼び出す
      const botResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.idToken}`
        },
        body: JSON.stringify({ message: input }),
      });

      const botData = await botResponse.json() as { text: string }[];
      
      for (const botMessage of botData) {
        await addDoc(collection(db, 'messages'), {
          text: botMessage.text,
          from: 'bot',
          createdAt: serverTimestamp()
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