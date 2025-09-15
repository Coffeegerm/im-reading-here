import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
} from "@nestjs/common";
import { BooksService } from "./books.service";
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import {
  NormalizedBookHitDto,
  ErrorResponseDto,
  ValidationErrorResponseDto,
} from "./dto";

@ApiTags("Books")
@Controller("books")
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get("search")
  @ApiOperation({
    summary: "Search for books",
    description:
      "Search for books using OpenLibrary API. Returns normalized book data with author names, covers, and metadata.",
  })
  @ApiQuery({
    name: "q",
    description: "Search query (book title, author, ISBN, etc.)",
    example: "lord of the rings tolkien",
  })
  @ApiResponse({
    status: 200,
    description: "List of books matching the search query",
    type: [NormalizedBookHitDto],
  })
  @ApiResponse({
    status: 400,
    description: "Invalid search query",
    type: ValidationErrorResponseDto,
  })
  async searchBooks(@Query("q") query: string) {
    return this.booksService.searchBooks({ query });
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get book details",
    description:
      "Get detailed information about a specific book by OpenLibrary work ID. Includes real author names, cover images, and comprehensive metadata.",
  })
  @ApiParam({
    name: "id",
    description: "OpenLibrary work ID (without the /works/ prefix)",
    example: "OL82563W",
  })
  @ApiResponse({
    status: 200,
    description: "Book details with normalized data structure",
    type: NormalizedBookHitDto,
  })
  @ApiResponse({
    status: 404,
    description: "Book not found",
    type: ErrorResponseDto,
  })
  async getBookDetails(@Param("id") id: string) {
    const book = await this.booksService.getBookDetails(id);
    if (!book) {
      throw new NotFoundException({
        statusCode: 404,
        message: "Book not found",
        error: "Not Found",
      });
    }
    return book;
  }
}
