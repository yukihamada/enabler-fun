import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';

export default async function checkAdmin(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
    if (!session || !session.user) {
      return res.status(401).json({ error: '認証されていません' });
    }

    // Auth0のカスタムクレームから管理者権限を確認
    const isAdmin = session.user['https://enabler.fun/roles']?.includes('admin');

    res.status(200).json({ isAdmin });
  } catch (error) {
    console.error('管理者チェック中にエラーが発生しました:', error);
    res.status(500).json({ error: '内部サーバーエラー' });
  }
}