import { AbilityBuilder, Ability } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Actions } from './actions.enum';
import { RolePermissions } from './permissions.matrix';

export type AppAbility = Ability<[Actions, string]>;

@Injectable()
export class CaslAbilityFactory {

    createForUser(user: any): AppAbility {
        const { can, build } = new AbilityBuilder<AppAbility>(Ability as any);

        const roles = user?.roles || [];

        if (roles.includes('super_admin')) {
            can(Actions.MANAGE, 'all');
        }

        roles.forEach(role => {
            if (role === 'super_admin') return;
            const permissions = RolePermissions[role] || [];
            permissions.forEach(p => can(p.action, p.subject));
        });

        if (roles.includes('citizen')) {
            can(Actions.READ, 'Citizen', { id: user.sub });
            can(Actions.UPDATE, 'Citizen', { id: user.sub });
        }

        return build();
    }
}