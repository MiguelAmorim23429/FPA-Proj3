// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
// import * as firebase from 'firebase'

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyC_2m2lV5dfva1q0wQiyURDBhTMMnAguLo",

  authDomain: "fpafb-77192.firebaseapp.com",

  databaseURL: "https://fpafb-77192-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "fpafb-77192",

  storageBucket: "fpafb-77192.appspot.com",

  messagingSenderId: "417344422467",

  appId: "1:417344422467:web:e11f88ab98bdf2722ccaf6"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
export { app }
// firebase.initializeApp(firebaseConfig)