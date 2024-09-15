import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0_8b8yAEeqTQdx0g-ha1sk-G6svhItf0",
  authDomain: "groworganic-df854.firebaseapp.com",
  projectId: "groworganic-df854",
  storageBucket: "groworganic-df854.appspot.com",
  messagingSenderId: "307874097958",
  appId: "1:307874097958:web:fd7d3f50c54cee39ccefe7",
  measurementId: "G-ZT4XM4DEYP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
