import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2gEnM47aj0-SiIDOypRL5xhtPg3Ialco",
  authDomain: "abuoso-catalogo.firebaseapp.com",
  projectId: "abuoso-catalogo",
  storageBucket: "abuoso-catalogo.firebasestorage.app",
  messagingSenderId: "897172577778",
  appId: "1:897172577778:web:6d63c7a6dc5013ac445f6b",
  measurementId: "G-ZWBLM52694"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Exportar los servicios que vamos a utilizar para las figuras de yeso
export const db = getFirestore(app);
export const storage = getStorage(app);
