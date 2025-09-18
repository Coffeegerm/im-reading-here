import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UserDto {
  @ApiProperty({
    description: 'User ID',
    example: 'e9b4a741-a617-474b-907e-75e5500a333b',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'User name',
    example: 'J. R. R. Tolkien',
  })
  @IsString()
  name: string;
}
