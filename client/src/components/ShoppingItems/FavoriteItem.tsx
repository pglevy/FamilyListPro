import React from 'react';
import { GroceryItem } from '@/lib/types';
import { useGrocery } from '@/context/GroceryContext';
import { CATEGORY_ICONS } from '@/lib/constants';
import { LIST_TYPES } from '@shared/schema';

interface FavoriteItemProps {
  item: GroceryItem;
}

const FavoriteItem: React.FC<FavoriteItemProps> = ({ item }) => {
  const { addToCart, setEditingItem, setIsModalOpen, setActiveTab, items } = useGrocery();

  // Check if item is already in To Buy list
  const isInToBuy = items.some(i => 
    i.listType === 'tobuy' && 
    i.name.toLowerCase() === item.name.toLowerCase() &&
    !i.purchased
  );

  const handleAddToToBuy = () => {
    if (!isInToBuy) {
      addToCart(item.id);
      // Ensure we stay on favorites tab
      setActiveTab('favorites');
    }
  };

  const handleEdit = () => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const categoryIcon = CATEGORY_ICONS[item.category];
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <span className={`inline-flex items-center justify-center w-8 h-8 mr-2 bg-${categoryIcon.color}-100 rounded-full`}>
            <i className={`fas fa-${categoryIcon.icon} text-${categoryIcon.color}-600`}></i>
          </span>
          <h3 className="font-medium">{item.name}</h3>
        </div>
        <div className="flex">
          <button className="p-2 text-yellow-500" aria-label="Favorite">
            <i className="fas fa-star"></i>
          </button>
          <button 
            className="p-2 text-gray-400 hover:text-[#34495E]" 
            aria-label="Edit item"
            onClick={handleEdit}
          >
            <i className="fas fa-edit"></i>
          </button>
        </div>
      </div>
      {item.note && <p className="text-sm text-gray-500 mb-3">{item.note}</p>}
      <button 
        className={`w-full py-2 rounded-lg font-medium transition flex items-center justify-center ${
          isInToBuy 
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
            : 'bg-[#2ECC71] bg-opacity-10 text-[#2ECC71] hover:bg-opacity-20'
        }`}
        onClick={handleAddToToBuy}
        disabled={isInToBuy}
      >
        <i className={`fas ${isInToBuy ? 'fa-check' : 'fa-cart-plus'} mr-2`}></i>
        {isInToBuy ? 'Added to Cart' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default FavoriteItem;
