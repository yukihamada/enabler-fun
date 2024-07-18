import { handleAuth, handleLogin, handleCallback, handleLogout } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    returnTo: process.env.AUTH0_LOGIN_RETURN_TO || '/dashboard'
  }),
  callback: handleCallback({
    redirectUri: `${process.env.AUTH0_BASE_URL}/api/auth/callback`
  }),
  logout: handleLogout({
    returnTo: process.env.AUTH0_BASE_URL,
    logoutParams: {
      returnTo: process.env.AUTH0_BASE_URL,
      client_id: process.env.AUTH0_CLIENT_ID
    }
  })
});