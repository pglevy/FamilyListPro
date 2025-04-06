import { Category, ListType } from "@shared/schema";

export interface GroceryItem {
  id: string;
  name: string;
  category: Category;
  listType: ListType;
  note?: string;
  purchased?: boolean;
}

export type GroceryList = GroceryItem[];

export interface GroceryState {
  items: GroceryList;
}
