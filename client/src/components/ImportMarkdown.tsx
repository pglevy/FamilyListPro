import React, { useState } from 'react';
import { useGrocery } from '@/context/GroceryContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { LIST_TYPES, CATEGORIES, Category } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

const ImportMarkdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { addItems, setActiveTab } = useGrocery();
  const { toast } = useToast();

  const handleImport = () => {
    setIsProcessing(true);
    
    try {
      // Parse markdown content into grocery items
      const items = parseMarkdownToItems(markdownContent);
      
      // Create new items to add
      const itemsToAdd = items.map(item => ({
        name: item.name,
        category: item.category,
        listType: LIST_TYPES.FAVORITES,
        note: item.note,
        purchased: false
      }));
      
      // Add all items to the favorites list at once
      addItems(itemsToAdd);
      
      // Set active tab to 'favorites'
      setActiveTab('favorites');

      toast({
        title: "Import Successful",
        description: `Added ${items.length} items to your favorites.`,
      });
      
      setIsOpen(false);
      setMarkdownContent('');
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to parse markdown content",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Parse markdown content into grocery items
  const parseMarkdownToItems = (markdown: string) => {
    const lines = markdown.split('\n').filter(line => line.trim() !== '');
    const items: Array<{ name: string, category: Category, note?: string }> = [];
    
    let currentCategory: Category = 'pantry'; // Default to 'pantry' category
    
    for (const line of lines) {
      // Check if line is a heading (category)
      if (line.startsWith('#')) {
        const categoryName = line.replace(/^#+\s*/, '').trim().toLowerCase();
        
        // Check if the category name is one of the valid categories
        if (Object.values(CATEGORIES).includes(categoryName as Category)) {
          currentCategory = categoryName as Category;
        }
        continue;
      }
      
      // Check if line is a list item
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemText = line.replace(/^[-*]\s*/, '').trim();
        
        // Check if the item has a note (separated by colon or dash)
        let itemName = itemText;
        let itemNote = undefined;
        
        const noteDelimiters = [':', ' - ', ' – '];
        for (const delimiter of noteDelimiters) {
          if (itemText.includes(delimiter)) {
            const [name, note] = itemText.split(delimiter, 2);
            itemName = name.trim();
            itemNote = note.trim();
            break;
          }
        }
        
        if (itemName) {
          items.push({
            name: itemName,
            category: currentCategory,
            note: itemNote
          });
        }
      }
    }
    
    if (items.length === 0) {
      throw new Error("No valid items found in the markdown content. Make sure to use proper formatting.");
    }
    
    return items;
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setMarkdownContent(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        variant="outline"
        className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
      >
        <i className="fas fa-file-import mr-2"></i> Import
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Import from Markdown</DialogTitle>
            <DialogDescription>
              Paste markdown content or upload a markdown file to import items into your favorites list.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Input 
                id="fileInput" 
                type="file" 
                accept=".md, .markdown, .txt" 
                onChange={handleFileUpload}
                className="flex-1"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="markdownInput" className="text-sm font-medium text-gray-700">
                Markdown Content
              </label>
              <Textarea
                id="markdownInput"
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                placeholder="# Produce
- Apples
- Bananas: organic only
- Spinach - for salads

# Dairy
- Milk
- Cheese"
                className="min-h-[200px]"
              />
            </div>
            
            <div className="text-sm text-gray-500">
              <p className="font-medium">Format guidelines:</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>Use <code className="bg-gray-100 px-1 rounded"># Category</code> for category headers</li>
                <li>Use <code className="bg-gray-100 px-1 rounded">- Item</code> or <code className="bg-gray-100 px-1 rounded">* Item</code> for list items</li>
                <li>For notes, use <code className="bg-gray-100 px-1 rounded">- Item: Note</code> or <code className="bg-gray-100 px-1 rounded">- Item - Note</code></li>
                <li>Valid categories: {Object.values(CATEGORIES).join(', ')}</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={markdownContent.trim() === '' || isProcessing}
            >
              {isProcessing ? "Importing..." : "Import to Favorites"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImportMarkdown;