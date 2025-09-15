import { CommonKey } from "./Common";

// open library responses
export interface OpenLibraryDoc {
  key: string; // e.g. "/works/OL123W"
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  publish_year?: number[];
  isbn?: string[];
  edition_count?: number;
  subject?: string[];
  language?: string[];
  cover_i?: number; // cover ID used with cover API
  author_key?: string[];
  cover_edition_key?: string;
  ebook_access?: "no_ebook" | "printdisabled" | "borrowable";
  has_fulltext?: boolean;
  public_scan_b?: boolean;
  ia?: string[];
  ia_collection_s?: string; // "inlibrary;internetarchivebooks;printdisabled"
  lending_edition_s?: string;
  lending_identifier_s?: string;
  [key: string]: unknown; // fallback for other fields OpenLibrary may add
}

export interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  numFoundExact?: boolean;
  docs: OpenLibraryDoc[];
  q?: string;
  offset?: number | null;
}

export interface OpenLibraryAuthorReference {
  author: CommonKey; // e.g. "/authors/OL23919A"
  type?: CommonKey; // usually { "key": "/type/author_role" }
}

export interface OpenLibraryLink {
  title: string;
  url: string;
  type?: CommonKey;
}

export interface OpenLibraryDescriptionObject {
  type?: string; // often "text"
  value: string;
}

export type OpenLibraryDescription = string | OpenLibraryDescriptionObject;

export interface OpenLibraryWork {
  key: string; // "/works/OL123W"
  title: string;
  description?: OpenLibraryDescription;
  subjects?: string[];
  subject_places?: string[];
  subject_people?: string[];
  subject_times?: string[];
  covers?: number[]; // cover image IDs
  authors?: OpenLibraryAuthorReference[];
  links?: OpenLibraryLink[];
  created?: { type: string; value: string }; // timestamp
  last_modified?: { type: string; value: string }; // timestamp
  revision?: number;
  type?: CommonKey; // usually "/type/work"
  first_publish_date?: string;
  excerpts?: { comment?: string; text: string }[];
  latest_revision: number;
  [key: string]: unknown; // catch-all
}

export interface OpenLibraryAuthorRef {
  key: string; // "/authors/OL23919A"
  // Some editions inline author display names too:
  name?: string;
}

export interface OpenLibraryContributor {
  name: string;
  role?: string; // e.g. "translator"
}

export interface OpenLibraryToCItem {
  title?: string;
  label?: string;
  pagenum?: string;
  level?: number;
  type?: CommonKey;
}

export interface OpenLibraryLink {
  title: string;
  url: string;
  type?: CommonKey;
}

export interface OpenLibraryEdition {
  key: string; // "/books/OLxxxxxM" or "/editions/OLxxxxxM"
  type?: CommonKey; // usually "/type/edition"
  title: string;
  subtitle?: string;

  description?: OpenLibraryDescription;

  // Relationships
  works?: CommonKey[];
  authors?: OpenLibraryAuthorRef[];
  languages?: CommonKey[];
  contributors?: OpenLibraryContributor[];

  // Publishing details
  publishers?: string[];
  publish_places?: string[];
  publish_country?: string;
  publish_date?: string;
  edition_name?: string;
  series?: string[];

  // Physical/bibliographic
  number_of_pages?: number;
  pagination?: string; // e.g. "xii, 341 p."
  physical_format?: string; // e.g. "Hardcover"
  weight?: string; // e.g. "1.2 kg"
  covers?: number[]; // cover IDs for cover API
  table_of_contents?: OpenLibraryToCItem[];

  // Classification & subjects
  subjects?: string[];
  subject_people?: string[];
  subject_places?: string[];
  subject_times?: string[];
  dewey_decimal_class?: string[]; // sometimes in `classifications` as well
  lc_classifications?: string[]; // ditto

  // Identifiers (varies a lot; keep flexible)
  identifiers?: {
    isbn_10?: string[];
    isbn_13?: string[];
    lccn?: string[];
    oclc?: string[];
    openlibrary?: string[];
    goodreads?: string[];
    librarything?: string[];
    [k: string]: string[] | undefined;
  };

  // Misc
  ocaid?: string;
  local_id?: string[];
  links?: OpenLibraryLink[];
  url?: string;

  // Timestamps/revisions (present on many OL JSON docs)
  created?: { type?: string; value: string };
  last_modified?: { type?: string; value: string };
  revision?: number;

  // Future-proofing
  [k: string]: unknown;
}
