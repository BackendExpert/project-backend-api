import { Body, Controller, Post, Req, UseGuards, ForbiddenException } from "@nestjs/common";
import { HouseHoldService } from "./house-hold.service";
import { CreateHouseHoldDTO } from "./dtos/create-household.dto";
import { ClientInfoDecorator } from "src/common/decorators/client-info.decorator";
import type { ClientInfo } from "../common/interfaces/client-info.interface";
import { CheckPolicies } from "src/common/decorators/policies.decorator";
import { Actions } from "src/common/policies/casl-ability.factory";
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
        // const user = req.user;
        const user = (req as any).user.user;
        const ability = req.ability;

        // console.log("JWT user:", req.user, "UserEmail", req.user.email, (req as any).user.user);
        // console.log(dto.housing_type);
        if (!req.ability.can(Actions.CREATE, 'Household')) {
            throw new ForbiddenException("You do not have permission to create a household");
        }


        return this.householdService.CreateHouseHold(
            user,
            dto,
            client.ipAddress,
            client.userAgent
        );
    }
}