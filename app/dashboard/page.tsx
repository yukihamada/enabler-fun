"use client";

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useUser } from '@auth0/nextjs-auth0/client';
import { UserProfile } from '@auth0/nextjs-auth0/client';
import { Typography, Grid, Paper, Button, Box, Avatar, Card, CardContent, CardMedia, CardActions, Skeleton } from '@mui/material';
import { FaHome, FaCalendarAlt, FaUserPlus, FaShareAlt, FaPlus, FaSearch, FaStar, FaCrown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Property {
  id: string;
  title: string;
  imageUrls: string[] | string;
  price: number;
}

export default function Dashboard() {
  const { user, error, isLoading: userLoading } = useUser() as { user: UserProfile | undefined, error: Error | undefined, isLoading: boolean };
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      setPropertiesLoading(true);
      const q = query(collection(db, 'properties'), limit(3));
      const querySnapshot = await getDocs(q);
      const propertyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
      setFeaturedProperties(propertyData);
      setPropertiesLoading(false);
    };

    fetchFeaturedProperties();
  }, []);

  // URLの妥当性をチェックする関数
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Layout>
      <Box className="bg-gradient-to-r from-blue-500 to-indigo-600 min-h-screen py-12">
        <Box className="container mx-auto px-4">
          <Box className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <Typography variant="h3" className="text-center mb-12 font-bold text-gray-800">
              理想の宿泊体験を見つけよう
            </Typography>

            {!userLoading && !user && (
              <Box className="text-center mb-12">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<FaUserPlus />}
                  href="/api/auth/login"
                  className="mr-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  会員登録
                </Button>
                <Typography variant="body1" className="mt-4 text-gray-600">
                  会員登録で特別割引や予約の優先権が得られます！
                </Typography>
              </Box>
            )}

            <Grid container spacing={6} className="mb-16">
              <Grid item xs={12} md={6}>
                <Card elevation={3} className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300">
                  <CardContent className="flex-grow p-6">
                    <Typography variant="h5" className="mb-4 font-semibold text-gray-700 flex items-center">
                      <FaSearch className="mr-3 text-indigo-500" /> 物件を探す
                    </Typography>
                    <Typography variant="body1" className="mb-6 text-gray-600">
                      目的地、日程、人数を入力して、理想の宿泊先を見つけましょう。
                    </Typography>
                  </CardContent>
                  <CardActions className="p-6 pt-0">
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<FaCalendarAlt />}
                      href="/search"
                      fullWidth
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                    >
                      宿泊先を検索
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={3} className="h-full flex flex-col bg-gradient-to-br from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 transition-all duration-300">
                  <CardContent className="flex-grow p-6">
                    <Typography variant="h5" className="mb-4 font-semibold text-gray-700 flex items-center">
                      <FaHome className="mr-3 text-teal-500" /> 物件を紹介する
                    </Typography>
                    <Typography variant="body1" className="mb-6 text-gray-600">
                      あなたの物件を紹介して、世界中のゲストとつながりましょう。
                    </Typography>
                  </CardContent>
                  <CardActions className="p-6 pt-0">
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      startIcon={<FaPlus />}
                      href="/properties/new"
                      fullWidth
                      className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                    >
                      新しい物件を登録
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>

            <Box className="mb-16">
              <Typography variant="h4" className="mb-8 font-semibold text-gray-800 text-center">
                注目の物件
              </Typography>
              <Grid container spacing={6}>
                {propertiesLoading
                  ? Array.from(new Array(3)).map((_, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card elevation={3} className="h-full">
                          <Skeleton variant="rectangular" height={200} />
                          <CardContent>
                            <Skeleton variant="text" width="80%" />
                            <Skeleton variant="text" width="40%" />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  : featuredProperties.map((property) => (
                      <Grid item xs={12} sm={6} md={4} key={property.id}>
                        <Card elevation={3} className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
                          <Box className="relative h-48">
                            {(() => {
                              const validImageUrls = (Array.isArray(property.imageUrls)
                                ? property.imageUrls
                                : typeof property.imageUrls === 'string'
                                ? property.imageUrls.split(',').map(url => url.trim())
                                : []).filter(isValidUrl);

                              return validImageUrls.length > 0 ? (
                                <Image
                                  src={validImageUrls[0]}
                                  alt={property.title}
                                  layout="fill"
                                  objectFit="cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500">画像なし</span>
                                </div>
                              );
                            })()}
                          </Box>
                          <CardContent className="flex-grow p-6">
                            <Typography variant="h6" className="font-semibold mb-2">{property.title}</Typography>
                            <Typography variant="body1" className="text-gray-600 mb-4">¥{property.price.toLocaleString()} / 泊</Typography>
                          </CardContent>
                          <CardActions className="p-6 pt-0">
                            <Button
                              variant="outlined"
                              color="primary"
                              href={`/properties/${property.id}`}
                              fullWidth
                              className="hover:bg-blue-50"
                            >
                              詳細を見る
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
              </Grid>
            </Box>

            <Box className="mb-16">
              <Typography variant="h4" className="mb-8 font-semibold text-gray-800 text-center">
                その他のサービス
              </Typography>
              <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                  <Card elevation={3} className="h-full flex flex-col bg-gradient-to-br from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 transition-all duration-300">
                    <CardContent className="flex-grow p-6">
                      <Typography variant="h5" className="mb-4 font-semibold text-gray-700 flex items-center">
                        <FaShareAlt className="mr-3 text-orange-500" /> お知り合いに紹介する
                      </Typography>
                      <Typography variant="body1" className="mb-6 text-gray-600">
                        素敵な体験を友達や家族と共有しましょう。紹介すると特典が得られます！
                      </Typography>
                    </CardContent>
                    <CardActions className="p-6 pt-0">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FaShareAlt />}
                        href="/refer"
                        fullWidth
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                      >
                        友達を紹介する
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card elevation={3} className="h-full flex flex-col bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300">
                    <CardContent className="flex-grow p-6">
                      <Typography variant="h5" className="mb-4 font-semibold text-gray-700 flex items-center">
                        <FaCrown className="mr-3 text-pink-500" /> メンバーシップ会員登録
                      </Typography>
                      <Typography variant="body1" className="mb-6 text-gray-600">
                        メンバーシップ会員登録で、特別な特典や優先権が得られます。
                      </Typography>
                    </CardContent>
                    <CardActions className="p-6 pt-0">
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<FaCrown />}
                        href="/membership"
                        fullWidth
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        メンバーシップ会員登録
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}