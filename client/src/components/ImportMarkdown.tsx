import React, { useState } from "react";
import { useGrocery } from "@/context/GroceryContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LIST_TYPES, CATEGORIES, Category } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const ImportMarkdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const defaultContent = `# Produce

- POM juice (big one)
- Apples (honey crisp)
- Bananas
- Oranges
- Strawberries
- Grapes
- Pineapples
- Blueberries (small pack)
- Kiwi
- Baby spinach
- Shallots

# Meat

- Lunch meats (all natural turkey and one other meat)
- Cheese slices (pick two: baby Swiss, gouda, muenster, cheddar, havarti)
- Feta cheese
- Parmesan cheese
- Salmon packets
- Tuna packets (lemon pepper, plain)
- Salmon
- Chicken (change it up)
- Good meat (but check price)
- Boujee ground beef (2 1lb, 90/10)
- Plant-based protein (natural chicken sausages)
- Smoked salmon
- Turkey bacon

# Pantry

- Gluten-free tortilla wrap (spinach)
- Regular tortilla wrap (flour)
- Black beans
- Olive or avocado oil
- Peanut butter smooth crazy Richard's (only peanuts as ingredient)
- Almond butter
- Cocoa powder
- Rice (brown, white, microwaveable)
- Gluten-free pasta
- Soup and/or broth
- Pasta sauce
- Chicken sauce
- Rolled oats
- White bread
- Cheez-its, goldfish, cheese straws, potato chips (2 kinds), popcorn, tortilla chips, ritz crackers, rice cakes, crackers, almonds (lightly salted, not honey roasted), peanuts (lightly salted), gluten-free crackers
- Whole plain almonds 
- Low sugar fruit snacks
- Cereal, 2 boxes (Crispix, Cinnamon Chex, Pops, Honey Comb, Corn Flakes, change it up)
- KIND soft baked granola (dark chocolate, dark chocolate peanut butter)
- Maple syrup
- KIND breakfast bars (dark chocolate, almond)
- Gluten-free cookies
- Almond butter
- Peanut M&Ms
- Dark chocolate
- Coffee (Basecamp & Dark As Dark, across from milk)

# Household

- TP
- PT
- FT
- Napkins
- Dryer sheets
- Laundry detergent 

# Dairy

- Dairy
- Eggs
- Butter, unsalted 
- Cream cheese (regular, chive & onion)
- Yogurt, oikos vanilla zero sugar, 4 pack
- Diet soda (big coke ZERO)
- Club soda (blue schweppes, or food lion or some other seltzer if they're out)
- Juice (Tropical Punch)
- 2% milk
- Oat milk (barista, all the way to the right)
- Lemonade
- Diet arizona green tea or half and half
- Almond milk

# Frozen

- Ezekiel bread
- Bagels (frozen gluten-free & lender's in fridge near eggs)
- Frozen vegetables (green beans, corn, carrots, mix)
- Frozen strawberries
- Frozen breakfast sausages
- Frozen buttermilk pancakes
- Frozen waffles (good ones, not eggo; chocolate, not blueberry)
- Frozen potatoes 
- Breyers ice cream (not cookie dough) or greek yogurt ice cream (Yaaso crunchy chocolate)`;

  const [markdownContent, setMarkdownContent] = useState(defaultContent);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addItems, setActiveTab } = useGrocery();
  const { toast } = useToast();

  const handleImport = () => {
    setIsProcessing(true);

    try {
      // Parse markdown content into grocery items
      const items = parseMarkdownToItems(markdownContent);

      // Create new items to add
      const itemsToAdd = items.map((item) => ({
        name: item.name,
        category: item.category,
        listType: LIST_TYPES.FAVORITES,
        note: item.note,
        purchased: false,
      }));

      // Add all items to the favorites list at once
      addItems(itemsToAdd);

      // Set active tab to 'favorites'
      setActiveTab("favorites");

      toast({
        title: "Import Successful",
        description: `Added ${items.length} items to your favorites.`,
      });

      setIsOpen(false);
      setMarkdownContent("");
    } catch (error) {
      toast({
        title: "Import Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to parse markdown content",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Parse markdown content into grocery items
  const parseMarkdownToItems = (markdown: string) => {
    const lines = markdown.split("\n").filter((line) => line.trim() !== "");
    const items: Array<{ name: string; category: Category; note?: string }> =
      [];

    let currentCategory: Category = "pantry"; // Default to 'pantry' category

    for (const line of lines) {
      // Check if line is a heading (category)
      if (line.startsWith("#")) {
        const categoryName = line
          .replace(/^#+\s*/, "")
          .trim()
          .toLowerCase();

        // Check if the category name is one of the valid categories
        if (Object.values(CATEGORIES).includes(categoryName as Category)) {
          currentCategory = categoryName as Category;
        }
        continue;
      }

      // Check if line is a list item
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const itemText = line.replace(/^[-*]\s*/, "").trim();

        // Check if the item has a note (separated by colon or dash)
        let itemName = itemText;
        let itemNote = undefined;

        const noteDelimiters = [":", " - ", " – "];
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
            note: itemNote,
          });
        }
      }
    }

    if (items.length === 0) {
      throw new Error(
        "No valid items found in the markdown content. Make sure to use proper formatting.",
      );
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
      <Button onClick={() => setIsOpen(true)} variant="outline" className="">
        <i className="fas fa-file-import mr-1 font-medium"></i> Import
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Import from Markdown</DialogTitle>
            <DialogDescription>
              Paste markdown content or upload a markdown file to import items
              into your favorites list.
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
              <label
                htmlFor="markdownInput"
                className="text-sm font-medium text-gray-700"
              >
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
                <li>
                  Use{" "}
                  <code className="bg-gray-100 px-1 rounded"># Category</code>{" "}
                  for category headers
                </li>
                <li>
                  Use <code className="bg-gray-100 px-1 rounded">- Item</code>{" "}
                  or <code className="bg-gray-100 px-1 rounded">* Item</code>{" "}
                  for list items
                </li>
                <li>
                  For notes, use{" "}
                  <code className="bg-gray-100 px-1 rounded">- Item: Note</code>{" "}
                  or{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    - Item - Note
                  </code>
                </li>
                <li>
                  Valid categories: {Object.values(CATEGORIES).join(", ")}
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={markdownContent.trim() === "" || isProcessing}
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
