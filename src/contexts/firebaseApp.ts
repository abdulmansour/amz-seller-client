// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBM6jRBuJINh89LzQDBhjfIOGtne6DHyvA',
  authDomain: 'molgha.firebaseapp.com',
  projectId: 'molgha',
  storageBucket: 'molgha.appspot.com',
  messagingSenderId: '625607779749',
  appId: '1:625607779749:web:52c51f82c9237c4efcf44c',
  measurementId: 'G-K6CXNB1QXZ',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const initFirebase = () => {
  return app;
};
