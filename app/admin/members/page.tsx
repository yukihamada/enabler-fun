"use client";

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import AdminLayout from '../layout';
import Loader from '../components/Loader';
import '../admin.css';

const Members = () => {
  const [members, setMembers] = useState<Array<{ id: string; [key: string]: any }>>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    // ログアウト処理を実装
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
    <AdminLayout>
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
  );
};

export default Members;