// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBM89a33kTIIJcJ08q_uJnQwwRljt477Jg",
  authDomain: "felling-92.firebaseapp.com",
  projectId: "felling-92",
  storageBucket: "felling-92.firebasestorage.app",
  messagingSenderId: "467109727971",
  appId: "1:467109727971:web:ccf5b39371644f8c3b3fd6",
  measurementId: "G-TE0LP4KHQZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// ✅ Exporte TUDO que você quer usar em outros arquivos
export { db, auth, storage };