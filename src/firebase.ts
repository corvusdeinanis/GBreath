import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhl2KfBuBnPLU9gmU553DlvtMqxCYMTZo",
  authDomain: "gbreath-19ec0.firebaseapp.com",
  projectId: "gbreath-19ec0",
  storageBucket: "gbreath-19ec0.appspot.com",
  messagingSenderId: "396239748234",
  appId: "1:396239748234:web:2edb02b9fa5697486b4173",
  measurementId: "G-NXN7RBPFPV",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const analytics = getAnalytics

export {
  app,
  auth,
  db,
  analytics
}
