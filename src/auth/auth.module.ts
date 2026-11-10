import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { JwtAlgorithm } from '@/config/index.js';
import { UsersModule } from '@/users/users.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        signOptions: {
          algorithm: config.getOrThrow<JwtAlgorithm>('JWT_ALGORITHM'),
        },
        verifyOptions: {
          algorithms: [config.getOrThrow<JwtAlgorithm>('JWT_ALGORITHM')],
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
