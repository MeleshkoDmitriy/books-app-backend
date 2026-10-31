import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Matches,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

const TTL_PATTERN = /^\d+[smhd]$/;

class EnvironmentVariables {
  // BASE
  @IsEnum(Environment)
  NODE_ENV: Environment;

  // HTTP
  @IsInt()
  @Min(1)
  @Max(65535)
  HTTP_PORT: number;

  @IsString()
  @IsNotEmpty()
  HTTP_PREFIX: string;

  @IsUrl({ require_tld: false, require_protocol: true })
  HTTP_CORS_ORIGIN: string;

  // DATABASE
  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  // JWT
  @IsString()
  @MinLength(32)
  JWT_ACCESS_SECRET: string;

  @IsString()
  @MinLength(32)
  JWT_REFRESH_SECRET: string;

  @Matches(TTL_PATTERN)
  JWT_ACCESS_TTL: string;

  @Matches(TTL_PATTERN)
  JWT_REFRESH_TTL: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const env = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(env);

  if (errors.length > 0) {
    throw new Error(`Invalid environment variables:\n${errors.toString()}`);
  }

  return env;
}
