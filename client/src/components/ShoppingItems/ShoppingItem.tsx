import React from 'react';
import { GroceryItem } from '@/lib/types';
import { useGrocery } from '@/context/GroceryContext';

interface ShoppingItemProps {
  item: GroceryItem;
}

const ShoppingItem: React.FC<ShoppingItemProps> = ({ item }) => {
  const { togglePurchased, setEditingItem, setIsModalOpen, removeItem } = useGrocery();

  const handleTogglePurchased = () => {
    togglePurchased(item.id);
  };

  const handleEdit = () => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="h-6 w-6 mr-3">
          <input 
            type="checkbox" 
            className="h-6 w-6 rounded-md border-gray-300 text-[#2ECC71] focus:ring-[#2ECC71]" 
            checked={item.purchased}
            onChange={handleTogglePurchased}
          />
        </div>
        <div>
          <p className={`font-medium ${item.purchased ? 'line-through text-gray-400' : ''}`}>
            {item.name}
          </p>
          {item.note && (
            <p className={`text-sm ${item.purchased ? 'text-gray-400 line-through' : 'text-gray-500'}`}>
              {item.note}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          className="p-2 text-gray-400 hover:text-[#34495E]" 
          aria-label="Edit item"
          onClick={handleEdit}
        >
          <i className="fas fa-edit"></i>
        </button>
        <button 
          className="p-2 text-gray-400 hover:text-[#E74C3C]" 
          aria-label="Remove item"
          onClick={handleRemove}
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default ShoppingItem;
