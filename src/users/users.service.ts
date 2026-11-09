import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/index.js';
import type { SafeUser } from './users.types.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<SafeUser | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
