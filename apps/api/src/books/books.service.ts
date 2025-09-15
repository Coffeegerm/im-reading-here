import { Injectable } from "@nestjs/common";
import { searchBooks, getBookDetails } from "@im-reading-here/shared";

@Injectable()
export class BooksService {
  async searchBooks({ query }: { query: string }) {
    return searchBooks({ q: query });
  }

  async getBookDetails(id: string) {
    return getBookDetails(id);
  }
}
