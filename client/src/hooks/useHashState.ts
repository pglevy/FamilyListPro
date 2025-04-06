import { useState, useEffect } from 'react';

/**
 * A custom hook to sync state with URL hash
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
      const stateString = params.get(key);
      
      if (stateString) {
        return JSON.parse(decodeURIComponent(stateString)) as T;
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
      
      // Preserve the existing tab parameter
      // Don't set default here, just preserve what's already there
      
      // Update the hash state
      params.set(key, encodeURIComponent(JSON.stringify(state)));
      
      // Don't modify the tab parameter here, to avoid conflicts
      
      window.location.hash = params.toString();
    } catch (error) {
      console.error('Error updating hash state:', error);
    }
  }, [state, key]);

  return [state, setState];
}

export default useHashState;
