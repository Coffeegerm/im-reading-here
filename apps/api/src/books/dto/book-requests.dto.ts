import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class SearchBooksQueryDto {
  @ApiProperty({
    description: 'Search query for books (title, author, ISBN, etc.)',
    example: 'lord of the rings tolkien',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  q: string;
}

export class BookIdParamDto {
  @ApiProperty({
    description: 'OpenLibrary work ID (without the /works/ prefix)',
    example: 'OL82563W',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
