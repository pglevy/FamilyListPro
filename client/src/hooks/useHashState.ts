
import { useState, useEffect } from 'react';
import * as LZString from 'lz-string';

/**
 * A custom hook to sync state with URL hash using compression
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
        const decompressed = LZString.decompressFromBase64(compressedState.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decompressed) as T;
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
      
      // Compress and update the hash state using base64url encoding
      const compressed = LZString.compressToBase64(JSON.stringify(state))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      params.set(key, compressed);
      
      window.location.hash = params.toString();
    } catch (error) {
      console.error('Error updating hash state:', error);
    }
  }, [state, key]);

  return [state, setState];
}

export default useHashState;
