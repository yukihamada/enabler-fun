import '@/app/globals.css'
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <html lang="ja">
      <head />
      <body>{children}</body>
    </html>
  )
}
export default AdminLayout;