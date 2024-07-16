import '@/app/globals.css'
import { ReactNode } from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <html lang="ja">
      <head />
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}
export default AdminLayout;