import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException
} from "@nestjs/common";

import { Reflector } from "@nestjs/core";
import { CaslAbilityFactory } from "./casl-ability.factory";
import { CHECK_POLICIES_KEY } from "../decorators/policies.decorator";

@Injectable()
export class PoliciesGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        private caslFactory: CaslAbilityFactory
    ) { }

    canActivate(context: ExecutionContext): boolean {

        const policy = this.reflector.get(
            CHECK_POLICIES_KEY,
            context.getHandler()
        );

        if (!policy) return true;

        const request = context.switchToHttp().getRequest();

        const user = request.user.user;

        const ability = this.caslFactory.createForUser(user);

        request.ability = ability;

        if (!ability.can(policy.action, policy.subject)) {
            throw new ForbiddenException("Access denied");
        }

        return true;
    }
}