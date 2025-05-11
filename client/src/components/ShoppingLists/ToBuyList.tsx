import React, { useState, useMemo } from 'react';
import { useGrocery } from '@/context/GroceryContext';
import ShoppingItem from '@/components/ShoppingItems/ShoppingItem';
import { CATEGORY_ICONS } from '@/lib/constants';
import { Category } from '@shared/schema';

const ToBuyList: React.FC = () => {
  const { items, searchTerm, categoryFilter, clearPurchased } = useGrocery();
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);

  // Filter to buy items
  const toBuyItems = useMemo(() => {
    return items.filter(item => 
      item.listType === 'tobuy' && 
      (searchTerm === '' || item.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === 'all' || item.category === categoryFilter)
    );
  }, [items, searchTerm, categoryFilter]);

  // Group items by category (including purchased items)
  const itemsByCategory = useMemo(() => {
    const groupedItems: Record<string, typeof toBuyItems> = {};
    const categories = Array.from(new Set(toBuyItems.map(item => item.category)));
    
    categories.forEach(category => {
      // Include purchased items in the category groups
      const categoryItems = toBuyItems.filter(item => item.category === category);
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

  return (
    <div id="tobuy-content" className="tab-content">
      {/* Render categories */}
      {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
        <div className="mb-6" key={category}>
          <div className="flex items-center justify-between mb-3 px-2">
            <h2 className="text-lg font-semibold text-[#34495E] flex items-center">
              <span className={`inline-flex items-center justify-center w-8 h-8 mr-2 ${
                category === 'produce' ? 'bg-green-100' :
                category === 'dairy' ? 'bg-blue-100' :
                category === 'meat' ? 'bg-red-100' :
                category === 'bakery' ? 'bg-yellow-100' :
                category === 'frozen' ? 'bg-blue-100' :
                category === 'pantry' ? 'bg-yellow-100' :
                'bg-purple-100'
              } rounded-full`}>
                <i className={`fas fa-${CATEGORY_ICONS[category as Category].icon} ${
                  category === 'produce' ? 'text-green-600' :
                  category === 'dairy' ? 'text-blue-600' :
                  category === 'meat' ? 'text-red-600' :
                  category === 'bakery' ? 'text-yellow-600' :
                  category === 'frozen' ? 'text-blue-600' :
                  category === 'pantry' ? 'text-yellow-600' :
                  'text-purple-600'
                }`}></i>
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

      {/* Purchased Items Summary */}
      {purchasedItems.length > 0 && (
        <div className="mb-6 mt-8">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-600 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 mr-2 bg-gray-100 rounded-full">
                  <i className="fas fa-check text-gray-500"></i>
                </span>
                Purchased Items ({purchasedItems.length})
              </h2>
              <button 
                className="text-sm px-3 py-1 bg-red-50 text-[#E74C3C] rounded-md hover:bg-red-100 transition"
                onClick={clearPurchased}
              >
                <i className="fas fa-trash-alt mr-1"></i> Clear All Purchased
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Purchased items are kept in their respective categories with a strikethrough. You can uncheck any purchased item to restore it.
            </p>
          </div>
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
