import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/index.js";
import { RegisterDTO } from "./dto/register.dto.js";
import { hash } from "argon2";


@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDTO) {
    const isEmailAlreadyTaken = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true }
    })

    if (isEmailAlreadyTaken) {
      throw new ConflictException('Email is already taken')
    }

    const hashedPassword = await hash(dto.password);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword
      }
    })
  }
}