'use client';
import { BookSearchResult } from '@im-reading-here/shared';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { searchBooks } from '@/lib/books';


export function SearchInput() {
  const [query, setQuery] = useState('');
  const { data: results = [] } = useQuery({
    queryKey: ['searchBooks', query],
    queryFn: () => searchBooks(query),
    enabled: !!query,
  });

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for books..."
      />
      <ul>
        {results.map((book: BookSearchResult) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
}
