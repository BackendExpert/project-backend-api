import { AbilityBuilder, Ability } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export type Actions =
    | 'manage'
    | 'create'
    | 'read'
    | 'update'
    | 'delete'
    | 'approve'
    | 'verify'
    | 'report';

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
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(
            Ability as any,
        );

        const roles = user.roles || [];

        /* SUPER ADMIN */
        if (roles.includes(Role.SUPER_ADMIN)) {
            can('manage', 'all');
        }

        /* SYSTEM ADMIN */
        if (roles.includes(Role.SYSTEM_ADMIN)) {
            can('manage', 'User');
            can('read', 'ActivityLog');
            can('read', 'Citizen');
            can('read', 'Household');
        }

        /* DATA ENTRY OFFICER */
        if (roles.includes(Role.DATA_ENTRY_OFFICER)) {
            can('create', 'Citizen');
            can('update', 'Citizen');
            can('read', 'Citizen');

            can('create', 'Household');
            can('update', 'Household');
            can('read', 'Household');

            can('create', 'EducationRecord');
            can('create', 'EmploymentRecord');
            can('create', 'HealthRecord');

            cannot('delete', 'Citizen');
        }

        /* DATA MANAGER */
        if (roles.includes(Role.DATA_MANAGER)) {
            can('read', 'Citizen');
            can('update', 'Citizen');
            can('verify', 'Citizen');
            can('approve', 'Citizen');
            can('report', 'Citizen');
        }

        /* VILLAGE OFFICER */
        if (roles.includes(Role.VILLAGE_OFFICER)) {
            can('read', 'Citizen');
            can('read', 'Household');
            can('read', 'VillageAsset');
            can('report', 'Citizen');
        }

        /* WELFARE OFFICER */
        if (roles.includes(Role.WELFARE_OFFICER)) {
            can('read', 'Citizen');
            can('create', 'WelfareProgram');
            can('update', 'WelfareProgram');
            can('approve', 'WelfareProgram');
            can('report', 'WelfareProgram');
        }

        /* AGRICULTURE OFFICER */
        if (roles.includes(Role.AGRICULTURE_OFFICER)) {
            can('read', 'Citizen');
            can('create', 'AgricultureRecord');
            can('update', 'AgricultureRecord');
            can('read', 'AgricultureRecord');
            can('report', 'AgricultureRecord');
        }

        /* HEALTH OFFICER */
        if (roles.includes(Role.HEALTH_OFFICER)) {
            can('read', 'Citizen');
            can('create', 'HealthRecord');
            can('update', 'HealthRecord');
            can('read', 'HealthRecord');
            can('report', 'HealthRecord');
        }

        /* EDUCATION OFFICER */
        if (roles.includes(Role.EDUCATION_OFFICER)) {
            can('read', 'Citizen');
            can('create', 'EducationRecord');
            can('update', 'EducationRecord');
            can('read', 'EducationRecord');
            can('report', 'EducationRecord');
        }

        /* ANALYST */
        if (roles.includes(Role.ANALYST)) {
            can('read', 'Citizen');
            can('read', 'Household');
            can('report', 'Citizen');
        }

        /* AUDITOR */
        if (roles.includes(Role.AUDITOR)) {
            can('read', 'ActivityLog');
            can('read', 'User');
        }

        /* CITIZEN */
        if (roles.includes(Role.CITIZEN)) {
            can('read', 'Citizen', { id: user.sub });
            can('update', 'Citizen', { id: user.sub });
            can('read', 'WelfareProgram');
        }

        return build();
    }
}