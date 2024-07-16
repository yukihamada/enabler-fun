
import '@/app/globals.css'
import { ReactNode } from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head />
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}
