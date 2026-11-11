import { Controller, Get } from '@nestjs/common';
import { Public } from '@/auth/decorators/public.decorator.js';
import type { HealthResponse } from './health.types.js';

@Public()
@Controller('health')
export class HealthController {
  @Get()
  check(): HealthResponse {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
