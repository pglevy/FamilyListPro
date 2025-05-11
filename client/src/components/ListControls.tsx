import React from 'react';
import { useGrocery } from '@/context/GroceryContext';
import { CATEGORIES } from '@/lib/constants';
import ImportMarkdown from './ImportMarkdown';

const ListControls: React.FC = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    categoryFilter, 
    setCategoryFilter, 
    setIsModalOpen,
    activeTab
  } = useGrocery();

  const showImportButton = activeTab === 'favorites';

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search items..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <i className="fas fa-search"></i>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <select 
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent bg-white"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value={CATEGORIES.PRODUCE}>Produce</option>
          <option value={CATEGORIES.DAIRY}>Dairy</option>
          <option value={CATEGORIES.MEAT}>Meat</option>
          <option value={CATEGORIES.BAKERY}>Bakery</option>
          <option value={CATEGORIES.FROZEN}>Frozen</option>
          <option value={CATEGORIES.PANTRY}>Pantry</option>
          <option value={CATEGORIES.HOUSEHOLD}>Household</option>
        </select>
        
        
        
        <button 
          className="px-3 py-2 bg-[#2ECC71] text-white rounded-lg font-medium hover:bg-opacity-90 transition"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="fas fa-plus xs:mr-1"></i>
          <span className="hidden xs:inline">Add</span>
          <span className="sr-only">Add Item</span>
        </button>
        {showImportButton && <ImportMarkdown />}
        
      </div>
    </div>
  );
};

export default ListControls;
