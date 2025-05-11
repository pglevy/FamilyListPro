import React from "react";
import { useToast } from "@/hooks/use-toast";

const Header: React.FC = () => {
  const { toast } = useToast();

  const handleShare = () => {
    // Copy the current URL to clipboard
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "Share this URL to share your grocery list.",
        });
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error copying link",
          description: "Please copy the URL manually from your browser.",
        });
      });
  };

  const handleSettings = () => {
    toast({
      title: "Settings",
      description:
        "Settings functionality will be implemented in a future update.",
    });
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#34495E]">
          <i className="fas fa-bag-shopping xs:mr-2"></i> Gro-Shreeze
        </h1>
        <div className="flex space-x-2">
          <button
            className="p-2 min-w-10 max-h-10 rounded-full hover:bg-gray-100"
            aria-label="Share list"
            onClick={handleShare}
          >
            <i className="fas fa-share-alt text-[#34495E]"></i>
          </button>
          <button
            className="p-2 min-w-10 max-h-10 rounded-full hover:bg-gray-100"
            aria-label="Settings"
            onClick={handleSettings}
          >
            <i className="fas fa-cog text-[#34495E]"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
