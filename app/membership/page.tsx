"use client";

import { useState, useEffect } from 'react';
import { Typography, Box, Paper, Button, Card, CardContent, Chip, Grid } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import { FaCrown, FaGem, FaTrophy } from 'react-icons/fa';
import Layout from '@/components/Layout';

const membershipLevels = [
  { 
    name: 'シルバー', 
    price: 10000, 
    icon: FaCrown,
    benefits: ['優先予約権', '月5回のクーポン（5%割引）', '専用カスタマーサポート', 'メンバー限定イベントへの参加権'] 
  },
  { 
    name: 'ゴールド', 
    price: 30000, 
    icon: FaGem,
    benefits: ['24時間前優先予約権', '月10回のクーポン（10%割引）', '24時間専用カスタマーサポート', 'メンバー限定イベントへの優先参加権', '年1回の無料宿泊券'] 
  },
  { 
    name: 'プラチナ', 
    price: 100000, 
    icon: FaTrophy,
    benefits: ['48時間前最優先予約権', '無制限クーポン（15%割引）', '専属コンシェルジュサービス', 'VIPイベントへの招待', '年3回の無料宿泊券', 'プライベートジェット利用割引'] 
  },
];

export default function MembershipPage() {
  const { user, isLoading } = useUser();
  const [currentMembership, setCurrentMembership] = useState('');

  useEffect(() => {
    async function fetchMembership() {
      try {
        const response = await fetch('/api/user/membership');
        const data = await response.json();
        setCurrentMembership(data.membership);
      } catch (error) {
        console.error('メンバーシップ情報の取得に失敗しました', error);
      }
    }

    if (user) {
      fetchMembership();
    }
  }, [user]);

  if (isLoading) return <Layout><div>読み込み中...</div></Layout>;

  if (!user) {
    return (
      <Layout>
        <Box className="bg-gradient-to-r from-purple-500 to-indigo-600 min-h-screen py-12">
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
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
      <Box className="bg-gradient-to-r from-purple-500 to-indigo-600 min-h-screen py-12">
        <Box className="container mx-auto px-4">
          <Paper className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
            <Typography variant="h3" className="mb-6 text-center flex items-center justify-center text-indigo-700">
              <FaCrown className="mr-4" /> メンバーシップ
            </Typography>
            <Typography variant="h6" className="mb-8 text-center text-gray-600">
              あなたの現在のメンバーシップ: <Chip label={currentMembership || 'なし'} color="primary" icon={<FaCrown />} />
            </Typography>

            <Grid container spacing={6}>
              {membershipLevels.map((level) => (
                <Grid item xs={12} md={4} key={level.name}>
                  <Card elevation={3} className="h-full flex flex-col bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300">
                    <CardContent className="flex-grow p-6">
                      <Typography variant="h5" className="mb-4 text-center font-semibold text-gray-700 flex items-center justify-center">
                        <level.icon className="mr-2 text-indigo-500" /> {level.name}
                      </Typography>
                      <Typography variant="h6" className="mb-4 text-center text-indigo-600">
                        ¥{level.price.toLocaleString()} / 月
                      </Typography>
                      <ul className="list-disc pl-6 mb-4 text-gray-600">
                        {level.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </CardContent>
                    <Box className="p-6 pt-0">
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={currentMembership === level.name}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        {currentMembership === level.name ? '現在のプラン' : 'アップグレード'}
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
      </Box>
    </Layout>
  );
}