import React from 'react';
import { useGrocery } from '@/context/GroceryContext';

const TabNavigation: React.FC = () => {
  const { activeTab, setActiveTab } = useGrocery();

  const handleTabClick = (tab: 'tobuy' | 'favorites' | 'neverbuy') => {
    setActiveTab(tab);
    window.location.hash = tab;
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
            <i className="fas fa-shopping-cart mr-2"></i>To Buy
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
            <i className="fas fa-star mr-2"></i>Favorites
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
            <i className="fas fa-ban mr-2"></i>Never Buy
          </a>
        </li>
      </ul>
    </div>
  );
};

export default TabNavigation;
