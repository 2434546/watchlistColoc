import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBcrGe6RifZzoMGM3biClqUZ9hAy8sikRg",
    authDomain: "watchlist-60868.firebaseapp.com",
    projectId: "watchlist-60868",
    storageBucket: "watchlist-60868.firebasestorage.app",
    messagingSenderId: "1059161661395",
    appId: "1:1059161661395:web:1a41535057fa8c3f401926",
    measurementId: "G-0MD12DL6N5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
