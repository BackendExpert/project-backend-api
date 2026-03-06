import { AbilityBuilder, Ability } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export enum Actions {
    MANAGE = 'manage',
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete',
    APPROVE = 'approve',
    VERIFY = 'verify',
    REPORT = 'report'
}

export type Subjects =
    | 'Citizen'
    | 'Household'
    | 'EducationRecord'
    | 'EmploymentRecord'
    | 'HealthRecord'
    | 'AgricultureRecord'
    | 'WelfareProgram'
    | 'VillageAsset'
    | 'User'
    | 'ActivityLog'
    | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: any) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability as any);

        const roles = user.roles || [];

        /* SUPER ADMIN */
        if (roles.includes(Role.SUPER_ADMIN)) {
            can(Actions.MANAGE, 'all');
        }

        /* SYSTEM ADMIN */
        if (roles.includes(Role.SYSTEM_ADMIN)) {
            can(Actions.MANAGE, 'User');
            can(Actions.READ, 'ActivityLog');
            can(Actions.READ, 'Citizen');
            can(Actions.READ, 'Household');
        }

        /* DATA ENTRY OFFICER */
        if (roles.includes(Role.DATA_ENTRY_OFFICER)) {
            can(Actions.CREATE, 'Citizen');
            can(Actions.UPDATE, 'Citizen');
            can(Actions.READ, 'Citizen');

            can(Actions.CREATE, 'Household');
            can(Actions.UPDATE, 'Household');
            can(Actions.READ, 'Household');

            can(Actions.CREATE, 'EducationRecord');
            can(Actions.CREATE, 'EmploymentRecord');
            can(Actions.CREATE, 'HealthRecord');

            cannot(Actions.DELETE, 'Citizen');
        }

        /* DATA MANAGER */
        if (roles.includes(Role.DATA_MANAGER)) {
            can(Actions.READ, 'Citizen');
            can(Actions.UPDATE, 'Citizen');
            can(Actions.VERIFY, 'Citizen');
            can(Actions.APPROVE, 'Citizen');
            can(Actions.REPORT, 'Citizen');
        }

        /* VILLAGE OFFICER */
        if (roles.includes(Role.VILLAGE_OFFICER)) {
            can(Actions.READ, 'Citizen');
            can(Actions.READ, 'Household');
            can(Actions.READ, 'VillageAsset');
            can(Actions.REPORT, 'Citizen');
        }

        /* WELFARE OFFICER */
        if (roles.includes(Role.WELFARE_OFFICER)) {
            can(Actions.READ, 'Citizen');
            can(Actions.CREATE, 'WelfareProgram');
            can(Actions.UPDATE, 'WelfareProgram');
            can(Actions.APPROVE, 'WelfareProgram');
            can(Actions.REPORT, 'WelfareProgram');
        }

        /* AGRICULTURE OFFICER */
        if (roles.includes(Role.AGRICULTURE_OFFICER)) {
            can(Actions.READ, 'Citizen');
            can(Actions.CREATE, 'AgricultureRecord');
            can(Actions.UPDATE, 'AgricultureRecord');
            can(Actions.READ, 'AgricultureRecord');
            can(Actions.REPORT, 'AgricultureRecord');
        }

        /* HEALTH OFFICER */
        if (roles.includes(Role.HEALTH_OFFICER)) {
            can(Actions.READ, 'Citizen');
            can(Actions.CREATE, 'HealthRecord');
            can(Actions.UPDATE, 'HealthRecord');
            can(Actions.READ, 'HealthRecord');
            can(Actions.REPORT, 'HealthRecord');
        }

        /* EDUCATION OFFICER */
        if (roles.includes(Role.EDUCATION_OFFICER)) {
            can(Actions.READ, 'Citizen');
            can(Actions.CREATE, 'EducationRecord');
            can(Actions.UPDATE, 'EducationRecord');
            can(Actions.READ, 'EducationRecord');
            can(Actions.REPORT, 'EducationRecord');
        }

        /* ANALYST */
        if (roles.includes(Role.ANALYST)) {
            can(Actions.READ, 'Citizen');
            can(Actions.READ, 'Household');
            can(Actions.REPORT, 'Citizen');
        }

        /* AUDITOR */
        if (roles.includes(Role.AUDITOR)) {
            can(Actions.READ, 'ActivityLog');
            can(Actions.READ, 'User');
        }

        /* CITIZEN */
        if (roles.includes(Role.CITIZEN)) {
            can(Actions.READ, 'Citizen', { id: user.sub });
            can(Actions.UPDATE, 'Citizen', { id: user.sub });
            can(Actions.READ, 'WelfareProgram');
        }

        return build();
    }
}