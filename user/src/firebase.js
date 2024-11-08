import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCe3nP6Z_f6KAIJSAfWVcPUrremo0DLbNg",
    authDomain: "backend-ace60.firebaseapp.com",
    projectId: "backend-ace60",
    storageBucket: "backend-ace60.firebasestorage.app",
    messagingSenderId: "111841743198",
    appId: "1:111841743198:web:b0c0d62c7982de8501ffcf"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword, sendEmailVerification };