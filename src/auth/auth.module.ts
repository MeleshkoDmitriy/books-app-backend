import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { JwtAlgorithm } from '@/config/index.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

@Module({
  imports: [
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
  providers: [AuthService],
})
export class AuthModule {}
