import {
  NormalizedBookHit,
  OpenLibraryWork,
  OpenLibrarySearchResponse,
  OpenLibraryEdition,
} from "./types";
import { normalizeSearchDoc, normalizeWorkDetails } from "./utils";

export async function searchBooks(query: string): Promise<NormalizedBookHit[]> {
  const response = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
  );
  const data = (await response.json()) as OpenLibrarySearchResponse;
  return data.docs.map(normalizeSearchDoc);
}

/**
 * Gets basic book details without fetching author names (uses placeholders).
 * Only use this when you need faster response times and don't need author names.
 *
 * @param id - The OpenLibrary work ID (e.g., "OL93230W")
 * @returns Promise resolving to normalized book data with placeholder author names, or null if not found
 */
export async function getBookDetailsBasic(
  id: string
): Promise<NormalizedBookHit | null> {
  const response = await fetch(`https://openlibrary.org/works/${id}.json`);

  if (!response.ok) {
    return null;
  }

  const work = (await response.json()) as OpenLibraryWork;
  return normalizeWorkDetails(work);
}

export async function getEditionDetails(
  id: string
): Promise<OpenLibraryEdition | null> {
  // Accept "OL12345M", "/books/OL12345M.json", "/editions/OL12345M.json", etc.
  const path =
    id.startsWith("/books/") || id.startsWith("/editions/")
      ? id.replace(/\.json$/, "")
      : `/books/${id.replace(/\.json$/, "")}`;

  const response = await fetch(`https://openlibrary.org${path}.json`);
  if (!response.ok) return null;

  return (await response.json()) as OpenLibraryEdition;
}

export function getBookCoverUrl(coverId?: number, size: "S" | "M" | "L" = "M") {
  return coverId != null
    ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
    : null;
}

/**
 * Fetches author details from OpenLibrary API.
 *
 * @param authorKey - The OpenLibrary author key (e.g., "/authors/OL29303A")
 * @returns Promise resolving to author data with name, or null if not found
 */
export async function getAuthorDetails(authorKey: string): Promise<{ name: string } | null> {
  const response = await fetch(`https://openlibrary.org${authorKey}.json`);
  if (!response.ok) return null;

  const author = await response.json() as { name?: string };
  return { name: author.name || 'Unknown Author' };
}

/**
 * Gets detailed book information from OpenLibrary with real author names.
 * This is the recommended function for fetching book details in the application.
 *
 * @param id - The OpenLibrary work ID (e.g., "OL93230W")
 * @returns Promise resolving to normalized book data with author names, or null if not found
 */
export async function getBookDetails(
  id: string
): Promise<NormalizedBookHit | null> {
  const response = await fetch(`https://openlibrary.org/works/${id}.json`);

  if (!response.ok) {
    return null;
  }

  const work = (await response.json()) as OpenLibraryWork;
  const normalizedBook = normalizeWorkDetails(work);

  // Fetch author names if available
  if (work.authors && work.authors.length > 0) {
    try {
      const authorPromises = work.authors.map(authorRef =>
        getAuthorDetails(authorRef.author.key)
      );
      const authorDetails = await Promise.all(authorPromises);

      normalizedBook.authors = work.authors.map((authorRef, index) => ({
        id: authorRef.author.key,
        name: authorDetails[index]?.name || `Author ${authorRef.author.key.split('/').pop()}`,
      }));
    } catch (error) {
      // Fall back to placeholder names if author fetching fails
      console.warn('Failed to fetch author details:', error);
    }
  }

  return normalizedBook;
}
