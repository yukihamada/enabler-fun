"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '../layout';
import { db } from '../../../lib/firebase'
import { collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import '../admin.css';

const Members = () => {
  const [members, setMembers] = useState<Array<{ id: string; [key: string]: any }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const membersCollection = collection(db, 'users');
          const membersSnapshot = await getDocs(membersCollection);
          const membersList = membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setMembers(membersList);
          setLoading(false);
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
