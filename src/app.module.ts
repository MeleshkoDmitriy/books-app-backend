import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/index.js';
import { HealthModule } from './health/index.js';
import { AuthModule } from './auth/index.js';
import { UsersModule } from './users/index.js';
import { THROTTLE, validateEnv } from './config/index.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ThrottlerModule.forRoot([THROTTLE.global]),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
