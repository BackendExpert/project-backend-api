import type { Request } from 'express';
import type { User } from 'src/user/schema/user.schema';
import type { AppAbility } from 'src/common/policies/casl-ability.factory';

export interface AuthRequest extends Request {
    user: Partial<User> & { email: string };
    ability: AppAbility;
}