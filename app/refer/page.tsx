"use client";

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Typography, Box, TextField, Button, Paper, Snackbar, Card, CardContent, InputAdornment, IconButton, Tooltip, Fade, Divider } from '@mui/material';
import { FaShareAlt, FaGift, FaPercent, FaUserFriends, FaHotel, FaCopy, FaFacebook, FaTwitter, FaLine, FaWhatsapp, FaEnvelope, FaStar } from 'react-icons/fa';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function ReferPage() {
  const { user, isLoading } = useUser();
  const [referralLink, setReferralLink] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      // 実際のアプリケーションでは、ユーザー固有の紹介コードをバックエンドから取得する
      const dummyReferralCode = 'ABC123';
      setReferralLink(`${window.location.origin}/signup?ref=${dummyReferralCode}`);
    }
  }, [user]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setSnackbarMessage('リンクをコピーしました！');
      setOpenSnackbar(true);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareOnSocialMedia = (platform: string) => {
    let url = '';
    const text = encodeURIComponent('素敵な宿泊体験を一緒に楽しみましょう！今すぐ登録すると特別割引が受けられます。');
    
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}&text=${text}`;
        break;
      case 'line':
        url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(referralLink)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${text} ${encodeURIComponent(referralLink)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent('素敵な宿泊体験を紹介します')}&body=${text} ${encodeURIComponent(referralLink)}`;
        break;
    }

    window.open(url, '_blank');
  };

  if (isLoading) return <div>読み込み中...</div>;

  if (!user) {
    return (
      <Layout>
        <Box className="bg-gradient-to-r from-blue-500 to-indigo-600 min-h-screen py-12">
          <Box className="container mx-auto px-4">
            <Paper className="p-8 max-w-md mx-auto">
              <Typography variant="h4" className="mb-4 text-center">
                ログインが必要です
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                href="/api/auth/login"
              >
                ログイン
              </Button>
            </Paper>
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box className="bg-gradient-to-r from-blue-500 to-indigo-600 min-h-screen py-12">
        <Box className="container mx-auto px-4">
          <Paper className="p-8 max-w-2xl mx-auto">
            <Typography variant="h3" className="mb-6 text-center flex items-center justify-center text-indigo-700">
              <FaShareAlt className="mr-4" /> 友達を紹介する
            </Typography>
            <Typography variant="h6" className="mb-8 text-center text-gray-600">
              友達を紹介して、お得な特典を獲得しましょう！
            </Typography>

            <Box className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card elevation={3} className="bg-gradient-to-br from-yellow-50 to-orange-50 transform hover:scale-105 transition-transform duration-300">
                <CardContent>
                  <Typography variant="h5" className="mb-4 flex items-center text-orange-700">
                    <FaGift className="mr-2" /> あなたの特典
                  </Typography>
                  <Box className="space-y-2">
                    <Typography variant="body1" className="flex items-center">
                      <FaPercent className="mr-2 text-green-500" /> 宿泊費の10%がポイントとして貯まる
                    </Typography>
                    <Typography variant="body1" className="flex items-center">
                      <FaHotel className="mr-2 text-blue-500" /> 紹介した物件の予約で追加5%ポイント
                    </Typography>
                    <Divider className="my-2" />
                    <Typography variant="body1" className="flex items-center font-semibold text-red-600">
                      <FaStar className="mr-2" /> 友達紹介で最大20%ポイントがもらえる
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card elevation={3} className="bg-gradient-to-br from-green-50 to-teal-50 transform hover:scale-105 transition-transform duration-300">
                <CardContent>
                  <Typography variant="h5" className="mb-4 flex items-center text-teal-700">
                    <FaUserFriends className="mr-2" /> 友達の特典
                  </Typography>
                  <Box className="space-y-2">
                    <Typography variant="body1" className="flex items-center">
                      <FaPercent className="mr-2 text-red-500" /> 初回予約時に10%割引
                    </Typography>
                    <Typography variant="body1" className="flex items-center">
                      <FaGift className="mr-2 text-purple-500" /> 1,000円分のウェルカムクーポン
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <Box className="mb-8">
              <Typography variant="h5" className="mb-4 text-center">
                あなたの紹介リンク
              </Typography>
              <TextField
                value={referralLink}
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="コピー" placement="top" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
                        <IconButton onClick={copyToClipboard} edge="end" color={copied ? "primary" : "default"}>
                          <FaCopy />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box className="mb-8">
              <Typography variant="h5" className="mb-4 text-center">
                SNSで共有する
              </Typography>
              <Box className="flex justify-center space-x-4">
                <Tooltip title="Facebookで共有" placement="top">
                  <IconButton onClick={() => shareOnSocialMedia('facebook')} className="text-blue-600 hover:bg-blue-100 transition-colors duration-300">
                    <FaFacebook size={24} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Twitterで共有" placement="top">
                  <IconButton onClick={() => shareOnSocialMedia('twitter')} className="text-blue-400 hover:bg-blue-100 transition-colors duration-300">
                    <FaTwitter size={24} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="LINEで共有" placement="top">
                  <IconButton onClick={() => shareOnSocialMedia('line')} className="text-green-500 hover:bg-green-100 transition-colors duration-300">
                    <FaLine size={24} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="WhatsAppで共有" placement="top">
                  <IconButton onClick={() => shareOnSocialMedia('whatsapp')} className="text-green-600 hover:bg-green-100 transition-colors duration-300">
                    <FaWhatsapp size={24} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="メールで共有" placement="top">
                  <IconButton onClick={() => shareOnSocialMedia('email')} className="text-gray-600 hover:bg-gray-100 transition-colors duration-300">
                    <FaEnvelope size={24} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Layout>
  );
}