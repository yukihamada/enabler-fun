'use client';

import React, { ReactNode } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      <main>{children}</main>
    </>
  );
};