import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC5VtwnMVQiV0nAbwVbkZOry8rLYbwMQo8",
    authDomain: "dsaasdas-ee8dd.firebaseapp.com",
    projectId: "dsaasdas-ee8dd",
    storageBucket: "dsaasdas-ee8dd.firebasestorage.app",
    messagingSenderId: "269011875256",
    appId: "1:269011875256:web:aef958ee9487859833cb4d"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export the auth object, signIn function, and sendEmailVerification function
export { auth, signInWithEmailAndPassword, sendEmailVerification };
