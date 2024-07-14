'use client';

import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

interface AdminLayoutProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, isLoggedIn: propIsLoggedIn, onLogout }) => {
  const [localIsLoggedIn, setLocalIsLoggedIn] = useState(propIsLoggedIn);

  const handleLogout = () => {
    // ログアウト処理
    setLocalIsLoggedIn(false);
    onLogout();
  };

  return (
    <>
      <Header isLoggedIn={localIsLoggedIn} onLogout={handleLogout} />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default AdminLayout;