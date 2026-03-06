import type { Request } from 'express';
import type { User } from 'src/user/schema/user.schema';

export interface AuthRequest extends Request {
    user: Partial<User> & { email: string };
}