import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ↓ Firebase コンソールの設定値で置換
const firebaseConfig = {
  apiKey: "AIzaSyDDeMU_zzidfmu49CNBD1jcdSAc_c1rxT0",
  authDomain: "booking-app-78c56.firebaseapp.com",
  projectId: "booking-app-78c56",
  storageBucket: "booking-app-78c56.firebasestorage.app",
  messagingSenderId: "283218371161",
  appId: "1:283218371161:web:82a02fd44106ffae4cc748",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// 開発 or ローカル配信(Hostingエミュ or Vite dev)でコンソールから使えるようにする
try {
    const isLocalHost =
      typeof window !== 'undefined' &&
      ['localhost', '127.0.0.1'].includes(window.location.hostname);
  
    if (isLocalHost || (import.meta?.env && import.meta.env.DEV)) {
      window.auth = auth;
      console.log('[firebase.js] window.auth is set');
    } else {
      console.log('[firebase.js] window.auth not exposed on this origin:', window?.location?.hostname);
    }
  } catch (e) {
    console.warn('[firebase.js] expose window.auth failed:', e);
  }
  