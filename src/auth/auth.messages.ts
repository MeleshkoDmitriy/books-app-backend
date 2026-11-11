export const AUTH_ERRORS = {
  invalidCredentials: 'Invalid email or password',
  emailTaken: 'Email is already taken',
  invalidRefreshToken: 'Invalid refresh token',
} as const satisfies Record<string, string>;
