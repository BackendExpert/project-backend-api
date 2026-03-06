import { AbilityBuilder, Ability } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Role } from '../enums/role.enum';

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: any) {
        const { can, cannot, build } = new AbilityBuilder(
            Ability as any,
        );

        if (user.roles.includes(Role.ADMIN)) {
            can('manage', 'all');
        }

        if (user.roles.includes(Role.USER)) {
            can('create', 'Post');
            can('read', 'Post');
            can('update', 'Post', { authorId: user.sub });
            cannot('delete', 'Post');
        }

        return build();
    }
}
