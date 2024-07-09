"use client";

import React, { useState } from 'react';
import AdminLayout from '../layout';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../admin.css';


const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    adminEmail: '',
    theme: 'light',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setSettings((prevState) => ({ ...prevState, [id]: value }));
  };

  const saveSettings = () => {
    // 設定を保存するロジックをここに追加
    console.log('Settings saved:', settings);
  };

  return (
    <div className="admin-container">
      <Header />
      <AdminLayout>
        <h1>Settings</h1>
        <div>
          <label htmlFor="siteName">Site Name</label>
          <input
            type="text"
            id="siteName"
            value={settings.siteName}
            onChange={handleChange}
            placeholder="Enter site name"
          />
        </div>
        <div>
          <label htmlFor="adminEmail">Admin Email</label>
          <input
            type="email"
            id="adminEmail"
            value={settings.adminEmail}
            onChange={handleChange}
            placeholder="Enter admin email"
          />
        </div>
        <div>
          <label htmlFor="theme">Theme</label>
          <select id="theme" value={settings.theme} onChange={handleChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <button onClick={saveSettings}>Save Settings</button>
      </AdminLayout>
      <Footer />
    </div>
  );
};

export default Settings;
