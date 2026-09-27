import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/index.js";
import { RegisterDto } from "./dto/index.js";
import { hash } from "argon2";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '30d';

@Injectable()
export class AuthService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    config: ConfigService,
  ) {
    this.accessTokenSecret = config.getOrThrow<string>("JWT_ACCESS_SECRET")
    this.refreshTokenSecret = config.getOrThrow<string>("JWT_REFRESH_SECRET")
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
      })
    ])
    
    return { 
      accessToken,
      refreshToken,
    };
  }

  async register(dto: RegisterDto) {
    const isEmailAlreadyTaken = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true }
    })

    if (isEmailAlreadyTaken) {
      throw new ConflictException('Email is already taken')
    }

    const hashedPassword = await hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword
      }
    })

    const tokens = await this.issueTokens(user.id);

    return {
      user,
      ...tokens,
    }
  }
}