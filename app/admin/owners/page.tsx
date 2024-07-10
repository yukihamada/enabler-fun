"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '../layout';
import { supabase } from '../../../lib/supabaseClient';
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

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      const { data, error } = await supabase
        .from('owners')
        .select('*');
      if (error) throw error;
      setOwners(data as Owner[]);
    } catch (error) {
      console.error("オーナーの取得中にエラーが発生しました:", error);
      alert("オーナーの取得に失敗しました。ページを再読み込みしてください。");
    } finally {
      setLoading(false);
    }
  };

  const addOwner = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newOwner.name && newOwner.email) {
      setIsSubmitting(true);
      try {
        const { error } = await supabase
          .from('owners')
          .insert([newOwner]);
        if (error) throw error;
        setNewOwner({ name: '', email: '' });
        await fetchOwners();
        alert('オーナーが正常に追加されました。');
      } catch (error) {
        console.error("オーナーの追加中にエラーが発生しました:", error);
        alert("オーナーの追加に失敗しました。もう一度お試しください。");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('名前とメールアドレスは必須です');
    }
  };

  const deleteOwner = async (id: string) => {
    if (window.confirm('本当にこのオーナーを削除しますか？')) {
      setIsSubmitting(true);
      try {
        const { error } = await supabase
          .from('owners')
          .delete()
          .eq('id', id);
        if (error) throw error;
        await fetchOwners();
        alert('オーナーが正常に削除されました。');
      } catch (error) {
        console.error("オーナーの削除中にエラーが発生しました:", error);
        alert("オーナーの削除に失敗しました。もう一度お試しください。");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewOwner({ ...newOwner, [id]: value });
  };

  return (
    <div className="admin-container">
      <Header />
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
            <Typography>オーナーが登録されていません。</Typography>
          )}
        </Paper>
      </AdminLayout>
      <Footer />
    </div>
  );
};

export default Owners;