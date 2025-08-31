import { Book, BookSearchResult } from './types';
import { normalizeBookData } from './utils';

interface OpenLibrarySearchResponse {
  docs: any[];
}

export async function searchBooks(query: string): Promise<BookSearchResult[]> {
  const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
  const data = (await response.json()) as OpenLibrarySearchResponse;
  return data.docs.map((doc: any) => normalizeBookData(doc));
}

export async function getBookDetails(id: string): Promise<Book> {
  const response = await fetch(`https://openlibrary.org/works/${id}.json`);
  const data = await response.json();
  return normalizeBookData(data);
}
