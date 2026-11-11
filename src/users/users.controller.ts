import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '@/auth/decorators/current-user.decorator.js';
import type { SafeUser } from './users.types.js';

@Controller('users')
export class UsersController {
  @Get('me')
  me(@CurrentUser() user: SafeUser): SafeUser {
    return user;
  }
}
