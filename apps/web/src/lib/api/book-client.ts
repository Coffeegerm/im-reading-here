import { NormalizedBookHit } from "@im-reading-here/shared";

import { apiEndpoints } from "../config";

import { apiClient } from "./api-client";

class BookClient {
  private readonly apiClient = apiClient;

  searchBooks(query: string) {
    const params = new URLSearchParams({
      q: query.trim(),
    });
    return this.apiClient.get<NormalizedBookHit[]>(
      `${apiEndpoints.books.search}?${params}`
    );
  }

  getBookDetails(bookId: string) {
    return this.apiClient.get<NormalizedBookHit>(
      apiEndpoints.books.byId(bookId)
    );
  }
}

export const bookClient = new BookClient();
export { BookClient };
