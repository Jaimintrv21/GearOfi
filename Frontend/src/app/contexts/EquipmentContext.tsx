import { createContext, useContext, useState, ReactNode } from 'react';
import { Equipment, equipment as initialEquipment } from '../data/mockData';

interface EquipmentContextType {
  equipment: Equipment[];
  addEquipment: (equipment: Omit<Equipment, 'id' | 'documents'>) => void;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  getEquipmentById: (id: string) => Equipment | undefined;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export function EquipmentProvider({ children }: { children: ReactNode }) {
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);

  const addEquipment = (newEquipment: Omit<Equipment, 'id' | 'documents'>) => {
    const id = `eq-${String(equipment.length + 1).padStart(3, '0')}`;
    const equipmentWithId: Equipment = {
      ...newEquipment,
      id,
      documents: [],
    };
    setEquipment([...equipment, equipmentWithId]);
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipment(equipment.map(eq => eq.id === id ? { ...eq, ...updates } : eq));
  };

  const deleteEquipment = (id: string) => {
    setEquipment(equipment.filter(eq => eq.id !== id));
  };

  const getEquipmentById = (id: string) => {
    return equipment.find(eq => eq.id === id);
  };

  return (
    <EquipmentContext.Provider value={{
      equipment,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      getEquipmentById,
    }}>
      {children}
    </EquipmentContext.Provider>
  );
}

export function useEquipment() {
  const context = useContext(EquipmentContext);
  if (context === undefined) {
    throw new Error('useEquipment must be used within an EquipmentProvider');
  }
  return context;
}

