import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Replace these with your project's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1QWGEew_SZFvKrjczm3K_exwtkhSq5HI",
  authDomain: "hanoitower-d5059.firebaseapp.com",
  projectId: "hanoitower-d5059",
  storageBucket: "hanoitower-d5059.firebasestorage.app",
  messagingSenderId: "290532120528",
  appId: "1:290532120528:web:7914fbefd3abad24654bd5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
