/**
 * Import the Firebase client modules
 */
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

/**
 * The following represent the firebase client configuration for the application.
 * These are safe to be exposed on the client.
 * ⚠️ TODO: change these to match your project configuration.
 */
const firebaseConfig = {
  apiKey: '',
  authDomain: 'svitlobotui.firebaseapp.com',
  projectId: 'svitlobotui',
  storageBucket: 'svitlobotui.firebasestorage.app',
  messagingSenderId: '641387019702',
  appId: '1:641387019702:web:a07994ce9adf381c3a9517',
};

// Initialize Firebase apps
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

/**
 * For local testing add authentication emulator
 */
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9098');
}
