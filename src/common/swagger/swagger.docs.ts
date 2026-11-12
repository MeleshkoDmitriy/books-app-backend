export const API_ERRORS = {
  tooManyRequests: 'Too many requests',
  invalidInput: 'Invalid input data',
  missingAccessToken: 'Missing or invalid access token',
  malformedRefreshToken: 'Malformed refresh token',
} as const satisfies Record<string, string>;

export const API_EXAMPLES = {
  email: 'john@example.com',
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
} as const;
