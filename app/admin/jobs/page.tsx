"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '../layout';
import { db } from '../../../lib/firebase'
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import '../admin.css';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Paper, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, SelectChangeEvent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface Job {
  id: string;
  [key: string]: any;
}

interface Employer {
  id: string;
  name: string;
  [key: string]: any;
}

interface NewJob {
  [key: string]: string | number;
}

const formFields = [
  { 
    id: 'employer', 
    label: '雇用主を選択してください。', 
    type: 'select', 
    options: [], 
    required: true,
    example: '例: 株式会社〇〇'
  },
  { 
    id: 'shop_name', 
    label: '店舗名を教えてください。', 
    type: 'text', 
    placeholder: '店舗名', 
    required: true,
    example: '例: カフェ、レストラン太陽など'
  },
  { 
    id: 'location', 
    label: '店舗の所在地を教えてください。', 
    type: 'text', 
    placeholder: '所在地', 
    required: true,
    example: '例: 東京都渋谷区神南1-2-3'
  },
  { 
    id: 'industry', 
    label: 'お店の業態を教えてください。', 
    type: 'select', 
    options: ['居酒屋', 'レストラン', 'カフェ', 'バー'], 
    required: true,
    example: '例: レストラン、カフェ、居酒屋など'
  },
  { 
    id: 'customer_unit_price', 
    label: '客単価はどのくらいですか？', 
    type: 'select', 
    options: ['~1000円', '1000~3000円', '3000~5000円', '5000円~'], 
    required: true,
    example: '例: 1000~3000円'
  },
  { 
    id: 'job_title', 
    label: 'どんな職種を募集していますか？', 
    type: 'text', 
    placeholder: '募集職種', 
    required: true,
    example: '例: ホールスタッフ、キッチンスタッフ、バーテンダーなど'
  },
  { 
    id: 'job_description', 
    label: '具体的な仕事内容を教えてください。', 
    type: 'textarea', 
    placeholder: '仕事内容', 
    required: true,
    example: '例: 接客、オーダー取り、料理の提供、レジ業務など。新人スタッフの教��もお願いします。'
  },
  { 
    id: 'seats', 
    label: '席数', 
    type: 'number', 
    placeholder: '席数', 
    required: true,
    example: '例: 30（半角数字で入力してください）'
  },
  { 
    id: 'smoking_info', 
    label: '喫煙情報', 
    type: 'select', 
    options: ['全面禁煙', '分煙', '喫煙可'], 
    required: true,
    example: '例: 全面禁煙'
  },
  { 
    id: 'nearest_station', 
    label: '最寄駅', 
    type: 'text', 
    placeholder: '最寄駅', 
    required: true,
    example: '例: JR山手線 渋谷駅 徒歩5分'
  },
  { 
    id: 'holidays', 
    label: '定休日', 
    type: 'text', 
    placeholder: '定休日', 
    required: true,
    example: '例: 毎週月曜日、年末年始'
  },
  { 
    id: 'company', 
    label: '運営会社', 
    type: 'text', 
    placeholder: '運営会社', 
    required: true,
    example: '例: 株式会社〇〇フーズ'
  }
];

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [newJob, setNewJob] = useState<NewJob>({});
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsCollection = collection(db, 'jobs');
        const employersCollection = collection(db, 'employers');

        const [jobsSnapshot, employersSnapshot] = await Promise.all([
          getDocs(jobsCollection),
          getDocs(employersCollection)
        ]);

        const jobsList = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const employersList = employersSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name, ...doc.data() }));

        setJobs(jobsList);
        setEmployers(employersList);
      } catch (error) {
        console.error('データの取得中にエラーが発生しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addJob = async () => {
    if (Object.values(newJob).every(field => field)) {
      setIsSubmitting(true);
      try {
        const jobsCollection = collection(db, 'jobs');
        await addDoc(jobsCollection, newJob);
        setNewJob({});
        const jobsSnapshot = await getDocs(jobsCollection);
        const jobsList = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setJobs(jobsList);
        alert('仕事情報が正常に追加されました。');
      } catch (error) {
        console.error('仕事の追加中にエラーが発生��ました:', error);
        alert('仕事の追加中にエラーが発生しました。もう一度試してください。');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('すべてのフィールドを入力してください。');
    }
  };

  const deleteJob = async (id: string) => {
    setIsSubmitting(true);
    await deleteDoc(doc(db, 'jobs', id));
    // Fetch jobs again to update the list
    const jobsCollection = collection(db, 'jobs');
    const jobsSnapshot = await getDocs(jobsCollection);
    const jobsList = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setJobs(jobsList);
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setNewJob(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="admin-container">
      <Header />
      <AdminLayout>
        {loading ? <Loader /> : (
          <Paper elevation={3} style={{ padding: '2rem', margin: '2rem 0', backgroundColor: '#f5f5f5' }}>
            <Typography variant="h4" gutterBottom style={{ color: '#333', borderBottom: '2px solid #1976d2', paddingBottom: '10px' }}>仕事情報管理</Typography>
            <form onSubmit={(e) => { e.preventDefault(); addJob(); }}>
              <Grid container spacing={3}>
                {formFields.map(field => (
                  <Grid item xs={12} sm={6} key={field.id}>
                    <FormControl fullWidth>
                      {field.type === 'select' ? (
                        <>
                          <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
                          <Select
                            labelId={`${field.id}-label`}
                            name={field.id}
                            value={(newJob[field.id] || '').toString()}
                            onChange={handleInputChange}
                            required={field.required}
                            disabled={isSubmitting}
                            label={field.label}
                          >
                            <MenuItem value="">選択してください</MenuItem>
                            {field.id === 'employer' ? (
                              employers.map(employer => (
                                <MenuItem key={employer.id} value={employer.id}>{employer.name}</MenuItem>
                              ))
                            ) : (
                              field.options?.map(option => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                              ))
                            )}
                          </Select>
                        </>
                      ) : (
                        <TextField
                          name={field.id}
                          label={field.label}
                          value={newJob[field.id] || ''}
                          onChange={handleInputChange}
                          placeholder={field.placeholder}
                          required={field.required}
                          disabled={isSubmitting}
                          multiline={field.type === 'textarea'}
                          rows={field.type === 'textarea' ? 4 : 1}
                          type={field.type}
                          fullWidth
                          variant="outlined"
                          helperText={field.example}
                        />
                      )}
                    </FormControl>
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
                {isSubmitting ? '追加中...' : '仕事を追加'}
              </Button>
            </form>
            <Typography variant="h5" style={{ marginTop: '2rem', color: '#333', borderBottom: '2px solid #1976d2', paddingBottom: '10px' }}>登録済みの仕事一覧</Typography>
            <List>
              {jobs.map(job => (
                <ListItem key={job.id} style={{ backgroundColor: 'white', marginBottom: '10px', borderRadius: '5px' }}>
                  <ListItemText primary={`${job.shop_name} - ${job.job_title}`} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deleteJob(job.id)}
                      disabled={isSubmitting}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </AdminLayout>
      <Footer />
    </div>
  );
};

export default Jobs;