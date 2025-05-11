import React, { useMemo } from 'react';
import { useGrocery } from '@/context/GroceryContext';
import FavoriteItem from '@/components/ShoppingItems/FavoriteItem';

const FavoritesList: React.FC = () => {
  const { items, searchTerm, categoryFilter } = useGrocery();

  // Filter favorite items
  const favoriteItems = useMemo(() => {
    return items.filter(item => 
      item.listType === 'favorites' && 
      (searchTerm === '' || item.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === 'all' || item.category === categoryFilter)
    );
  }, [items, searchTerm, categoryFilter]);

  return (
    <div id="favorites-content" className="tab-content">
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteItems.map(item => (
            <FavoriteItem key={item.id} item={item} />
          ))}
        </div>

        {/* Empty state */}
        {favoriteItems.length === 0 && (
          <>
            <div className="flex flex-col items-center justify-center py-8">
              <i className="fas fa-star text-gray-300 text-4xl mb-4"></i>
              <p className="text-gray-500 text-lg">You don't have any favorites yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Add items to your favorites for quick access
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <ImportMarkdown />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FavoritesList;
