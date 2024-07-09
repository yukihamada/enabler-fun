'use client';

import React from 'react';
import Script from 'next/script';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

export default AdminLayout;