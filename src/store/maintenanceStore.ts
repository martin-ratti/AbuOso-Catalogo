import { create } from 'zustand';
import { doc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface MaintenanceStore {
  isMaintenanceMode: boolean;
  loading: boolean;
}

export const useMaintenanceStore = create<MaintenanceStore>(() => ({
  isMaintenanceMode: false,
  loading: false,
}));

const maintenanceDocRef = doc(db, 'settings', 'maintenance');

// Escuchar en tiempo real el estado de mantenimiento desde Firestore sin bloquear la carga inicial
onSnapshot(
  maintenanceDocRef,
  (snapshot) => {
    if (snapshot.exists()) {
      useMaintenanceStore.setState({
        isMaintenanceMode: snapshot.data().enabled === true,
        loading: false,
      });
    } else {
      useMaintenanceStore.setState({
        isMaintenanceMode: false,
        loading: false,
      });
    }
  },
  async (error) => {
    console.warn('Error en tiempo real al consultar mantenimiento, usando respaldo:', error);
    try {
      const fallbackSnap = await getDoc(maintenanceDocRef);
      useMaintenanceStore.setState({
        isMaintenanceMode: fallbackSnap.exists() && fallbackSnap.data().enabled === true,
        loading: false,
      });
    } catch {
      useMaintenanceStore.setState({
        isMaintenanceMode: false,
        loading: false,
      });
    }
  }
);

export async function toggleMaintenanceMode(enabled: boolean) {
  await setDoc(maintenanceDocRef, { enabled }, { merge: true });
}
