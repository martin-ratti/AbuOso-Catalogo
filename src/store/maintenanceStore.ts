import { create } from 'zustand';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface MaintenanceStore {
  isMaintenanceMode: boolean;
  loading: boolean;
}

export const useMaintenanceStore = create<MaintenanceStore>(() => ({
  isMaintenanceMode: false,
  loading: true,
}));

// Escuchar en tiempo real el estado de mantenimiento desde Firestore
onSnapshot(doc(db, 'settings', 'maintenance'), (snapshot) => {
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
});

export async function toggleMaintenanceMode(enabled: boolean) {
  await setDoc(doc(db, 'settings', 'maintenance'), { enabled }, { merge: true });
}
