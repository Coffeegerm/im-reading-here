import { useQuery } from "@tanstack/react-query";

import { bookClient } from "../lib/book-client";

export const useBooksSearch = (query: string) => {
  return useQuery({
    queryKey: ["books", "search", query],
    queryFn: () => {
      return bookClient.searchBooks(query);
    },
    enabled: !!query.trim(), // Only run query if there's a search term
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBookDetails = (bookId: string) => {
  return useQuery({
    queryKey: ["books", "details", bookId],
    queryFn: () => {
      return bookClient.getBookDetails(bookId);
    },
    enabled: !!bookId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
