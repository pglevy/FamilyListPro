import React, { useState, useMemo } from 'react';
import { useGrocery } from '@/context/GroceryContext';
import ShoppingItem from '@/components/ShoppingItems/ShoppingItem';
import { CATEGORY_ICONS } from '@/lib/constants';
import { Category } from '@shared/schema';

const ToBuyList: React.FC = () => {
  const { items, searchTerm, categoryFilter, clearPurchased } = useGrocery();
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);
  const [isPurchasedCollapsed, setIsPurchasedCollapsed] = useState(true);

  // Filter to buy items
  const toBuyItems = useMemo(() => {
    return items.filter(item => 
      item.listType === 'tobuy' && 
      (searchTerm === '' || item.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === 'all' || item.category === categoryFilter)
    );
  }, [items, searchTerm, categoryFilter]);

  // Group items by category
  const itemsByCategory = useMemo(() => {
    const groupedItems: Record<string, typeof toBuyItems> = {};
    const categories = Array.from(new Set(toBuyItems.map(item => item.category)));
    
    categories.forEach(category => {
      const categoryItems = toBuyItems.filter(item => item.category === category && !item.purchased);
      if (categoryItems.length > 0) {
        groupedItems[category] = categoryItems;
      }
    });
    
    return groupedItems;
  }, [toBuyItems]);

  // Get purchased items
  const purchasedItems = useMemo(() => {
    return toBuyItems.filter(item => item.purchased);
  }, [toBuyItems]);

  const toggleCategory = (category: string) => {
    if (collapsedCategories.includes(category)) {
      setCollapsedCategories(collapsedCategories.filter(c => c !== category));
    } else {
      setCollapsedCategories([...collapsedCategories, category]);
    }
  };

  const togglePurchasedItems = () => {
    setIsPurchasedCollapsed(!isPurchasedCollapsed);
  };

  return (
    <div id="tobuy-content" className="tab-content">
      {/* Render categories */}
      {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
        <div className="mb-6" key={category}>
          <div className="flex items-center justify-between mb-3 px-2">
            <h2 className="text-lg font-semibold text-[#34495E] flex items-center">
              <span className={`inline-flex items-center justify-center w-8 h-8 mr-2 bg-${CATEGORY_ICONS[category as Category].color}-100 rounded-full`}>
                <i className={`fas fa-${CATEGORY_ICONS[category as Category].icon} text-${CATEGORY_ICONS[category as Category].color}-600`}></i>
              </span>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h2>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => toggleCategory(category)}
            >
              <i className={`fas fa-chevron-${collapsedCategories.includes(category) ? 'down' : 'up'}`}></i>
            </button>
          </div>

          {!collapsedCategories.includes(category) && (
            <div className="space-y-3">
              {categoryItems.map(item => (
                <ShoppingItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Purchased Items Section */}
      {purchasedItems.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-2">
            <h2 className="text-lg font-semibold text-gray-400 flex items-center">
              <span className="inline-flex items-center justify-center w-8 h-8 mr-2 bg-gray-100 rounded-full">
                <i className="fas fa-check text-gray-500"></i>
              </span>
              Purchased ({purchasedItems.length})
            </h2>
            <div className="flex gap-2">
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={togglePurchasedItems}
              >
                <i className={`fas fa-chevron-${isPurchasedCollapsed ? 'down' : 'up'}`}></i>
              </button>
              <button 
                className="text-sm text-gray-500 hover:text-[#E74C3C]"
                onClick={clearPurchased}
              >
                Clear purchased
              </button>
            </div>
          </div>

          {!isPurchasedCollapsed && (
            <div className="space-y-3">
              {purchasedItems.map(item => (
                <ShoppingItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {toBuyItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8">
          <i className="fas fa-shopping-cart text-gray-300 text-4xl mb-4"></i>
          <p className="text-gray-500 text-lg">Your shopping list is empty</p>
          <p className="text-gray-400 text-sm mt-2">
            Add items using the "Add Item" button above
          </p>
        </div>
      )}
    </div>
  );
};

export default ToBuyList;
