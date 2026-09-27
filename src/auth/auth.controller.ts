import { Body, Controller, Post } from "@nestjs/common";
import { RegisterDTO } from "./dto/index.js";
import { AuthService } from "./auth.service.js";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto)
  }
}