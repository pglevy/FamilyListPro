import React, { useState, useEffect } from 'react';
import { useGrocery } from '@/context/GroceryContext';
import { CATEGORIES, LIST_TYPES } from '@/lib/constants';
import { Category, ListType } from '@shared/schema';

const AddItemModal: React.FC = () => {
  const { 
    isModalOpen, 
    setIsModalOpen, 
    addItem, 
    updateItem,
    editingItem, 
    setEditingItem 
  } = useGrocery();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>(CATEGORIES.PRODUCE);
  const [note, setNote] = useState('');
  const [listType, setListType] = useState<ListType>(LIST_TYPES.TO_BUY);

  // Reset form when modal is opened or editingItem changes
  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setCategory(editingItem.category);
      setNote(editingItem.note || '');
      setListType(editingItem.listType);
    } else {
      setName('');
      setCategory(CATEGORIES.PRODUCE);
      setNote('');
      setListType(LIST_TYPES.TO_BUY);
    }
  }, [editingItem, isModalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      updateItem({
        ...editingItem,
        name,
        category,
        note: note || undefined,
        listType
      });
    } else {
      addItem({
        name,
        category,
        note: note || undefined,
        listType,
        purchased: false
      });
    }
    
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-[#34495E]">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button 
            className="text-gray-400 hover:text-gray-600" 
            onClick={closeModal}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="item-name" className="block text-sm font-medium text-gray-700 mb-1">
              Item Name
            </label>
            <input 
              type="text" 
              id="item-name" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
              placeholder="Enter item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="item-category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select 
              id="item-category" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              required
            >
              <option value={CATEGORIES.PRODUCE}>Produce</option>
              <option value={CATEGORIES.DAIRY}>Dairy</option>
              <option value={CATEGORIES.MEAT}>Meat</option>
              <option value={CATEGORIES.BAKERY}>Bakery</option>
              <option value={CATEGORIES.FROZEN}>Frozen</option>
              <option value={CATEGORIES.PANTRY}>Pantry</option>
              <option value={CATEGORIES.HOUSEHOLD}>Household</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="item-note" className="block text-sm font-medium text-gray-700 mb-1">
              Note (Optional)
            </label>
            <input 
              type="text" 
              id="item-note" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
              placeholder="Add details like quantity, brand, etc."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="item-list" className="block text-sm font-medium text-gray-700 mb-1">
              Add to List
            </label>
            <select 
              id="item-list" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent bg-white"
              value={listType}
              onChange={(e) => setListType(e.target.value as ListType)}
              required
            >
              <option value={LIST_TYPES.TO_BUY}>To Buy</option>
              <option value={LIST_TYPES.FAVORITES}>Favorites</option>
              <option value={LIST_TYPES.NEVER_BUY}>Never Buy</option>
            </select>
          </div>
          
          <div className="flex space-x-3">
            <button 
              type="button" 
              className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-2 bg-[#2ECC71] text-white rounded-lg font-medium hover:bg-opacity-90 transition"
            >
              {editingItem ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
