
import { useState, useEffect } from 'react';
import * as LZString from 'lz-string';

// Field mapping for compact serialization
const FIELD_MAP = {
  // GroceryItem fields
  'id': 'i',
  'name': 'n',
  'category': 'c', 
  'listType': 'l',
  'note': 'o',
  'purchased': 'p'
};

const REVERSE_FIELD_MAP = Object.fromEntries(
  Object.entries(FIELD_MAP).map(([k, v]) => [v, k])
);

// Category and listType compression
const CATEGORY_MAP = {
  'produce': 'pr', 'dairy': 'da', 'meat': 'me', 'bakery': 'ba',
  'frozen': 'fr', 'pantry': 'pa', 'household': 'ho'
};

const LIST_TYPE_MAP = {
  'tobuy': 'tb', 'favorites': 'fv', 'neverbuy': 'nb'
};

const REVERSE_CATEGORY_MAP = Object.fromEntries(
  Object.entries(CATEGORY_MAP).map(([k, v]) => [v, k])
);

const REVERSE_LIST_TYPE_MAP = Object.fromEntries(
  Object.entries(LIST_TYPE_MAP).map(([k, v]) => [v, k])
);

/**
 * Compact an object by replacing long field names with short ones
 */
function compactObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(compactObject);
  }
  
  if (obj && typeof obj === 'object') {
    const compact: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const shortKey = FIELD_MAP[key as keyof typeof FIELD_MAP] || key;
      let compactValue = value;
      
      // Compress specific values
      if (key === 'category' && typeof value === 'string') {
        compactValue = CATEGORY_MAP[value as keyof typeof CATEGORY_MAP] || value;
      } else if (key === 'listType' && typeof value === 'string') {
        compactValue = LIST_TYPE_MAP[value as keyof typeof LIST_TYPE_MAP] || value;
      } else if (value && typeof value === 'object') {
        compactValue = compactObject(value);
      }
      
      // Only include non-default values
      if (key === 'purchased' && value === false) continue;
      if (key === 'note' && (!value || value === '')) continue;
      
      compact[shortKey] = compactValue;
    }
    return compact;
  }
  
  return obj;
}

/**
 * Expand a compacted object back to original form
 */
function expandObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(expandObject);
  }
  
  if (obj && typeof obj === 'object') {
    const expanded: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const longKey = REVERSE_FIELD_MAP[key] || key;
      let expandedValue = value;
      
      // Expand specific values
      if (longKey === 'category' && typeof value === 'string') {
        expandedValue = REVERSE_CATEGORY_MAP[value] || value;
      } else if (longKey === 'listType' && typeof value === 'string') {
        expandedValue = REVERSE_LIST_TYPE_MAP[value] || value;
      } else if (value && typeof value === 'object') {
        expandedValue = expandObject(value);
      }
      
      expanded[longKey] = expandedValue;
    }
    
    // Add default values if missing
    if ('id' in expanded) {
      expanded.purchased = expanded.purchased ?? false;
      expanded.note = expanded.note ?? '';
    }
    
    return expanded;
  }
  
  return obj;
}

/**
 * A custom hook to sync state with URL hash using optimized compression
 * @param initialState The initial state
 * @param key The key to store the state under in the URL hash
 * @returns [state, setState]
 */
function useHashState<T>(initialState: T, key: string): [T, (value: T) => void] {
  // Parse the hash from URL or use initialState
  const getHashState = (): T => {
    if (typeof window === 'undefined') return initialState;
    
    try {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const compressedState = params.get(key);
      
      if (compressedState) {
        // Try new format first
        try {
          const decompressed = LZString.decompressFromBase64(compressedState.replace(/-/g, '+').replace(/_/g, '/'));
          if (decompressed) {
            const parsed = JSON.parse(decompressed);
            return expandObject(parsed) as T;
          }
        } catch (e) {
          // Fallback to old format for backward compatibility
          const decompressed = LZString.decompressFromBase64(compressedState.replace(/-/g, '+').replace(/_/g, '/'));
          if (decompressed) {
            return JSON.parse(decompressed) as T;
          }
        }
      }
    } catch (error) {
      console.error('Error parsing hash state:', error);
    }
    
    return initialState;
  };

  const [state, setState] = useState<T>(getHashState);

  // Update the URL hash when state changes
  useEffect(() => {
    try {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      
      // Compact the state before compression
      const compactedState = compactObject(state);
      
      // Try compression, fall back to original if it doesn't help
      const jsonString = JSON.stringify(compactedState);
      const compressed = LZString.compressToBase64(jsonString)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      
      // Only use compression if it actually makes the URL shorter
      const finalState = compressed.length < jsonString.length ? compressed : jsonString;
      
      params.set(key, finalState);
      
      const newHash = params.toString();
      
      // Warn if URL is getting very long
      if (newHash.length > 1500) {
        console.warn('URL length is getting long:', newHash.length, 'characters');
      }
      
      window.location.hash = newHash;
    } catch (error) {
      console.error('Error updating hash state:', error);
    }
  }, [state, key]);

  return [state, setState];
}

export default useHashState;
