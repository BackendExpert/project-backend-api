import { SetMetadata } from "@nestjs/common";
import { Actions } from "../policies/actions.enum";

export const CHECK_POLICIES_KEY = "check_policy";

export const CheckPolicies = (action: Actions, subject: any) =>
    SetMetadata(CHECK_POLICIES_KEY, { action, subject });