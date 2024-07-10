"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '../layout';
import { supabase } from '../../../lib/supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import '../admin.css';

const Members = () => {
  const [members, setMembers] = useState<Array<{ id: string; [key: string]: any }>>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchMembers = async () => {
      const session = supabase.auth.session();
      if (session?.user) {
        const { data, error } = await supabase
          .from('users')
          .select('*');

        if (error) {
          console.error("メンバーの取得中にエラーが発生しました:", error);
        } else {
          setMembers(data);
          setLoading(false);
        }
      }
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
