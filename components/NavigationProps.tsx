import React from 'react';
import Link from 'next/link';

interface NavigationProps {
  isMenuOpen: boolean;
}

export default function Navigation({ isMenuOpen }: NavigationProps) {
  return (
    <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
      <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
        <li><Link href="/properties">物件一覧</Link></li>
        <li><Link href="/bookings">予約状況</Link></li>
        <li><Link href="/account">アカウント</Link></li>
      </ul>
    </nav>
  );
}