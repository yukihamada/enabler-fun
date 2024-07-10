"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '../layout';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import '../admin.css';

const Members = () => {
  const [members, setMembers] = useState<Array<{ id: string; [key: string]: any }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const fetchMembers = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
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
        }
      });
    };

    fetchMembers();
  }, []);

  return (
    <div className="admin-container">
      <Header />
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
      <Footer />
    </div>
  );
};

export default Members;