"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '../layout';
import { db } from '../../../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import '../admin.css';
import { Button, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Paper, Typography } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Business as BusinessIcon } from '@mui/icons-material';

interface Owner {
  id: string;
  name: string;
  email: string;
}

const Owners = () => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [newOwner, setNewOwner] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const ownersCollection = collection(db, 'owners');
      const ownersSnapshot = await getDocs(ownersCollection);
      const ownersList = ownersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Owner));
      setOwners(ownersList);
    } catch (error) {
      console.error("オーナーの取得中にエラーが発生しました:", error);
    } finally {
      setLoading(false);
    }
  };

  const addOwner = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newOwner.name && newOwner.email) {
      setIsSubmitting(true);
      try {
        const ownersCollection = collection(db, 'owners');
        await addDoc(ownersCollection, newOwner);
        setNewOwner({ name: '', email: '' });
        await fetchOwners();
      } catch (error) {
        console.error("オーナーの追加中にエラーが発生しました:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const deleteOwner = async (id: string) => {
    if (window.confirm('本当にこのオーナーを削除しますか？')) {
      setIsSubmitting(true);
      try {
        const ownerDoc = doc(db, 'owners', id);
        await deleteDoc(ownerDoc);
        await fetchOwners();
      } catch (error) {
        console.error("オーナーの削除中にエラーが発生しました:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewOwner({ ...newOwner, [id]: value });
  };

  const handleLogout = () => {
    // ログアウト処理をここに実装
    setIsLoggedIn(false);
  };

  return (
    <div className="admin-container">
      <AdminLayout>
        <Typography variant="h4" component="h1" gutterBottom>
          <BusinessIcon sx={{ mr: 1 }} />
          オーナー管理
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            新規オーナー登録
          </Typography>
          <form onSubmit={addOwner} className="space-y-4">
            <TextField
              fullWidth
              id="name"
              label="名前"
              variant="outlined"
              value={newOwner.name}
              onChange={handleInputChange}
              placeholder="オーナーの名前を入力"
              required
              disabled={isSubmitting}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="email"
              label="メールアドレス"
              variant="outlined"
              type="email"
              value={newOwner.email}
              onChange={handleInputChange}
              placeholder="オーナーのメールアドレスを入力"
              required
              disabled={isSubmitting}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<AddIcon />}
              disabled={isSubmitting}
            >
              {isSubmitting ? '追加中...' : 'オーナーを追加'}
            </Button>
          </form>
        </Paper>
        
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            オーナー一覧
          </Typography>
          {loading ? (
            <Loader />
          ) : owners.length > 0 ? (
            <List>
              {owners.map(owner => (
                <ListItem key={owner.id} divider>
                  <ListItemText
                    primary={owner.name}
                    secondary={owner.email}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deleteOwner(owner.id)}
                      disabled={isSubmitting}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>オーナーが登録れていせん。</Typography>
          )}
        </Paper>
      </AdminLayout>
      <Footer />
    </div>
  );
};

export default Owners;