"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '../layout';
import { db } from '../../../lib/firebase'
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import '../admin.css';
import { Button, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Paper, Typography } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Business as BusinessIcon } from '@mui/icons-material';

interface Employer {
  id: string;
  name: string;
  email: string;
}

const Employers = () => {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [newEmployer, setNewEmployer] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEmployers();
  }, []);

  const fetchEmployers = async () => {
    try {
      const employersCollection = collection(db, 'employers');
      const employersSnapshot = await getDocs(employersCollection);
      const employersList = employersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmployers(employersList as Employer[]);
    } catch (error) {
      console.error("雇用主の取得中にエラーが発生しました:", error);
      alert("雇用主の取得に失敗しました。ページを再読み込みしてください。");
    } finally {
      setLoading(false);
    }
  };

  const addEmployer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newEmployer.name && newEmployer.email) {
      setIsSubmitting(true);
      try {
        const employersCollection = collection(db, 'employers');
        await addDoc(employersCollection, newEmployer);
        setNewEmployer({ name: '', email: '' });
        await fetchEmployers();
        alert('雇用主が正常に追加されました。');
      } catch (error) {
        console.error("雇用主の追加中にエラーが発生しました:", error);
        alert("雇用主の追加に失敗しました。もう一度お試しください。");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('名前とメールアドレスは必須です');
    }
  };

  const deleteEmployer = async (id: string) => {
    if (window.confirm('本当にこの雇用主を削除しますか？')) {
      setIsSubmitting(true);
      try {
        await deleteDoc(doc(db, 'employers', id));
        await fetchEmployers();
        alert('雇用主が正常に削除されました。');
      } catch (error) {
        console.error("雇用主の削除中にエラーが発生しました:", error);
        alert("雇用主の削除に失敗しました。もう一度お試しください。");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewEmployer({ ...newEmployer, [id]: value });
  };

  return (
    <div className="admin-container">
      <Header />
      <AdminLayout>
        <Typography variant="h4" component="h1" gutterBottom>
          <BusinessIcon sx={{ mr: 1 }} />
          雇用主管理
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            新規雇用主登録
          </Typography>
          <form onSubmit={addEmployer} className="space-y-4">
            <TextField
              fullWidth
              id="name"
              label="名前"
              variant="outlined"
              value={newEmployer.name}
              onChange={handleInputChange}
              placeholder="雇用主の名前を入力"
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
              value={newEmployer.email}
              onChange={handleInputChange}
              placeholder="雇用主のメールアドレスを入力"
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
              {isSubmitting ? '追加中...' : '雇用主を追加'}
            </Button>
          </form>
        </Paper>
        
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            雇用主一覧
          </Typography>
          {loading ? (
            <Loader />
          ) : employers.length > 0 ? (
            <List>
              {employers.map(employer => (
                <ListItem key={employer.id} divider>
                  <ListItemText
                    primary={employer.name}
                    secondary={employer.email}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deleteEmployer(employer.id)}
                      disabled={isSubmitting}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>雇用主が登録されていません。</Typography>
          )}
        </Paper>
      </AdminLayout>
      <Footer />
    </div>
  );
};

export default Employers;