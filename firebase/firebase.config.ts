// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjwTjV8oa3QVmGhEjF3wh23dPitDCpRTk",
  authDomain: "booking-app-c6bac.firebaseapp.com",
  projectId: "booking-app-c6bac",
  storageBucket: "booking-app-c6bac.firebasestorage.app",
  messagingSenderId: "312574648404",
  appId: "1:312574648404:web:d1cf139a1bfda4e63d0dc1",
  measurementId: "G-MDEYZT7T5T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
