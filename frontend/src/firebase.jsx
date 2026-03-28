import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA5R1QaQbp7RXgnOdD43iLyLyHqxrIMM_4",
  authDomain: "virtual-ai-assistant-124b7.firebaseapp.com",
  projectId: "virtual-ai-assistant-124b7",
  storageBucket: "virtual-ai-assistant-124b7.firebasestorage.app",
  messagingSenderId: "935143842446",
  appId: "1:935143842446:web:348f827333b54214f51fdf",
  measurementId: "G-XGVG67WMPH"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();