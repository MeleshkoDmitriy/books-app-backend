import { API_EXAMPLES, normalizeEmail, trimString } from '@/common/index.js';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
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
    example: API_EXAMPLES.password,
    minLength: AUTH_LIMITS.password.minLength,
    maxLength: AUTH_LIMITS.password.maxLength,
  })
  @IsString()
  @MinLength(AUTH_LIMITS.password.minLength)
  @MaxLength(AUTH_LIMITS.password.maxLength)
  password: string;

  @ApiProperty({
    example: API_EXAMPLES.name,
    maxLength: AUTH_LIMITS.name.maxLength,
  })
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(AUTH_LIMITS.name.maxLength)
  name: string;
}
