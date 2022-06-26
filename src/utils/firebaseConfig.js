// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4O252Cp3OvSOu8k3MnCKxdJu-4rFPLJE",
  authDomain: "memories-b0825.firebaseapp.com",
  projectId: "memories-b0825",
  storageBucket: "memories-b0825.appspot.com",
  messagingSenderId: "648905290164",
  appId: "1:648905290164:web:5da431d60c84d26b4542e1",
  measurementId: "G-7T67WGBDST",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;
