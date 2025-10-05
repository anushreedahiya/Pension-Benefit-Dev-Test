// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqhUOk6ib-feOuotkhxYgipQ9xrfYz4I0",
  authDomain: "pension-a50c5.firebaseapp.com",
  projectId: "pension-a50c5",
  storageBucket: "pension-a50c5.firebasestorage.app",
  messagingSenderId: "577841756027",
  appId: "1:577841756027:web:53726f169b8e9540342fde",
  measurementId: "G-B2T7EL4B75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.log('Analytics not available:', error);
  }
}

export { analytics };
export default app; 