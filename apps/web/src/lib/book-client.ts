import { NormalizedBookHit } from "@im-reading-here/shared";

import { apiClient } from "./api-client";
import { apiEndpoints } from "./config";

class BookClient {
  private readonly apiClient = apiClient;

  searchBooks(query: string): Promise<NormalizedBookHit[]> {
    const params = new URLSearchParams({
      q: query.trim(),
    });
    return this.apiClient.get(`${apiEndpoints.books.search}?${params}`);
  }

  getBookDetails(bookId: string): Promise<NormalizedBookHit> {
    return this.apiClient.get(apiEndpoints.books.byId(bookId));
  }
}

export const bookClient = new BookClient();
export { BookClient };
