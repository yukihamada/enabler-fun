"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '@/lib/firebase'; // Firebaseの認証をインポート
import AdminLayout from '../layout';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import '../admin.css';

const Members = () => {
  const [members, setMembers] = useState<Array<{ id: string; [key: string]: any }>>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        router.push('/login'); // ログインしていない場合はログインページにリダイレクト
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = () => {
    auth.signOut().then(() => {
      router.push('/login');
    }).catch((error) => {
      console.error('ログアウトエラー:', error);
    });
  };

  useEffect(() => {
    const db = getFirestore();

    const fetchMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const membersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMembers(membersData);
      } catch (error) {
        console.error("メンバーの取得中にエラーが発生しました:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="admin-container">
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <AdminLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
        {loading ? <Loader /> : (
          <>
            <h1>Members</h1>
            <ul>
              {members.map(member => (
                <li key={member.id}>
                  {member.email}
                </li>
              ))}
            </ul>
          </>
        )}
      </AdminLayout>
      <Footer />
    </div>
  );
};

export default Members;