import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

//===============================================================

interface useDebouncedSearchProps {
  delay?: number;
  onDebounced?: (value: string) => void;
}

//===============================================================

function useDebouncedSearch({
  delay = 300,
  onDebounced,
}: useDebouncedSearchProps = {}) {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');

  const debounced = useDebouncedCallback((v: string) => {
    setQuery(v);
    onDebounced?.(v);
  }, delay);

  const onChange = (v: string) => {
    setInput(v);
    debounced(v.trim());
  };

  return { input, query, onChange, setInput, setQuery };
}

export default useDebouncedSearch;
