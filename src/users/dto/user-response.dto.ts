import { ApiProperty } from '@nestjs/swagger';
import type { SafeUser } from '../users.types.js';

export class UserResponseDto implements SafeUser {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ type: String, nullable: true, example: 'John' })
  name: string | null;

  @ApiProperty({ type: String, nullable: true })
  avatarUrl: string | null;

  @ApiProperty({ type: String, nullable: true })
  bio: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
