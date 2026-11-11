import type { SafeUser } from '@/users/users.types.js';

declare global {
  namespace Express {
    interface User extends SafeUser {}
  }
}
