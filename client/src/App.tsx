import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import ListControls from "@/components/ListControls";
import TabNavigation from "@/components/TabNavigation";
import ToBuyList from "@/components/ShoppingLists/ToBuyList";
import FavoritesList from "@/components/ShoppingLists/FavoritesList";
import NeverBuyList from "@/components/ShoppingLists/NeverBuyList";
import AddItemModal from "@/components/AddItemModal";
import Footer from "@/components/Footer";
import { GroceryProvider, useGrocery } from "./context/GroceryContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Main application content that uses the grocery context
function AppContent() {
  const { activeTab, setActiveTab } = useGrocery();

  useEffect(() => {
    // Initialize the app based on URL hash
    const initFromHash = () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const tabParam = params.get('tab') || 'tobuy';
      
      if (tabParam === 'tobuy' || tabParam === 'favorites' || tabParam === 'neverbuy') {
        setActiveTab(tabParam as 'tobuy' | 'favorites' | 'neverbuy');
      } else {
        // If tab param isn't one of our known tabs, use the default
        setActiveTab('tobuy');
      }
    };

    // Run initialization
    initFromHash();

    // Listen for hash changes
    window.addEventListener('hashchange', initFromHash);
    return () => window.removeEventListener('hashchange', initFromHash);
  }, [setActiveTab]);

  return (
    <div className="flex flex-col h-screen bg-[#F7F9FC] text-[#2C3E50] font-sans">
      <Header />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-4">
          <ListControls />
          <TabNavigation />
          
          {activeTab === 'tobuy' && <ToBuyList />}
          {activeTab === 'favorites' && <FavoritesList />}
          {activeTab === 'neverbuy' && <NeverBuyList />}
        </div>
      </main>
      
      <Footer />
      <AddItemModal />
      <Toaster />
    </div>
  );
}

// Main App component that provides all necessary contexts
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GroceryProvider>
        <AppContent />
      </GroceryProvider>
    </QueryClientProvider>
  );
}

export default App;
