import { API_EXAMPLES } from '@/common/index.js';
import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class RefreshDto {
  @ApiProperty({ example: API_EXAMPLES.jwt })
  @IsJWT()
  refreshToken: string;
}
