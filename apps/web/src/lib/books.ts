import { searchBooks as sharedSearchBooks, getBookDetails as sharedGetBookDetails } from '@im-reading-here/shared';

export async function searchBooks(query: string) {
  return sharedSearchBooks(query);
}

export async function getBookDetails(id: string) {
  return sharedGetBookDetails(id);
}
