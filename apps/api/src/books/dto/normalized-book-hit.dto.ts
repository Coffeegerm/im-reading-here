import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class NormalizedAuthorDto {
  @ApiProperty({
    description: 'OpenLibrary author ID',
    example: '/authors/OL23919A',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Author name',
    example: 'J. R. R. Tolkien',
  })
  @IsString()
  name: string;
}

export class OpenLibraryCoverLinksDto {
  @ApiProperty({
    description: 'Small cover image URL',
    example: 'https://covers.openlibrary.org/b/id/6549496-S.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  S?: string;

  @ApiProperty({
    description: 'Medium cover image URL',
    example: 'https://covers.openlibrary.org/b/id/6549496-M.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  M?: string;

  @ApiProperty({
    description: 'Large cover image URL',
    example: 'https://covers.openlibrary.org/b/id/6549496-L.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  L?: string;
}

export class OpenLibraryLinksDto {
  @ApiProperty({
    description: 'OpenLibrary work page URL',
    example: 'https://openlibrary.org/works/OL82563W',
  })
  @IsUrl()
  work: string;

  @ApiProperty({
    description: 'OpenLibrary edition page URL',
    example: 'https://openlibrary.org/books/OL26331930M',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  edition?: string;

  @ApiProperty({
    description: 'Cover image URLs in different sizes',
    type: OpenLibraryCoverLinksDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OpenLibraryCoverLinksDto)
  cover?: OpenLibraryCoverLinksDto;
}

export class NormalizedBookHitDto {
  @ApiProperty({
    description: 'OpenLibrary work identifier',
    example: '/works/OL82563W',
  })
  @IsString()
  workKey: string;

  @ApiProperty({
    description: 'Representative edition identifier',
    example: 'OL26331930M',
    required: false,
  })
  @IsOptional()
  @IsString()
  editionKey?: string;

  @ApiProperty({
    description: 'Book title',
    example: 'The Lord of the Rings',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'List of book authors',
    type: [NormalizedAuthorDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NormalizedAuthorDto)
  authors: NormalizedAuthorDto[];

  @ApiProperty({
    description: 'Year of first publication',
    example: 1954,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  firstPublishYear?: number;

  @ApiProperty({
    description: 'OpenLibrary cover ID',
    example: 6549496,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  coverId?: number;

  @ApiProperty({
    description: 'Direct URL to medium-sized cover image',
    example: 'https://covers.openlibrary.org/b/id/6549496-M.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  coverUrl?: string;

  @ApiProperty({
    description: 'Language codes for available editions',
    example: ['eng', 'fre'],
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiProperty({
    description: 'Book subjects/topics (limited to 8 items)',
    example: ['Fantasy', 'Adventure', 'Epic', 'Middle-earth'],
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects?: string[];

  @ApiProperty({
    description: 'Total number of editions available',
    example: 42,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  editionCount?: number;

  @ApiProperty({
    description: 'Average user rating',
    example: 4.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  ratingsAverage?: number;

  @ApiProperty({
    description: 'Total number of ratings',
    example: 1250,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  ratingsCount?: number;

  @ApiProperty({
    description: 'Whether full text is available for reading',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasFullText?: boolean;

  @ApiProperty({
    description: 'Number of available ebook editions',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  ebookCount?: number;

  @ApiProperty({
    description: 'Whether book has publicly available scans',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  publicScan?: boolean;

  @ApiProperty({
    description: 'Median number of pages across all editions',
    example: 1216,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  numberOfPagesMedian?: number;

  @ApiProperty({
    description: 'ISBN-13 identifier',
    example: '9780618640157',
    required: false,
  })
  @IsOptional()
  @IsString()
  isbn13?: string;

  @ApiProperty({
    description: 'ISBN-10 identifier',
    example: '0618640150',
    required: false,
  })
  @IsOptional()
  @IsString()
  isbn10?: string;

  @ApiProperty({
    description: 'OpenLibrary related links',
    type: OpenLibraryLinksDto,
  })
  @ValidateNested()
  @Type(() => OpenLibraryLinksDto)
  openLibrary: OpenLibraryLinksDto;
}
