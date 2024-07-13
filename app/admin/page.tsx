"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '../layout';
import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';
import './admin.css';
import { Button, TextField, Typography, Paper, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { collection, getDocs, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from './../../lib/firebase';
import { Timestamp } from 'firebase/firestore';

interface AdminUser {
  id: string;
  email: string;
  createdAt?: Timestamp;
}

const AdminUsers = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const formatTimestamp = (timestamp: Timestamp | undefined) => {
    if (timestamp && timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleString('ja-JP');
    }
    return '日時不明';
  };

  useEffect(() => {
    setLoading(true);
    const adminUsersCollection = collection(db, 'adminUsers');
    
    const unsubscribe = onSnapshot(adminUsersCollection, (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        email: doc.data().email,
        createdAt: doc.data().createdAt
      } as AdminUser));
      setAdminUsers(usersList);
      setLoading(false);
    }, (error) => {
      console.error('データの取得中にエラーが発生しました:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addAdminUser = async () => {
    if (newAdminEmail) {
      setIsSubmitting(true);
      try {
        const adminUsersCollection = collection(db, 'adminUsers');
        await addDoc(adminUsersCollection, { 
          email: newAdminEmail,
          createdAt: Timestamp.now()
        });
        setNewAdminEmail('');
        alert('管理者が正常に追加されました。');
      } catch (error: unknown) {
        console.error('管理者の追加中にエラーが発生しました:', error);
        alert(`管理者の追加中にエラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('メールアドレスを入力してください。');
    }
  };

  const deleteAdminUser = async (id: string) => {
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(db, 'adminUsers', id));
      alert('管理者が正常に削除されました。');
    } catch (error) {
      console.error('管理者の削除中にエラーが発生しました:', error);
      alert('管理者の削除中にエラーが発生しました。もう一度試してください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    // ログアウト処理をここに実装
    console.log('ログアウト処理');
    setIsLoggedIn(false);
  };

  return (
    <div className="admin-container">
      <AdminLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
        <Paper elevation={3} style={{ padding: '2rem', margin: '2rem 0', backgroundColor: '#f5f5f5' }}>
          <Typography variant="h4" gutterBottom style={{ color: '#333', borderBottom: '2px solid #1976d2', paddingBottom: '10px' }}>管理者ID管理</Typography>
          {loading ? (
            <Loader />
          ) : (
            <>
              <form onSubmit={(e) => { e.preventDefault(); addAdminUser(); }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      name="email"
                      label="管理者のメールアドレスを入力してください"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="example@example.com"
                      required
                      disabled={isSubmitting}
                      type="email"
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={<AddIcon />}
                  style={{ marginTop: '2rem', backgroundColor: '#1976d2', color: 'white' }}
                >
                  {isSubmitting ? '追加中...' : '管理者を追加'}
                </Button>
              </form>
              <Typography variant="h5" style={{ marginTop: '2rem', color: '#333', borderBottom: '2px solid #1976d2', paddingBottom: '10px' }}>登録済みの管理者一覧</Typography>
              <List>
                {adminUsers.map(user => (
                  <ListItem 
                    key={user.id} 
                    style={{ backgroundColor: 'white', marginBottom: '10px', borderRadius: '5px' }}
                  >
                    <ListItemText 
                      primary={user.email}
                      secondary={`作成日時: ${formatTimestamp(user.createdAt)}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => deleteAdminUser(user.id)}
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

export default AdminUsers;