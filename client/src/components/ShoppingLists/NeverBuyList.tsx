import React, { useMemo } from 'react';
import { useGrocery } from '@/context/GroceryContext';
import NeverBuyItem from '@/components/ShoppingItems/NeverBuyItem';

const NeverBuyList: React.FC = () => {
  const { items, searchTerm, categoryFilter } = useGrocery();

  // Filter never buy items
  const neverBuyItems = useMemo(() => {
    return items.filter(item => 
      item.listType === 'neverbuy' && 
      (searchTerm === '' || item.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === 'all' || item.category === categoryFilter)
    );
  }, [items, searchTerm, categoryFilter]);

  return (
    <div id="neverbuy-content" className="tab-content">
      <div className="mb-6">
        <div className="space-y-3">
          {neverBuyItems.map(item => (
            <NeverBuyItem key={item.id} item={item} />
          ))}
        </div>

        {/* Empty state */}
        {neverBuyItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8">
            <i className="fas fa-ban text-gray-300 text-4xl mb-4"></i>
            <p className="text-gray-500 text-lg">Your 'Never Buy' list is empty</p>
            <p className="text-gray-400 text-sm mt-2">
              Add items here that you want to avoid purchasing
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NeverBuyList;
