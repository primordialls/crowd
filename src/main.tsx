import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initializeApp } from "firebase/app";
import './index.css'
import App from './App.tsx'

const firebaseConfig = {
  apiKey: "AIzaSyA9vrL8ghxZ1w_FscnrilGhPR4FVlFodpc",
  authDomain: "crowdsourcing-ca728.firebaseapp.com",
  projectId: "crowdsourcing-ca728",
  storageBucket: "crowdsourcing-ca728.firebasestorage.app",
  messagingSenderId: "886436848185",
  appId: "1:886436848185:web:40cd22af6cd7fcd88a63e8",
  measurementId: "G-M2JN1V7G44"
};

export const app = initializeApp(firebaseConfig);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
