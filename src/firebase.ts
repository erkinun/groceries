// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  measurementId: 'G-HQX6XLDST0',
  appId: import.meta.env.VITE_PUBLIC_FIREBASE_APP_ID,
  apiKey: import.meta.env.VITE_PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
const googleAuthProvider = new GoogleAuthProvider();

export const authFn = async () => {
  try {
    setPersistence(auth, browserLocalPersistence);
    const res = await signInWithPopup(auth, googleAuthProvider);
    // TODO create the user in the database
    console.log(res.user);
  } catch (error) {
    console.error(error);
  }
};

export const logout = () => {
  signOut(auth);
};
onAuthStateChanged(auth, (user) => {
  // This callback fires with the user's login state.
  // If they aren't logged in, it's null
  // It's also in realtime! So it will fire when a login/logout occurs
});
export const database = getDatabase(app);
