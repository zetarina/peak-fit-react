// Import the necessary Firebase functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import the getAuth function for authentication
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBqBPBNchgULPrP-a3voRM5IFR3qDDGeXM",
  authDomain: "workout-app-test-b7af4.firebaseapp.com",
  databaseURL:
    "https://workout-app-test-b7af4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "workout-app-test-b7af4",
  storageBucket: "workout-app-test-b7af4.firebasestorage.app",
  messagingSenderId: "891549320424",
  appId: "1:891549320424:web:7c0b4c8de5124f8030355d",
  measurementId: "G-2F88X5YXD9",
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app); 
const analytics = getAnalytics(app);


export { auth, analytics };
