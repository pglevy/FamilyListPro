import React from 'react';
import { GroceryItem } from '@/lib/types';
import { useGrocery } from '@/context/GroceryContext';

interface NeverBuyItemProps {
  item: GroceryItem;
}

const NeverBuyItem: React.FC<NeverBuyItemProps> = ({ item }) => {
  const { removeItem, setEditingItem, setIsModalOpen } = useGrocery();

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
        <span className="inline-flex items-center justify-center w-8 h-8 mr-3 bg-red-100 rounded-full">
          <i className="fas fa-ban text-[#E74C3C]"></i>
        </span>
        <div>
          <p className="font-medium">{item.name}</p>
          {item.note && <p className="text-sm text-gray-500">{item.note}</p>}
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
          aria-label="Remove from Never Buy"
          onClick={handleRemove}
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default NeverBuyItem;
