import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiUnauthorized } from '@/common/index.js';
import { CurrentUser } from '@/auth/decorators/current-user.decorator.js';
import { UserResponseDto } from './dto/index.js';
import type { SafeUser } from './users.types.js';

@ApiTags('Users')
@ApiBearerAuth()
@ApiUnauthorized()
@Controller('users')
export class UsersController {
  @ApiOperation({ summary: 'Get the current user' })
  @ApiOkResponse({ type: UserResponseDto })
  @Get('me')
  me(@CurrentUser() user: SafeUser): UserResponseDto {
    return user;
  }
}
