import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { THROTTLE } from '@/config/index.js';
import { AUTH_ERRORS } from './auth.messages.js';
import { Public } from './decorators/public.decorator.js';
import {
  AuthResponseDto,
  LoginDto,
  RefreshDto,
  RegisterDto,
  TokensResponseDto,
} from './dto/index.js';
import { AuthService } from './auth.service.js';

@ApiTags('Auth')
@Public()
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new account' })
  @ApiCreatedResponse({ type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiConflictResponse({ description: AUTH_ERRORS.emailTaken })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @Post('register')
  register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Log in with email and password' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: AUTH_ERRORS.invalidCredentials })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: THROTTLE.login })
  login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Get a new token pair using a refresh token' })
  @ApiOkResponse({ type: TokensResponseDto })
  @ApiBadRequestResponse({ description: 'Malformed refresh token' })
  @ApiUnauthorizedResponse({ description: AUTH_ERRORS.invalidRefreshToken })
  @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshDto): Promise<TokensResponseDto> {
    return this.authService.refresh(dto);
  }
}
