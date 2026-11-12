import { API_EXAMPLES, normalizeEmail } from '@/common/index.js';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { AUTH_LIMITS } from '../auth.constants.js';

export class LoginDto {
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
    maxLength: AUTH_LIMITS.password.maxLength,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(AUTH_LIMITS.password.maxLength)
  password: string;
}
