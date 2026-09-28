import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { PrismaService } from '../prisma/index.js';
import { LoginDto, RegisterDto } from './dto/index.js';

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '30d';

const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password';

@Injectable()
export class AuthService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    config: ConfigService,
  ) {
    this.accessTokenSecret = config.getOrThrow<string>('JWT_ACCESS_SECRET');
    this.refreshTokenSecret = config.getOrThrow<string>('JWT_REFRESH_SECRET');
  }

  private async issueTokens(userId: string) {
    const payload = { sub: userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.accessTokenSecret,
        expiresIn: ACCESS_TOKEN_TTL,
      }),
      this.jwt.signAsync(payload, {
        secret: this.refreshTokenSecret,
        expiresIn: REFRESH_TOKEN_TTL,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(dto: RegisterDto) {
    const isEmailAlreadyTaken = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });

    if (isEmailAlreadyTaken) {
      throw new ConflictException('Email is already taken');
    }

    const hashedPassword = await hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword,
      },
    });

    const tokens = await this.issueTokens(user.id);

    return {
      user,
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
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
