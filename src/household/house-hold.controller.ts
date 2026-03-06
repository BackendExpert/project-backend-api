import { Body, Controller, Post, Req, UseGuards, ForbiddenException } from "@nestjs/common";
import { HouseHoldService } from "./house-hold.service";
import { CreateHouseHoldDTO } from "./dtos/create-household.dto";
import { ClientInfoDecorator } from "src/common/decorators/client-info.decorator";
import type { ClientInfo } from "../common/interfaces/client-info.interface";
import { CheckPolicies } from "src/common/decorators/policies.decorator";
import { Actions } from "../common/policies/actions.enum";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { PoliciesGuard } from "src/common/policies/policies.guard";
import type { AuthRequest } from '../common/interfaces/auth-request.interface';

@Controller("house-hold")
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class HouseHoldController {

    constructor(private readonly householdService: HouseHoldService) { }

    @Post('create')
    @CheckPolicies(Actions.CREATE, 'Household')
    CreateHouseHold(
        @Body() dto: CreateHouseHoldDTO,
        @Req() req: AuthRequest,
        @ClientInfoDecorator() client: ClientInfo
    ) {

        // const user = req.user.user;
        const user = req.user;

        return this.householdService.CreateHouseHold(
            user.email,
            dto,
            client.ipAddress,
            client.userAgent
        );

    }
}