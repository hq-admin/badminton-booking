import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB68OqymerNxiCyXwVFFtqI2AGkA1hXypU",
  authDomain: "badminton-booking-app-2405e.firebaseapp.com",
  projectId: "badminton-booking-app-2405e",
  storageBucket: "badminton-booking-app-2405e.appspot.com",
  messagingSenderId: "381661788906",
  appId: "1:381661788906:web:34ccd8ec74bf5c832db593"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const storage = getStorage(app);

const db = getFirestore();
export { db }