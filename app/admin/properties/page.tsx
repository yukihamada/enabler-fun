"use client";

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../layout';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import '../admin.css';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Paper, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, SelectChangeEvent, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface Property {
  id: string;
  [key: string]: any;
}

interface Owner {
  id: string;
  name: string;
}

interface NewProperty {
  [key: string]: string | number | string[];
}

const formFields = [
  { 
    id: 'owner', 
    label: 'オーナーを選択してください。', 
    type: 'select', 
    options: [], 
    required: true,
    example: '例: 山田太郎'
  },
  { 
    id: 'title', 
    label: '物件タイトルを入力してくだい。', 
    type: 'text', 
    placeholder: '物件タトル', 
    required: true,
    example: '例: 渋谷駅徒歩5！モダンな1LDKアパートメント'
  },
  { 
    id: 'description', 
    label: '物件の説明を入力してください。', 
    type: 'textarea', 
    placeholder: '物件の説明', 
    required: true,
    example: '例: 渋谷の中心部にある明るく清潔な1LDKアパートメント。最新の家電を完備し、長期滞在にも最適です。'
  },
  { 
    id: 'location', 
    label: '物件の所在地を入力してください。', 
    type: 'text', 
    placeholder: '所在地', 
    required: true,
    example: '例: 東京都渋谷区神南1-2-3'
  },
  { 
    id: 'property_type', 
    label: '物件の種類を選択してください。', 
    type: 'select', 
    options: ['アパート', '一軒家', 'マンシン', '戸建て', 'テラスハウス'], 
    required: true,
    example: '例: アパート'
  },
  { 
    id: 'room_type', 
    label: '部屋タイプを選択してください。', 
    type: 'select', 
    options: ['ワンルーム', '1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3K', '3DK', '3LDK', '4K以上'], 
    required: true,
    example: '例: 1LDK'
  },
  { 
    id: 'size', 
    label: '物件の広さを入力してくださ（㎡）', 
    type: 'number', 
    placeholder: '広さ', 
    required: true,
    example: '例: 50（半角数字入力してください）'
  },
  { 
    id: 'max_occupancy', 
    label: '最大入居人数を入力してください。', 
    type: 'number', 
    placeholder: '最大入居人数', 
    required: true,
    example: '例: 4（半角数字で入力してください）'
  },
  { 
    id: 'bedrooms', 
    label: '寝室数を入力してください。', 
    type: 'number', 
    placeholder: '寝室数', 
    required: true,
    example: '例: 2（半角数字で入力してください）'
  },
  { 
    id: 'bathrooms', 
    label: 'バスルーム数を入力してください。', 
    type: 'number', 
    placeholder: 'バスルーム数', 
    required: true,
    example: '例: 1.5（小数点可）'
  },
  { 
    id: 'rent', 
    label: '月額賃料を入力してください（円）', 
    type: 'number', 
    placeholder: '賃料', 
    required: true,
    example: '例: 100000（半角数字で入力してください）'
  },
  { 
    id: 'deposit', 
    label: '敷金を入力してください（円）', 
    type: 'number', 
    placeholder: '敷金', 
    required: true,
    example: '例: 100000（半角数字で入力してください）'
  },
  { 
    id: 'key_money', 
    label: '礼金を入力して下さい（円）', 
    type: 'number', 
    placeholder: '礼金', 
    required: true,
    example: '例: 100000（半角数字で入力してください）'
  },
  { 
    id: 'available_from', 
    label: '入居可能日を入力してください。', 
    type: 'date', 
    placeholder: '入居可能日', 
    required: true,
    example: '例: 2023-07-01'
  },
  { 
    id: 'amenities', 
    label: '設備を選択してください（複数選択可）', 
    type: 'multiselect', 
    options: ['エアコン', 'バス・トイレ別', '洗濯機置き場', 'インターネット無料', 'ペット可', '駐車場', '宅配ボックス', 'オートロック', 'エレベーター'], 
    required: true,
    example: '例: エアコン, バス・トイレ別, 洗濯機置き場'
  },
  { 
    id: 'nearest_station', 
    label: '最寄駅を入力してください。', 
    type: 'text', 
    placeholder: '最寄駅', 
    required: true,
    example: '例: JR山手線 渋谷駅 徒歩5分'
  },
  { 
    id: 'rules', 
    label: '物件のルールを入力してください。', 
    type: 'textarea', 
    placeholder: '物件ルール', 
    required: true,
    example: '例: 禁煙、ペット不可、楽器演奏禁止、深夜の騒音禁止'
  },
  { 
    id: 'cancellation_policy', 
    label: '約条件を選択してください。', 
    type: 'select', 
    options: ['1ヶ月前', '2ヶ月前', '3ヶ月前'], 
    required: true,
    example: '例: 1ヶ月前'
  }
];

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [newProperty, setNewProperty] = useState<NewProperty>({});
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const propertiesCollection = collection(db, 'properties');
      const ownersCollection = collection(db, 'owners');

      const [propertiesSnapshot, ownersSnapshot] = await Promise.all([
        getDocs(propertiesCollection),
        getDocs(ownersCollection)
      ]);

      const propertiesList = propertiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Property));
      const ownersList = ownersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Owner));

      setProperties(propertiesList);
      setOwners(ownersList);
      console.log('Fetched owners:', ownersList); // デバッグ用
    } catch (error) {
      console.error('データの取得中にエラーが発生しました:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addProperty = async () => {
    if (Object.values(newProperty).every(field => field)) {
      setIsSubmitting(true);
      try {
        const propertiesCollection = collection(db, 'properties');
        await addDoc(propertiesCollection, newProperty);
        setNewProperty({});
        const propertiesSnapshot = await getDocs(propertiesCollection);
        const propertiesList = propertiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProperties(propertiesList);
        alert('物件情報が正常に追加されました。');
      } catch (error) {
        console.error('物件の追加中にエラーが発生しました:', error);
        alert('物の追加中にエラーが発生しました。もう一度試してください。');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('すべてのフィールドを入力してください。');
    }
  };

  const deleteProperty = async (id: string) => {
    setIsSubmitting(true);
    await deleteDoc(doc(db, 'properties', id));
    const propertiesCollection = collection(db, 'properties');
    const propertiesSnapshot = await getDocs(propertiesCollection);
    const propertiesList = propertiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProperties(propertiesList);
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | string[]>) => {
    const { name, value } = e.target;
    setNewProperty(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="admin-container">
      <Header />
      <AdminLayout>
        <Paper elevation={3} style={{ padding: '2rem', margin: '2rem 0', backgroundColor: '#f5f5f5' }}>
          <Typography variant="h4" gutterBottom style={{ color: '#333', borderBottom: '2px solid #1976d2', paddingBottom: '10px' }}>物件情報管理</Typography>
          {loading ? (
            <Loader />
          ) : (
            <>
              <form onSubmit={(e) => { e.preventDefault(); addProperty(); }}>
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
                              value={(newProperty[field.id] || '').toString()}
                              onChange={handleInputChange}
                              required={field.required}
                              disabled={isSubmitting}
                              label={field.label}
                            >
                              <MenuItem value="">選択してください</MenuItem>
                              {field.id === 'owner' ? (
                                owners.map(owner => (
                                  <MenuItem key={owner.id} value={owner.id}>{owner.name}</MenuItem>
                                ))
                              ) : (
                                field.options?.map(option => (
                                  <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))
                              )}
                            </Select>
                          </>
                        ) : field.type === 'multiselect' ? (
                          <>
                            <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
                            <Select
                              labelId={`${field.id}-label`}
                              name={field.id}
                              multiple
                              value={newProperty[field.id] as string[] || []}
                              onChange={handleInputChange}
                              required={field.required}
                              disabled={isSubmitting}
                              label={field.label}
                              renderValue={(selected) => (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {(selected as string[]).map((value) => (
                                    <Chip key={value} label={value} />
                                  ))}
                                </div>
                              )}
                            >
                              {field.options?.map(option => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                              ))}
                            </Select>
                          </>
                        ) : (
                          <TextField
                            name={field.id}
                            label={field.label}
                            value={newProperty[field.id] || ''}
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
                  {isSubmitting ? '追加中...' : '物件を追加'}
                </Button>
              </form>
              <Typography variant="h5" style={{ marginTop: '2rem', color: '#333', borderBottom: '2px solid #1976d2', paddingBottom: '10px' }}>登録済みの物件一覧</Typography>
              <List>
                {properties.map(property => (
                  <ListItem key={property.id} style={{ backgroundColor: 'white', marginBottom: '10px', borderRadius: '5px' }}>
                    <ListItemText 
                      primary={property.title} 
                      secondary={`${property.property_type} - ${property.room_type} - ${property.size}㎡ - 賃料：¥${property.rent}/月`} 
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => deleteProperty(property.id)}
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