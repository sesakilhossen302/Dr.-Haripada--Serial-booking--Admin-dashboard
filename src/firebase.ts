import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyB6VCkO_Y--kzZo8vPX4lejmWy46nXOpwU",
  authDomain: "dr-haripada.firebaseapp.com",
  projectId: "dr-haripada",
  storageBucket: "dr-haripada.firebasestorage.app",
  messagingSenderId: "471597065830",
  appId: "1:471597065830:web:e90902e5f6556c577befa7",
  measurementId: "G-5ZX838XJCN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
