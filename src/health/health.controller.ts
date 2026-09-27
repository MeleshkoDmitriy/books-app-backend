import { Controller, Get } from '@nestjs/common';
import type { HealthResponse } from './health.types.js';

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
