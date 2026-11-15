export const AUTH_LIMITS = {
  email: { maxLength: 254 },
  password: { minLength: 8, maxLength: 128 },
  name: { maxLength: 50 },
} as const;
