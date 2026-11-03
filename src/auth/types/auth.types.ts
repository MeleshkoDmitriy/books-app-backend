import type { SafeUser } from '../../users/index.js';

export type JwtPayload = {
  sub: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResult = Tokens & {
  user: SafeUser;
};
