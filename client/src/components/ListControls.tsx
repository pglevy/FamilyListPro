import React from 'react';
import { useGrocery } from '@/context/GroceryContext';
import { CATEGORIES } from '@/lib/constants';
import ImportMarkdown from './ImportMarkdown';
import Button from './Button'; // Assuming you have a Button component

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
    <div className="flex gap-4 mb-6">
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
      >
        <option value="all">All Categories</option>
        {Object.values(CATEGORIES).map((category) => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>

      <Button onClick={() => setIsModalOpen(true)} className="bg-[#2ECC71] hover:bg-[#27AE60]">
        <i className="fas fa-plus mr-2"></i> Add Item
      </Button>
    </div>
  );
};

export default ListControls;