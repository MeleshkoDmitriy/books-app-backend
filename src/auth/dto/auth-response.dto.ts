import { API_EXAMPLES } from '@/common/index.js';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '@/users/dto/user-response.dto.js';
import type { AuthResult, Tokens } from '../auth.types.js';

export class TokensResponseDto implements Tokens {
  @ApiProperty({ example: API_EXAMPLES.jwt })
  accessToken: string;

  @ApiProperty({ example: API_EXAMPLES.jwt })
  refreshToken: string;
}

export class AuthResponseDto extends TokensResponseDto implements AuthResult {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
