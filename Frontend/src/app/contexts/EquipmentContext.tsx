import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Equipment } from '../data/mockData';

interface EquipmentContextType {
  equipment: Equipment[];
  addEquipment: (equipment: Omit<Equipment, 'id' | 'documents'>) => void;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  getEquipmentById: (id: string) => Equipment | undefined;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export function EquipmentProvider({ children }: { children: ReactNode }) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/equipment/');
      if (!response.ok) {
        throw new Error('Failed to fetch equipment');
      }
      const data = await response.json();

      const mappedData: Equipment[] = data.map((item: any) => ({
        id: String(item.id),
        name: item.name,
        category: item.category || 'Other',
        department: 'General', // Backend missing department, using default
        location: item.location || 'Unknown',
        model: 'Unknown', // Backend missing model, using default
        status: item.status?.toLowerCase() || 'active',
        serialNumber: item.serial_number || 'N/A',
        purchaseDate: item.purchase_date || '',
        warrantyExpiry: item.warranty_end || '',
        lastMaintenance: new Date().toISOString(), // Backend missing lastMaintenance
        documents: [],
        is_scrapped: item.status === 'Scrapped'
      }));

      setEquipment(mappedData);
    } catch (error) {
      console.error("Error fetching equipment:", error);
      // Keep empty or handle error
    }
  };

  const addEquipment = (newEquipment: Omit<Equipment, 'id' | 'documents'>) => {
    // TODO: Connect to backend API
    const id = `eq-${String(equipment.length + 1).padStart(3, '0')}`;
    const equipmentWithId: Equipment = {
      ...newEquipment,
      id,
      documents: [],
    };
    setEquipment([...equipment, equipmentWithId]);
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    // TODO: Connect to backend API
    setEquipment(equipment.map(eq => eq.id === id ? { ...eq, ...updates } : eq));
  };

  const deleteEquipment = (id: string) => {
    // TODO: Connect to backend API
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

