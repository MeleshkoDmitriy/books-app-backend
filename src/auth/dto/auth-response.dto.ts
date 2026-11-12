import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '@/users/dto/user-response.dto.js';
import type { AuthResult, Tokens } from '../auth.types.js';

export class TokensResponseDto implements Tokens {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken: string;
}

export class AuthResponseDto extends TokensResponseDto implements AuthResult {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
