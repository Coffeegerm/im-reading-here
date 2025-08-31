import { Controller, Get, Query, Param } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('search')
  async searchBooks(@Query('q') query: string) {
    return this.booksService.searchBooks(query);
  }

  @Get(':id')
  async getBookDetails(@Param('id') id: string) {
    return this.booksService.getBookDetails(id);
  }
}
