'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClientComponentClient, Session } from '@supabase/auth-helpers-nextjs';
import '../admin.css';

const Header = () => {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="header">
      <nav>
        <ul className="nav-list">
          {session ? (
            <>
              <li className="nav-item"><Link href="/admin/members">会員</Link></li>
              <li className="nav-item"><Link href="/admin/owners">物件主</Link></li>
              <li className="nav-item"><Link href="/admin/properties">物件</Link></li>
              <li className="nav-item"><Link href="/admin/storage">ストレージ</Link></li>
              <li className="nav-item"><button onClick={handleLogout}>ログアウト</button></li>
            </>
          ) : (
            <li className="nav-item"><Link href="/admin/storage">ログイン</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;