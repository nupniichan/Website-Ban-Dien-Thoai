import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhFn2C1Ww5d4BAuHiJykmATIMaQCK6l8o",
  authDomain: "dapm-d1f9a.firebaseapp.com",
  projectId: "dapm-d1f9a",
  storageBucket: "dapm-d1f9a.appspot.com",
  messagingSenderId: "322224119736",
  appId: "1:322224119736:web:43693bb3efd24f3f2af94d",
  measurementId: "G-LSCT6SLWJQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export the auth object, signIn function, and sendEmailVerification function
export { auth, signInWithEmailAndPassword, sendEmailVerification };
