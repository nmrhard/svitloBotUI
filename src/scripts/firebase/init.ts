import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'svitlobotui.firebaseapp.com',
  projectId: 'svitlobotui',
  storageBucket: 'svitlobotui.firebasestorage.app',
  messagingSenderId: '641387019702',
  appId: '1:641387019702:web:a07994ce9adf381c3a9517',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9098');
}
