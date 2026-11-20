import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

// Configuración de Firebase para la aplicación web
const firebaseConfig = {
  apiKey: "AIzaSyB2gEnM47aj0-SiIDOypRL5xhtPg3Ialco",
  authDomain: "abuoso-catalogo.firebaseapp.com",
  projectId: "abuoso-catalogo",
  storageBucket: "abuoso-catalogo.firebasestorage.app",
  messagingSenderId: "897172577778",
  appId: "1:897172577778:web:6d63c7a6dc5013ac445f6b",
  measurementId: "G-ZWBLM52694"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

function createFirestoreDb(): Firestore {
  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch {
    return getFirestore(app);
  }
}

// Exportar servicios utilizados en la aplicación
export const db = createFirestoreDb();
export const auth = getAuth(app);
