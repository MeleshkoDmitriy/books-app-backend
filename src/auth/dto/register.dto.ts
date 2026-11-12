import { API_EXAMPLES, normalizeEmail, trimString } from '@/common/index.js';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AUTH_LIMITS } from '../auth.constants.js';

export class RegisterDto {
  @ApiProperty({
    example: API_EXAMPLES.email,
    maxLength: AUTH_LIMITS.email.maxLength,
  })
  @Transform(normalizeEmail)
  @IsEmail()
  @MaxLength(AUTH_LIMITS.email.maxLength)
  email: string;

  @ApiProperty({
    example: 'supersecret',
    minLength: 8,
    maxLength: AUTH_LIMITS.password.maxLength,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(AUTH_LIMITS.password.maxLength)
  password: string;

  @ApiPropertyOptional({ example: 'John', maxLength: 50 })
  @IsOptional()
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name?: string;
}
