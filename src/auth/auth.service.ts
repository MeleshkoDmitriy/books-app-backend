import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { PrismaService } from '@/prisma/prisma.service.js';
import { LoginDto, RegisterDto } from './dto/index.js';
import type { AuthResult, JwtPayload, Tokens } from './auth.types.js';
import { Prisma } from '@/generated/prisma/client.js';

type ExpiresIn = NonNullable<JwtSignOptions['expiresIn']>;
const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password';

const EMAIL_TAKEN_MESSAGE = 'Email is already taken';

const isUniqueViolation = (error: unknown): boolean => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  );
};

@Injectable()
export class AuthService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenTtl: ExpiresIn;
  private readonly refreshTokenTtl: ExpiresIn;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    config: ConfigService,
  ) {
    this.accessTokenSecret = config.getOrThrow<string>('JWT_ACCESS_SECRET');
    this.refreshTokenSecret = config.getOrThrow<string>('JWT_REFRESH_SECRET');
    this.accessTokenTtl = config.getOrThrow<ExpiresIn>('JWT_ACCESS_TTL');
    this.refreshTokenTtl = config.getOrThrow<ExpiresIn>('JWT_REFRESH_TTL');
  }

  private async issueTokens(userId: string): Promise<Tokens> {
    const payload: JwtPayload = { sub: userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.accessTokenSecret,
        expiresIn: this.accessTokenTtl,
      }),
      this.jwt.signAsync(payload, {
        secret: this.refreshTokenSecret,
        expiresIn: this.refreshTokenTtl,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(dto: RegisterDto): Promise<AuthResult> {
    const passwordHash = await hash(dto.password);

    const user = await this.prisma.user
      .create({
        data: {
          email: dto.email,
          name: dto.name,
          passwordHash,
        },
      })
      .catch((error: unknown) => {
        if (isUniqueViolation(error)) {
          throw new ConflictException(EMAIL_TAKEN_MESSAGE);
        }

        throw error;
      });

    const tokens = await this.issueTokens(user.id);

    return {
      user,
      ...tokens,
    };
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const userRecord = await this.prisma.user.findUnique({
      where: { email: dto.email },
      omit: { passwordHash: false },
    });

    if (!userRecord) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const passwordMatches = await verify(userRecord.passwordHash, dto.password);

    if (!passwordMatches) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const { passwordHash: _passwordHash, ...user } = userRecord;

    const tokens = await this.issueTokens(user.id);

    return {
      user,
      ...tokens,
    };
  }
}
