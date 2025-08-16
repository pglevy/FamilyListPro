import { useState, useEffect } from 'react';
import * as LZString from 'lz-string';
import { GroceryItem } from '@/lib/types';
import { LIST_TYPES } from '@/lib/constants';

// Optimized field mapping for To Buy items only
const FIELD_MAP = {
  'id': 'i',
  'name': 'n', 
  'category': 'c',
  'note': 'o',
  'purchased': 'p'
};

const REVERSE_FIELD_MAP = Object.fromEntries(
  Object.entries(FIELD_MAP).map(([k, v]) => [v, k])
);

// Category compression for smaller URLs
const CATEGORY_MAP = {
  'produce': 'pr', 'dairy': 'da', 'meat': 'me', 'bakery': 'ba',
  'frozen': 'fr', 'pantry': 'pa', 'household': 'ho'
};

const REVERSE_CATEGORY_MAP = Object.fromEntries(
  Object.entries(CATEGORY_MAP).map(([k, v]) => [v, k])
);

/**
 * Compact a To Buy item for URL storage (excludes listType since it's always 'tobuy')
 */
function compactToBuyItem(item: GroceryItem): any {
  const compact: any = {};
  
  // Map fields to shorter names
  compact[FIELD_MAP.id] = item.id;
  compact[FIELD_MAP.name] = item.name;
  compact[FIELD_MAP.category] = CATEGORY_MAP[item.category as keyof typeof CATEGORY_MAP] || item.category;
  
  // Only include non-default values
  if (item.note && item.note.trim()) {
    compact[FIELD_MAP.note] = item.note;
  }
  if (item.purchased) {
    compact[FIELD_MAP.purchased] = item.purchased;
  }
  
  return compact;
}

/**
 * Expand a compacted item back to full GroceryItem
 */
function expandToBuyItem(compact: any): GroceryItem {
  return {
    id: compact[FIELD_MAP.id],
    name: compact[FIELD_MAP.name],
    category: REVERSE_CATEGORY_MAP[compact[FIELD_MAP.category]] || compact[FIELD_MAP.category],
    listType: LIST_TYPES.TO_BUY,
    note: compact[FIELD_MAP.note] || '',
    purchased: compact[FIELD_MAP.purchased] || false
  };
}

/**
 * Custom hook for URL-shareable state that only stores To Buy items
 * This dramatically reduces URL length by excluding favorites and never-buy items
 */
export function useShareableState(allItems: GroceryItem[]): void {
  // Filter to only To Buy items
  const toBuyItems = allItems.filter(item => item.listType === LIST_TYPES.TO_BUY);

  useEffect(() => {
    try {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      
      if (toBuyItems.length === 0) {
        // If no To Buy items, remove the URL parameter
        params.delete('share');
        window.location.hash = params.toString();
        return;
      }
      
      // Compact the To Buy items
      const compactedItems = toBuyItems.map(compactToBuyItem);
      
      // Try compression
      const jsonString = JSON.stringify(compactedItems);
      const compressed = LZString.compressToBase64(jsonString)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      
      // Use whichever is shorter
      const finalState = compressed.length < jsonString.length ? compressed : jsonString;
      
      params.set('share', finalState);
      
      const newHash = params.toString();
      
      // Much more aggressive warning since we're only storing To Buy items
      if (newHash.length > 1000) {
        console.warn('Shareable URL is getting long:', newHash.length, 'characters');
      }
      
      window.location.hash = newHash;
    } catch (error) {
      console.error('Error updating shareable state:', error);
    }
  }, [toBuyItems]);
}

/**
 * Parse shared To Buy items from URL and return them
 */
export function parseSharedItems(): GroceryItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const sharedState = params.get('share');
    
    if (sharedState) {
      let decompressed: string | null = null;
      
      // Try decompression first
      try {
        decompressed = LZString.decompressFromBase64(sharedState.replace(/-/g, '+').replace(/_/g, '/'));
      } catch (e) {
        // Not compressed, use as-is
        decompressed = sharedState;
      }
      
      if (decompressed) {
        const compactedItems = JSON.parse(decompressed);
        return compactedItems.map(expandToBuyItem);
      }
    }
  } catch (error) {
    console.error('Error parsing shared items:', error);
  }
  
  return [];
}