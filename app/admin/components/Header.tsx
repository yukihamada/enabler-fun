'use client'

import React from 'react';
import Link from 'next/link';
import '../admin.css';

const Header = () => {
  return (
    <header className="header">
      <nav>
        <ul className="nav-list">
          <li className="nav-item"><Link href="/admin/members">会員</Link></li>
          <li className="nav-item"><Link href="/admin/owners">物件主</Link></li>
          <li className="nav-item"><Link href="/admin/properties">物件</Link></li>
          <li className="nav-item"><Link href="/admin/storage">ストレージ</Link></li>
          <li className="nav-item"><Link href="/admin/login">ログイン</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;