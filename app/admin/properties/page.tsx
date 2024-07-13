"use client";

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../layout';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import '../admin.css';
import { Button, TextField, Typography, Paper, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Timestamp } from 'firebase/firestore';

interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  isPublished: boolean;
  createdAt?: Timestamp;
}

interface NewProperty {
  title: string;
  description: string;
  address: string;
  isPublished: boolean;
}

const requiredFields = [
  { 
    id: 'title', 
    label: '物件タイトルを入力してください。', 
    type: 'text', 
    placeholder: '物件タイトル', 
    example: '例: 渋谷駅徒歩5分！モダンな1LDKアパートメント'
  },
  { 
    id: 'description', 
    label: '物件の説明を入力してください。', 
    type: 'textarea', 
    placeholder: '物件の説明', 
    example: '例: 渋谷の中心部にある明るく清潔な1LDKアパートメント。最新の家電を完備し、長期滞在にも最適です。'
  },
  { 
    id: 'address', 
    label: '物件の所在地を入力してください。', 
    type: 'text', 
    placeholder: '所在地', 
    example: '例: 東京都渋谷区神南1-2-3'
  }
];

const Properties = () => {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [newProperty, setNewProperty] = useState<NewProperty>({ title: '', description: '', address: '', isPublished: true });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatTimestamp = (timestamp: Timestamp | undefined) => {
    if (timestamp && timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleString('ja-JP');
    }
    return '日時不明';
  };

  useEffect(() => {
    setLoading(true);
    const propertiesCollection = collection(db, 'properties');
    
    const unsubscribe = onSnapshot(propertiesCollection, (snapshot) => {
      const propertiesList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          address: data.address,
          isPublished: data.isPublished,
          createdAt: data.createdAt
        } as Property;
      });
      setProperties(propertiesList);
      setLoading(false);
    }, (error) => {
      console.error('データの取得中にエラーが発生しました:', error);
      setLoading(false);
    });

    // クリーンアップ関数
    return () => unsubscribe();
  }, []);

  const addProperty = async () => {
    if (Object.values(newProperty).every(field => field)) {
      setIsSubmitting(true);
      try {
        const propertiesCollection = collection(db, 'properties');
        const docRef = await addDoc(propertiesCollection, newProperty);
        console.log("Document written with ID: ", docRef.id);
        setNewProperty({ title: '', description: '', address: '', isPublished: true });
        alert('物件情報が正常に追加されました。');
      } catch (error: unknown) {
        console.error('物件の追加中にエラーが発生しました:', error);
        alert(`物件��追加中にエラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('すべての必須フィールドを入力してください。');
    }
  };

  const deleteProperty = async (id: string) => {
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(db, 'properties', id));
      alert('物件情報が正常に削除されました。');
    } catch (error) {
      console.error('物件の削除中にエラーが発生しました:', error);
      alert('物件の削除中にエラーが発生しました。もう一度試してください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePublishStatus = async (id: string, currentStatus: boolean) => {
    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, 'properties', id), { isPublished: !currentStatus });
      alert('掲載状態が更新されました。');
    } catch (error) {
      console.error('掲載状態の更新中にエラーが発生しました:', error);
      alert('掲載状態の更新中にエラーが発生しました。もう一度試してください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProperty(prev => ({ ...prev, [name]: value }));
  };

  // 詳細ページへの遷移関数
  const navigateToDetail = (id: string) => {
    router.push(`/properties/${id}`);
  };

  return (
    <div className="admin-container">
      <Header isLoggedIn={true} onLogout={() => {/* ログアウト処理 */}} />
      <AdminLayout>
        <Paper elevation={3} style={{ padding: '2rem', margin: '2rem 0', backgroundColor: '#f5f5f5' }}>
          <Typography variant="h4" gutterBottom style={{ color: '#333', borderBottom: '2px solid #1976d2', paddingBottom: '10px' }}>物件情報管理</Typography>
          {loading ? (
            <Loader />
          ) : (
            <>
              <form onSubmit={(e) => { e.preventDefault(); addProperty(); }}>
                <Grid container spacing={3}>
                  {requiredFields.map(field => (
                    <Grid item xs={12} key={field.id}>
                      <TextField
                        name={field.id}
                        label={field.label}
                        value={newProperty[field.id as keyof NewProperty]}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        required
                        disabled={isSubmitting}
                        multiline={field.type === 'textarea'}
                        rows={field.type === 'textarea' ? 4 : 1}
                        type={field.type}
                        fullWidth
                        variant="outlined"
                        helperText={field.example}
                      />
                    </Grid>
                  ))}
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={<AddIcon />}
                  style={{ marginTop: '2rem', backgroundColor: '#1976d2', color: 'white' }}
                >
                  {isSubmitting ? '追加中...' : '物件を追加'}
                </Button>
              </form>
              <Typography variant="h5" style={{ marginTop: '2rem', color: '#333', borderBottom: '2px solid #1976d2', paddingBottom: '10px' }}>登録済みの物件一覧</Typography>
              <List>
                {properties.map(property => (
                  <ListItem 
                    key={property.id} 
                    style={{ backgroundColor: 'white', marginBottom: '10px', borderRadius: '5px', cursor: 'pointer' }}
                    onClick={() => navigateToDetail(property.id)}
                  >
                    <ListItemText 
                      primary={
                        <Link href={`/properties/${property.id}`} passHref>
                          <Typography component="span" color="primary">{property.title}</Typography>
                        </Link>
                      } 
                      secondary={
                        <>
                          {property.address}
                          <br />
                          <Typography component="span" color={property.isPublished ? "success" : "error"}>
                            {property.isPublished ? "掲載中" : "非掲載"}
                          </Typography>
                          {property.createdAt && (
                            <>
                              <br />
                              作成日時: {formatTimestamp(property.createdAt)}
                            </>
                          )}
                        </>
                      } 
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="toggle-publish"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePublishStatus(property.id, property.isPublished);
                        }}
                        disabled={isSubmitting}
                        style={{ marginRight: '10px' }}
                      >
                        {property.isPublished ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProperty(property.id);
                        }}
                        disabled={isSubmitting}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Paper>
      </AdminLayout>
      <Footer />
    </div>
  );
};

export default Properties;