import React from 'react';
import { useGrocery } from '@/context/GroceryContext';

const TabNavigation: React.FC = () => {
  const { activeTab, setActiveTab } = useGrocery();

  const handleTabClick = (tab: 'tobuy' | 'favorites' | 'neverbuy') => {
    // Use our setActiveTab function which updates the URL hash correctly
    setActiveTab(tab);
  };

  return (
    <div className="mb-6 border-b border-gray-200">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
        <li className="mr-2">
          <a 
            href="#tobuy" 
            className={`inline-block p-4 border-b-2 ${
              activeTab === 'tobuy' 
                ? 'border-[#2ECC71] text-[#2ECC71]' 
                : 'border-transparent hover:border-gray-300'
            } rounded-t-lg`}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick('tobuy');
            }}
          >
            <i className="fas fa-shopping-cart sm:mr-2"></i>
            <span className="hidden sm:inline">To Buy</span>
            <span className="sr-only">To Buy List</span>
          </a>
        </li>
        <li className="mr-2">
          <a 
            href="#favorites" 
            className={`inline-block p-4 border-b-2 ${
              activeTab === 'favorites' 
                ? 'border-[#2ECC71] text-[#2ECC71]' 
                : 'border-transparent hover:border-gray-300'
            } rounded-t-lg`}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick('favorites');
            }}
          >
            <i className="fas fa-star sm:mr-2"></i>
            <span className="hidden sm:inline">Favorites</span>
            <span className="sr-only">Favorites List</span>
          </a>
        </li>
        <li>
          <a 
            href="#neverbuy" 
            className={`inline-block p-4 border-b-2 ${
              activeTab === 'neverbuy' 
                ? 'border-[#2ECC71] text-[#2ECC71]' 
                : 'border-transparent hover:border-gray-300'
            } rounded-t-lg`}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick('neverbuy');
            }}
          >
            <i className="fas fa-ban sm:mr-2"></i>
            <span className="hidden sm:inline">Never Buy</span>
            <span className="sr-only">Never Buy List</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default TabNavigation;
