import { SetMetadata } from '@nestjs/common';
import { Actions } from './casl-ability.factory';

export const CHECK_POLICIES = 'check_policies';

export const CheckPolicies = (action: Actions, subject: string) =>
    SetMetadata(CHECK_POLICIES, { action, subject });