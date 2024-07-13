'use client'

import React from 'react';
import Link from 'next/link';
import '../admin.css';

const Header = ({ isLoggedIn, onLogout }: { isLoggedIn: boolean, onLogout: () => void }) => {
  return (
    <header className="header">
      <nav>
        <ul className="nav-list">
          {isLoggedIn ? (
            <>
              <li className="nav-item"><Link href="/admin/members">会員</Link></li>
              <li className="nav-item"><Link href="/admin/owners">物件主</Link></li>
              <li className="nav-item"><Link href="/admin/properties">物件</Link></li>
              <li className="nav-item"><Link href="/admin/storage">ストレージ</Link></li>
              <li className="nav-item"><button onClick={onLogout}>ログアウト</button></li>
            </>
          ) : (
            <li className="nav-item"><Link href="/admin/login">ログイン</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;