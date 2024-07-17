import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    returnTo: '/dashboard'
  }),
  callback: handleCallback({
    redirectUri: 'http://localhost:3001/api/auth/callback'
  })
});