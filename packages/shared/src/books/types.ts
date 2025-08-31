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
