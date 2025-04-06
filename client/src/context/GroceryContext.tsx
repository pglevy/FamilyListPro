import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { nanoid } from 'nanoid';
import useHashState from '@/hooks/useHashState';
import { GroceryItem, GroceryList } from '@/lib/types';
import { CATEGORIES, LIST_TYPES } from '@/lib/constants';
import { Category, ListType } from '@shared/schema';

interface GroceryContextType {
  items: GroceryList;
  addItem: (item: Omit<GroceryItem, 'id'>) => void;
  updateItem: (item: GroceryItem) => void;
  removeItem: (id: string) => void;
  togglePurchased: (id: string) => void;
  moveToList: (id: string, listType: ListType) => void;
  clearPurchased: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  activeTab: 'tobuy' | 'favorites' | 'neverbuy';
  setActiveTab: (tab: 'tobuy' | 'favorites' | 'neverbuy') => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  editingItem: GroceryItem | null;
  setEditingItem: (item: GroceryItem | null) => void;
}

const GroceryContext = createContext<GroceryContextType | undefined>(undefined);

interface GroceryProviderProps {
  children: ReactNode;
}

export const GroceryProvider: React.FC<GroceryProviderProps> = ({ children }) => {
  const [items, setItems] = useHashState<GroceryList>([], 'groceryItems');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'tobuy' | 'favorites' | 'neverbuy'>('tobuy');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);

  // Add a new item to the list
  const addItem = (item: Omit<GroceryItem, 'id'>) => {
    const newItem: GroceryItem = {
      ...item,
      id: nanoid(),
      purchased: item.purchased || false
    };
    setItems([...items, newItem]);
  };

  // Update an existing item
  const updateItem = (updatedItem: GroceryItem) => {
    setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  // Remove an item
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Toggle the purchased status of an item
  const togglePurchased = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, purchased: !item.purchased } : item
    ));
  };

  // Move an item to a different list
  const moveToList = (id: string, listType: ListType) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, listType, purchased: false } : item
    ));
  };

  // Clear all purchased items
  const clearPurchased = () => {
    setItems(items.filter(item => !item.purchased));
  };

  const value = useMemo(() => ({
    items,
    addItem,
    updateItem,
    removeItem,
    togglePurchased,
    moveToList,
    clearPurchased,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    activeTab,
    setActiveTab,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    setEditingItem
  }), [
    items, 
    searchTerm, 
    categoryFilter, 
    activeTab, 
    isModalOpen, 
    editingItem,
    setItems
  ]);

  return (
    <GroceryContext.Provider value={value}>
      {children}
    </GroceryContext.Provider>
  );
};

export const useGrocery = (): GroceryContextType => {
  const context = useContext(GroceryContext);
  if (context === undefined) {
    throw new Error('useGrocery must be used within a GroceryProvider');
  }
  return context;
};
