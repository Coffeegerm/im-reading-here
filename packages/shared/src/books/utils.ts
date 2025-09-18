import { OpenLibraryDoc, OpenLibraryWork } from "../types/OpenLibrary";
import { NormalizedBookHit } from "../types";

export function normalizeWorkDetails(work: OpenLibraryWork): NormalizedBookHit {
  // Work identity
  const workKey: string = work.key; // "/works/OLxxxW"
  const id = work.key.split("/").pop() as string;

  // Authors - convert from OpenLibrary author references to normalized format
  // Note: For full author names, you may want to fetch author details separately
  // For now, we'll extract the author ID and use a placeholder name
  const authors =
    work.authors?.map((authorRef) => {
      const authorId = authorRef.author.key;
      // Extract author key (e.g., "OL29303A" from "/authors/OL29303A")
      const authorKey = authorId.split("/").pop() || "Unknown";
      return {
        id: authorId,
        name: `Author ${authorKey}`, // Placeholder - consider fetching actual names
      };
    }) || [];

  // Cover handling - use first cover ID if available
  const coverId: number | undefined = work.covers?.[0];
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : undefined;

  // Cover links for all sizes
  const coverLinks = coverId
    ? {
        S: `https://covers.openlibrary.org/b/id/${coverId}-S.jpg`,
        M: `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`,
        L: `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`,
      }
    : undefined;

  // Parse first publish date to extract year
  const firstPublishYear = work.first_publish_date
    ? new Date(work.first_publish_date).getFullYear()
    : undefined;

  // OpenLibrary URLs
  const olWorkUrl = `https://openlibrary.org${workKey}`;

  const description = (
    typeof work.description === "string"
      ? work.description
      : work.description?.value
  )?.trim();

  return {
    id,
    workKey,
    editionKey: undefined, // Work details don't include a specific edition
    title: work.title,
    authors,
    firstPublishYear,
    coverId,
    coverUrl,
    languages: undefined, // Not typically in work details
    subjects: work.subjects?.slice(0, 8), // Limit to 8 subjects like search results
    editionCount: undefined, // Not available in work details
    ratingsAverage: undefined, // Not available in work details
    ratingsCount: undefined, // Not available in work details
    hasFullText: undefined, // Not available in work details
    ebookCount: undefined, // Not available in work details
    publicScan: undefined, // Not available in work details
    numberOfPagesMedian: undefined, // Not available in work details
    isbn13: undefined, // Work details don't include ISBNs (those are edition-specific)
    isbn10: undefined, // Work details don't include ISBNs (those are edition-specific)
    openLibrary: {
      work: olWorkUrl,
      edition: undefined,
      cover: coverLinks,
    },
    description,
  };
}

export function normalizeSearchDoc(doc: OpenLibraryDoc): NormalizedBookHit {
  // Work identity
  const workKey: string = doc.key; // "/works/OLxxxW"
  const id = doc.key.split("/").pop() as string;
  // Choose a representative edition
  const editionKey: string | undefined =
    doc.cover_edition_key ??
    (Array.isArray(doc.edition_key) ? doc.edition_key[0] : undefined);

  // Authors (pair names to keys safely)
  const authorNames: string[] = Array.isArray(doc.author_name)
    ? doc.author_name
    : [];
  const authorKeys: string[] = Array.isArray(doc.author_key)
    ? doc.author_key
    : [];
  const authors = authorNames
    .map((name, i) => ({
      id: authorKeys[i] ? `/authors/${authorKeys[i]}` : authorKeys[i],
      name,
    }))
    .filter((a) => !!a.name);

  // ISBNs (pick one of each if available)
  const isbns: string[] = Array.isArray(doc.isbn) ? doc.isbn : [];
  const isbn13 = isbns.find((x) => x.replace(/-/g, "").length === 13);
  const isbn10 = isbns.find((x) => x.replace(/-/g, "").length === 10);

  // Cover URLs
  const coverId: number | undefined =
    typeof doc.cover_i === "number" ? doc.cover_i : undefined;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : editionKey
      ? `https://covers.openlibrary.org/b/OLID/${editionKey}-M.jpg`
      : undefined;

  // Links
  const olWorkUrl = `https://openlibrary.org${workKey}`;
  const olEditionUrl = editionKey
    ? `https://openlibrary.org/books/${editionKey}`
    : undefined;
  const coverLinks =
    coverId || editionKey
      ? {
          S: coverId
            ? `https://covers.openlibrary.org/b/id/${coverId}-S.jpg`
            : `https://covers.openlibrary.org/b/OLID/${editionKey}-S.jpg`,
          M: coverUrl,
          L: coverId
            ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
            : `https://covers.openlibrary.org/b/OLID/${editionKey}-L.jpg`,
        }
      : undefined;

  return {
    id,
    workKey,
    editionKey,
    title: doc.title ?? doc.title_suggest ?? "Untitled",
    authors,
    firstPublishYear: doc.first_publish_year,
    coverId,
    coverUrl,
    languages: Array.isArray(doc.language) ? doc.language : undefined,
    subjects: Array.isArray(doc.subject) ? doc.subject.slice(0, 8) : undefined, // trim
    editionCount: doc.edition_count,
    ratingsAverage:
      typeof doc.ratings_average === "number" ? doc.ratings_average : undefined,
    ratingsCount:
      typeof doc.ratings_count === "number" ? doc.ratings_count : undefined,
    hasFullText: Boolean(doc.has_fulltext),
    ebookCount:
      typeof doc.ebook_count_i === "number" ? doc.ebook_count_i : undefined,
    publicScan: Boolean(doc.public_scan_b),
    numberOfPagesMedian:
      typeof doc.number_of_pages_median === "number"
        ? doc.number_of_pages_median
        : undefined,
    isbn13,
    isbn10,
    openLibrary: {
      work: olWorkUrl,
      edition: olEditionUrl,
      cover: coverLinks,
    },
  };
}
