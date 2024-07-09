'use client';

import React from 'react';
import AdminLayout from './layout';
import Header from './components/Header';
import Footer from './components/Footer';

const AdminIndex = () => {
  return (
    <AdminLayout>
      <div className="admin-container">
        <Header />
        <main className="admin-main">
          <h1 className="admin-title">管理者ダッシュボード</h1>
          <p className="admin-description">ナビゲーションメニューを使用してメンバー、雇用主、求人を管理してください。</p>
        </main>
        <Footer />
      </div>
    </AdminLayout>
  );
};

export default AdminIndex;