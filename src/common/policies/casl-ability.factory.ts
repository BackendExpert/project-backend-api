import { AbilityBuilder, Ability } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Actions } from './actions.enum';
import { Subjects } from './subjects.type';
import { RolePermissions } from './permissions.matrix';

export type AppAbility = Ability<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {

    createForUser(user: any) {

        const { can, build } = new AbilityBuilder<AppAbility>(Ability as any);

        const roles = user.roles || [];

        roles.forEach(role => {

            const permissions = RolePermissions[role] || [];

            permissions.forEach(permission => {
                can(permission.action, permission.subject as Subjects);
            });

        });

        // Citizen self-access rule
        if (roles.includes('CITIZEN')) {

            can(Actions.READ, 'Citizen', { id: user.sub });
            can(Actions.UPDATE, 'Citizen', { id: user.sub });
            can(Actions.READ, 'WelfareProgram');

        }

        return build();
    }
}