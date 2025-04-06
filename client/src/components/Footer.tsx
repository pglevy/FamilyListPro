import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-3 px-4">
      <div className="flex justify-between items-center text-xs text-gray-500">
        <div>Family Grocery List</div>
        <div>Data stored in URL for easy sharing</div>
      </div>
    </footer>
  );
};

export default Footer;
