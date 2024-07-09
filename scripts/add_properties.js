const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const properties = [
  { name: 'ハワイ', location: 'ハワイ' },
  { name: '熱海', location: '静岡県熱海市' },
  { name: '京都', location: '京都府京都市' },
  { name: '六本木', location: '東京都港区六本木' },
  { name: '北海道（弟子屈）', location: '北海道川上郡弟子屈町' },
  { name: '北海道（ニセコ）', location: '北海道虻田郡ニセコ町' },
  { name: '名古屋', location: '愛知県名古屋市' },
  { name: '小原', location: '愛知県豊田市小原町' },
  { name: '愛知', location: '愛知県' },
  { name: '野尻湖', location: '長野県上水内郡信濃町野尻' },
];

async function addProperties() {
  for (const property of properties) {
    await addDoc(collection(db, 'properties'), property);
    console.log(`Added property: ${property.name}`);
  }
}

addProperties().catch(console.error);

