'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
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
    const session = supabase.auth.session();
    setUser(session?.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      const fetchMessages = async () => {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('createdAt', { ascending: false })
          .limit(50);

        if (error) {
          console.error("メッセージの取得中にエラーが発生しました:", error);
        } else {
          setMessages(data.reverse() as Message[]);
        }
      };

      fetchMessages();
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
      const { error } = await supabase
        .from('messages')
        .insert(newMessage);

      if (error) {
        throw error;
      }

      // ここでボットの応答を生成するCloud Functionを呼び出す
      const botResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify({ message: input }),
      });

      const botData = await botResponse.json() as { text: string }[];
      
      for (const botMessage of botData) {
        await supabase
          .from('messages')
          .insert({
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
