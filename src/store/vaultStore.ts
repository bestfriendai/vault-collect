import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CollectionItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  photoUri?: string;
  quantity: number;
  condition?: 'mint' | 'excellent' | 'good' | 'fair' | 'poor';
  purchasePrice?: number;
  currentValue?: number;
  purchaseDate?: string;
  location?: string;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

interface VaultState {
  collections: Collection[];
  items: CollectionItem[];
  selectedCollectionId: string | null;
  isPremium: boolean;
  
  // Actions
  addCollection: (collection: Omit<Collection, 'id' | 'itemCount' | 'createdAt' | 'updatedAt'>) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  selectCollection: (id: string | null) => void;
  
  addItem: (item: Omit<CollectionItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, updates: Partial<CollectionItem>) => void;
  deleteItem: (id: string) => void;
  
  setPremium: (isPremium: boolean) => void;
  getItemsByCollection: (collectionId: string) => CollectionItem[];
  getTotalValue: () => number;
}

const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

export const useVaultStore = create<VaultState>()(
  persist(
    (set, get) => ({
      collections: [
        {
          id: 'default',
          name: 'My Collection',
          description: 'My main collection',
          icon: '📦',
          color: '#059669',
          itemCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      items: [],
      selectedCollectionId: 'default',
      isPremium: false,

      addCollection: (collection) => {
        const now = new Date().toISOString();
        const newCollection: Collection = {
          ...collection,
          id: generateId(),
          itemCount: 0,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ 
          collections: [...state.collections, newCollection],
          selectedCollectionId: newCollection.id,
        }));
      },

      updateCollection: (id, updates) => {
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },

      deleteCollection: (id) => {
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
          items: state.items.filter((i) => i.category !== id),
          selectedCollectionId: state.selectedCollectionId === id ? 'default' : state.selectedCollectionId,
        }));
      },

      selectCollection: (id) => {
        set({ selectedCollectionId: id });
      },

      addItem: (item) => {
        const now = new Date().toISOString();
        const newItem: CollectionItem = {
          ...item,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => {
          const updatedCollections = state.collections.map((c) => {
            if (c.id === item.category) {
              return { ...c, itemCount: c.itemCount + 1, updatedAt: now };
            }
            return c;
          });
          
          return {
            items: [...state.items, newItem],
            collections: updatedCollections,
          };
        });
      },

      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
          ),
        }));
      },

      deleteItem: (id) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;
        
        set((state) => {
          const updatedCollections = state.collections.map((c) => {
            if (c.id === item.category) {
              return { ...c, itemCount: Math.max(0, c.itemCount - 1), updatedAt: new Date().toISOString() };
            }
            return c;
          });
          
          return {
            items: state.items.filter((i) => i.id !== id),
            collections: updatedCollections,
          };
        });
      },

      setPremium: (isPremium) => {
        set({ isPremium });
      },

      getItemsByCollection: (collectionId) => {
        return get().items.filter((item) => item.category === collectionId);
      },

      getTotalValue: () => {
        return get().items.reduce((sum, item) => sum + (item.currentValue || 0) * item.quantity, 0);
      },
    }),
    {
      name: 'vault-collect-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
