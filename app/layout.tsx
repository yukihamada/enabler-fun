import '@/app/globals.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
// コメントアウトまたは削除: import 'react-big-calendar/lib/css/react-big-calendar.css.map';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, isLoggedIn, onLogout }) => {
  return (
    <html lang="ja">
      <head />
      <body>{children}</body>
    </html>
  )
}

export default AdminLayout;