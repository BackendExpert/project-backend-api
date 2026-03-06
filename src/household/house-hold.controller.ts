import { Body, Controller, Headers, Post, UnauthorizedException, UseGuards } from "@nestjs/common";
import { HouseHoldService } from "./house-hold.service";
import { CreateHouseHoldDTO } from "./dtos/create-household.dto";
import { ClientInfoDecorator } from "src/common/decorators/client-info.decorator";
import type { ClientInfo } from "../common/interfaces/client-info.interface";
import { CheckPolicies } from "src/common/decorators/policies.decorator";
import { Actions } from "../common/policies/casl-ability.factory";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { PoliciesGuard } from "src/common/policies/policies.guard";

@Controller("house-hold")
@UseGuards(JwtAuthGuard, PoliciesGuard)

export class HouseHoldController {
    constructor(private readonly householdService: HouseHoldService) { }

    @Post('create')
    @CheckPolicies(Actions.CREATE, 'Household')
    CreateHouseHold(
        @Body() dto: CreateHouseHoldDTO,
        @Headers('authorization') authHeader: string,
        @ClientInfoDecorator() client: ClientInfo
    ) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(' ')[1];

        return this.householdService.CreateHouseHold(
            token,
            dto.house_number,
            dto.address,
            dto.village,
            dto.head_of_household,
            dto.member_count,
            dto.income_level,
            dto.land_ownership,
            dto.water_source,
            dto.electricity_available,
            dto.sanitation_type,
            dto.gps_location,
            client.ipAddress,
            client.userAgent,
        )
    }
}