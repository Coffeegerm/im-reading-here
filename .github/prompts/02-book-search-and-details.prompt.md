# Book Search and Details Implementation Plan

## Overview

### Backend
- Implement comprehensive search using OpenLibrary in our backend that caches results to save later resources.
- Provide an endpoint to fetch details for a specific book by its OpenLibrary ID.
- Implement a fallback mechanism to Google Books API if OpenLibrary data is unavailable.
- Cache search results and book details in the database to reduce API calls and improve performance.

### Web
- Add a search input on the dashboard to show dropdown options from OpenLibrary that a user can select from.
- Create a book details page that users are navigated to upon selecting a book from the dropdown.
- Use TanStack Query for efficient data fetching and caching on the frontend.
- Ensure the UI is responsive and accessible, adhering to the design system.

## Implementation Plan

### Phase 1: Shared Package Enhancement

#### 1.1 Shared Types and Utilities
```typescript
// packages/shared/src/books/types.ts
export interface Book {
  id: string;
  title: string;
  authors: string[];
  coverUrl?: string;
  publishedYear?: number;
  subjects?: string[];
}

export interface BookSearchResult {
  id: string;
  title: string;
  authors: string[];
  coverUrl?: string;
}
```

```typescript
// packages/shared/src/books/utils.ts
export function normalizeBookData(data: any): Book {
  // Normalize OpenLibrary or Google Books data into the shared Book interface
}
```

#### 1.2 Shared API Client
```typescript
// packages/shared/src/books/api.ts
import { Book, BookSearchResult } from './types';

export async function searchBooks(query: string): Promise<BookSearchResult[]> {
  // Call OpenLibrary API and normalize results
}

export async function getBookDetails(id: string): Promise<Book> {
  // Fetch book details from OpenLibrary or Google Books
}
```

### Phase 2: Backend Integration

#### 2.1 API Endpoints
```typescript
// apps/api/src/books/books.controller.ts
import { Controller, Get, Query, Param } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('search')
  async searchBooks(@Query('q') query: string) {
    return this.booksService.searchBooks(query);
  }

  @Get(':id')
  async getBookDetails(@Param('id') id: string) {
    return this.booksService.getBookDetails(id);
  }
}
```

#### 2.2 Service Implementation
```typescript
// apps/api/src/books/books.service.ts
import { Injectable } from '@nestjs/common';
import { searchBooks, getBookDetails } from '@im-reading-here/shared';

@Injectable()
export class BooksService {
  async searchBooks(query: string) {
    return searchBooks(query);
  }

  async getBookDetails(id: string) {
    return getBookDetails(id);
  }
}
```

### Phase 3: Frontend Integration

#### 3.1 Search Input Component
```typescript
// apps/web/src/components/books/search-input.tsx
'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchBooks } from '@/lib/books';

export function SearchInput() {
  const [query, setQuery] = useState('');
  const { data: results } = useQuery(['searchBooks', query], () => searchBooks(query), {
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
        {results?.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

#### 3.2 Book Details Page
```typescript
// apps/web/src/app/books/[id]/page.tsx
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { getBookDetails } from '@/lib/books';

export default function BookDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: book } = useQuery(['getBookDetails', id], () => getBookDetails(id), {
    enabled: !!id,
  });

  if (!book) return <div>Loading...</div>;

  return (
    <div>
      <h1>{book.title}</h1>
      <p>{book.authors.join(', ')}</p>
      {book.coverUrl && <img src={book.coverUrl} alt={book.title} />}
    </div>
  );
}
```

### Phase 4: Testing Strategy

#### 4.1 Backend Tests
```typescript
// apps/api/src/books/books.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksService],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

#### 4.2 Frontend Tests
```typescript
// apps/web/src/components/books/search-input.spec.tsx
import { render, screen } from '@testing-library/react';
import { SearchInput } from './search-input';

describe('SearchInput', () => {
  it('renders input field', () => {
    render(<SearchInput />);
    expect(screen.getByPlaceholderText('Search for books...')).toBeInTheDocument();
  });
});
```
