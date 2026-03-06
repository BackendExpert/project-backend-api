import { Actions } from './actions.enum';

export const RolePermissions: Record<string, { action: Actions, subject: string }[]> = {
    SUPER_ADMIN: [
        { action: Actions.MANAGE, subject: 'all' }
    ],

    SYSTEM_ADMIN: [
        { action: Actions.MANAGE, subject: 'User' },
        { action: Actions.READ, subject: 'ActivityLog' },
        { action: Actions.READ, subject: 'Citizen' },
        { action: Actions.READ, subject: 'Household' }
    ],

    DATA_ENTRY_OFFICER: [
        { action: Actions.CREATE, subject: 'Citizen' },
        { action: Actions.UPDATE, subject: 'Citizen' },
        { action: Actions.READ, subject: 'Citizen' },
        { action: Actions.CREATE, subject: 'Household' },
        { action: Actions.UPDATE, subject: 'Household' },
        { action: Actions.READ, subject: 'Household' },
        { action: Actions.CREATE, subject: 'EducationRecord' },
        { action: Actions.CREATE, subject: 'EmploymentRecord' },
        { action: Actions.CREATE, subject: 'HealthRecord' }
    ],

    DATA_MANAGER: [
        { action: Actions.READ, subject: 'Citizen' },
        { action: Actions.UPDATE, subject: 'Citizen' },
        { action: Actions.VERIFY, subject: 'Citizen' },
        { action: Actions.APPROVE, subject: 'Citizen' },
        { action: Actions.REPORT, subject: 'Citizen' }
    ],

    VILLAGE_OFFICER: [
        { action: Actions.READ, subject: 'Citizen' },
        { action: Actions.READ, subject: 'Household' },
        { action: Actions.READ, subject: 'VillageAsset' },
        { action: Actions.REPORT, subject: 'Citizen' }
    ],

    WELFARE_OFFICER: [
        { action: Actions.READ, subject: 'Citizen' },
        { action: Actions.CREATE, subject: 'WelfareProgram' },
        { action: Actions.UPDATE, subject: 'WelfareProgram' },
        { action: Actions.APPROVE, subject: 'WelfareProgram' },
        { action: Actions.REPORT, subject: 'WelfareProgram' }
    ],

    AGRICULTURE_OFFICER: [
        { action: Actions.READ, subject: 'Citizen' },
        { action: Actions.CREATE, subject: 'AgricultureRecord' },
        { action: Actions.UPDATE, subject: 'AgricultureRecord' },
        { action: Actions.READ, subject: 'AgricultureRecord' },
        { action: Actions.REPORT, subject: 'AgricultureRecord' }
    ],

    HEALTH_OFFICER: [
        { action: Actions.READ, subject: 'Citizen' },
        { action: Actions.CREATE, subject: 'HealthRecord' },
        { action: Actions.UPDATE, subject: 'HealthRecord' },
        { action: Actions.READ, subject: 'HealthRecord' },
        { action: Actions.REPORT, subject: 'HealthRecord' }
    ],

    EDUCATION_OFFICER: [
        { action: Actions.READ, subject: 'Citizen' },
        { action: Actions.CREATE, subject: 'EducationRecord' },
        { action: Actions.UPDATE, subject: 'EducationRecord' },
        { action: Actions.READ, subject: 'EducationRecord' },
        { action: Actions.REPORT, subject: 'EducationRecord' }
    ],

    ANALYST: [
        { action: Actions.READ, subject: 'Citizen' },
        { action: Actions.READ, subject: 'Household' },
        { action: Actions.REPORT, subject: 'Citizen' }
    ],

    AUDITOR: [
        { action: Actions.READ, subject: 'ActivityLog' },
        { action: Actions.READ, subject: 'User' }
    ],

    CITIZEN: [
        { action: Actions.READ, subject: 'WelfareProgram' }
    ]
};