import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { nanoid } from 'nanoid';
import useHashState from '@/hooks/useHashState';
import { GroceryItem, GroceryList } from '@/lib/types';
import { CATEGORIES, LIST_TYPES } from '@/lib/constants';
import { Category, ListType } from '@shared/schema';

interface GroceryContextType {
  items: GroceryList;
  addItem: (item: Omit<GroceryItem, 'id'>) => void;
  addItems: (items: Omit<GroceryItem, 'id'>[]) => void;
  updateItem: (item: GroceryItem) => void;
  removeItem: (id: string) => void;
  togglePurchased: (id: string) => void;
  moveToList: (id: string, listType: ListType) => void;
  addToCart: (id: string) => void; // New function to add to cart without changing list type
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
  const [activeTab, setActiveTabInternal] = useState<'tobuy' | 'favorites' | 'neverbuy'>('tobuy');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);
  
  // Create a wrapper for setActiveTab that updates the URL hash
  const setActiveTab = (tab: 'tobuy' | 'favorites' | 'neverbuy') => {
    setActiveTabInternal(tab);
    
    try {
      // Update URL hash with the tab parameter
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      params.set('tab', tab);
      window.location.hash = params.toString();
    } catch (error) {
      console.error('Error updating tab in hash:', error);
    }
  };

  // Add a new item to the list
  const addItem = (item: Omit<GroceryItem, 'id'>) => {
    const newItem: GroceryItem = {
      ...item,
      id: nanoid(),
      purchased: item.purchased || false
    };
    setItems([...items, newItem]);
  };
  
  // Add multiple items at once
  const addItems = (newItems: Omit<GroceryItem, 'id'>[]) => {
    if (!newItems.length) return;
    
    const itemsToAdd = newItems.map(item => ({
      ...item,
      id: nanoid(),
      purchased: item.purchased || false
    }));
    
    setItems([...items, ...itemsToAdd]);
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
  
  // Add an item to the cart without changing its list type
  const addToCart = (id: string) => {
    // Find the item by ID
    const itemToAdd = items.find(item => item.id === id);
    if (!itemToAdd) return;
    
    // Create a new item with the same properties but a new ID
    const newItem: GroceryItem = {
      ...itemToAdd,
      id: nanoid(),
      listType: LIST_TYPES.TO_BUY,
      purchased: false
    };
    
    // Add the new item to the list
    setItems([...items, newItem]);
  };

  // Clear all purchased items
  const clearPurchased = () => {
    setItems(items.filter(item => !item.purchased));
  };

  const value = useMemo(() => ({
    items,
    addItem,
    addItems,
    updateItem,
    removeItem,
    togglePurchased,
    moveToList,
    addToCart,
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
