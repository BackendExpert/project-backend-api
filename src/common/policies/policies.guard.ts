import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { CaslAbilityFactory } from '../policies/casl-ability.factory';

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(private abilityFactory: CaslAbilityFactory) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        request.ability = this.abilityFactory.createForUser(request.user);
        return true;
    }
}
