import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


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

const appRegister = initializeApp(firebaseConfig, "registerApp")

// export { app }
export const storage = getStorage(app, 'gs://fpafb-77192.appspot.com');
export const auth = getAuth(app)
export const authRegister = getAuth(appRegister)
export default app
