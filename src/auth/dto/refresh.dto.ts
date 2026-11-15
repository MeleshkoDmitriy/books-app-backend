import { API_EXAMPLES } from '@/common/index.js';
import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';
import { AUTH_ERRORS } from '../auth.messages.js';

export class RefreshDto {
  @ApiProperty({ example: API_EXAMPLES.jwt })
  @IsJWT({ message: AUTH_ERRORS.malformedRefreshToken })
  refreshToken: string;
}
