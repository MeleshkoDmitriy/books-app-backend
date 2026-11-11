export const THROTTLE = {
  global: { ttl: 60_000, limit: 10 },
  login: { ttl: 60_000, limit: 5 },
} as const;
