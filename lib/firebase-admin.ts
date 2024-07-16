
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  try {
    console.log('Initializing Firebase Admin');
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
    );
    console.log('Project ID:', serviceAccount.project_id);

    initializeApp({
      credential: cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key?.replace(/\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
}

export const adminDb = getFirestore();
console.log('Firestore instance created');

// Test Firestore connection
async function testFirestoreConnection() {
  try {
    const testDoc = await adminDb.collection('test').doc('testDoc').get();
    if (testDoc.exists) {
      console.log('Firestore connection successful');
    } else {
      console.log('Firestore connection successful, but test document not found');
    }
  } catch (error) {
    console.error('Firestore connection test failed:', error);
  }
}

testFirestoreConnection();
