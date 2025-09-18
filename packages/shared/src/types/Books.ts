export interface NormalizedAuthor {
  id: string; // "/authors/OL23919A"
  name: string; // "J. R. R. Tolkien"
}

// After getting the results from openlibrary we want to normalize the results
// and then put them in our db for later use and easier indexing
export interface NormalizedBookHit {
  // Identity
  id: string; // "OL82563W"
  workKey: string; // "/works/OL82563W"
  editionKey?: string; // "OL26331930M" (representative)
  // Display
  title: string;
  authors: NormalizedAuthor[];
  firstPublishYear?: number;
  // Media
  coverId?: number;
  coverUrl?: string; // prebuilt from coverId
  // Filters / ranking
  languages?: string[]; // ["eng", "fre"]
  subjects?: string[]; // trimmed list
  editionCount?: number;
  ratingsAverage?: number;
  ratingsCount?: number;
  hasFullText?: boolean;
  ebookCount?: number;
  publicScan?: boolean;
  numberOfPagesMedian?: number;
  // Identifiers (minimal)
  isbn13?: string;
  isbn10?: string;
  // Links
  openLibrary: {
    work: string; // "https://openlibrary.org/works/OL82563W"
    edition?: string; // "https://openlibrary.org/books/OL26331930M"
    cover?: { S?: string; M?: string; L?: string };
  };
  description?: string;
}
