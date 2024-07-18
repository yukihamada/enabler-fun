require('dotenv').config({ path: '../.env.local' });
const admin = require('firebase-admin');

// .env.localからサービスアカウントキーを取得
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!serviceAccountKey) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not defined');
}
const serviceAccount = JSON.parse(serviceAccountKey);

// SNの設定を追加
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
if (!storageBucket) {
  throw new Error('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is not defined');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: storageBucket // SNの設定を追加
});

const db = admin.firestore();

async function analyzeDatabase() {
  const collections = await db.listCollections();
  
  for (const collection of collections) {
    const collectionName = collection.id;
    console.log(`\nコレクション: ${collectionName}`);

    const snapshot = await collection.limit(1).get();
    if (snapshot.empty) {
      console.log('  データがありません');
      continue;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    console.log('  スキーマ:');
    Object.keys(data).forEach(key => {
      const value = data[key];
      const type = Array.isArray(value) ? 'array' : typeof value;
      console.log(`    ${key}: ${type}`);
    });

    const countSnapshot = await collection.count().get();
    const docCount = countSnapshot.data().count;
    console.log(`  ドキュメント数: ${docCount}`);

    if (docCount > 0) {
      const largestDoc = await collection.orderBy(admin.firestore.FieldPath.documentId()).limit(1).get();
      console.log('  サンプルデータ (最初のドキュメント):');
      console.log(JSON.stringify(largestDoc.docs[0].data(), null, 2));
    }
  }
}

analyzeDatabase().catch(console.error);