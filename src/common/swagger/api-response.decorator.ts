import {
  ApiBadRequestResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { API_ERRORS } from './swagger.docs.js';

type ApiResponseDecorator = MethodDecorator & ClassDecorator;

export const ApiThrottled = (): ApiResponseDecorator =>
  ApiTooManyRequestsResponse({ description: API_ERRORS.tooManyRequests });

export const ApiValidationFailed = (): ApiResponseDecorator =>
  ApiBadRequestResponse({ description: API_ERRORS.invalidInput });

export const ApiUnauthorized = (
  description: string = API_ERRORS.missingAccessToken,
): ApiResponseDecorator => ApiUnauthorizedResponse({ description });
