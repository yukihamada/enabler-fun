import { handleAuth, handleLogin, handleCallback, handleLogout, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

export const GET = handleAuth({
  login: handleLogin({
    returnTo: process.env.AUTH0_LOGIN_RETURN_TO || '/dashboard',
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      scope: 'openid profile email',
      prompt: 'login', // これを追加
    }
  }),
  callback: handleCallback({
    redirectUri: `${process.env.AUTH0_BASE_URL}/api/auth/callback`,
    afterCallback: (req, res, session, state) => {
      console.log('Callback successful', { session, state });
      return session;
    },
  }),
  logout: handleLogout({
    returnTo: `${process.env.AUTH0_BASE_URL}/`,
    logoutParams: {
      returnTo: `${process.env.AUTH0_BASE_URL}/`,
      client_id: process.env.AUTH0_CLIENT_ID,
    },
  }),
});

export const getSession = withApiAuthRequired(async function getSession(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // セッション関連のロジックをここに実装
  // 例: res.status(200).json({ message: 'Authenticated session' });
});

// セッション設定は別途設定する必要があります
// Auth0の設定ファイルや環境変数で行うことが推奨されます