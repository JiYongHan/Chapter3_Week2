// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAG8DqgG4nhfQfEYyRyGymJEHqGxgMAJbs",
  authDomain: "test-react-basic.firebaseapp.com",
  projectId: "test-react-basic",
  storageBucket: "test-react-basic.appspot.com",
  messagingSenderId: "971046088166",
  appId: "1:971046088166:web:db2a1d3a4c0cbc3ba0fa27",
  measurementId: "G-M7BR5C01E0",
};
initializeApp(firebaseConfig);
// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
// const db = getFirestore(app);
export const db = getFirestore();

