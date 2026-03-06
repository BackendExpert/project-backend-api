import { Inject, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HouseHold, HouseHoldSchema } from "./schema/house-hold.schema";
import { User, UserSchema } from "src/user/schema/user.schema";
import { AuditLog, AuditLogSchema } from "src/auditlogs/schema/auditlog.schema";
import { HouseHoldController } from "./house-hold.controller";
import { HouseHoldService } from "./house-hold.service";
import { CaslAbilityFactory } from "src/common/policies/casl-ability.factory";
import { PoliciesGuard } from "src/common/policies/policies.guard";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: HouseHold.name, schema: HouseHoldSchema },
            { name: User.name, schema: UserSchema },
            { name: AuditLog.name, schema: AuditLogSchema },
        ])
    ],
    controllers: [HouseHoldController],
    providers: [
        HouseHoldService,
        CaslAbilityFactory,
        PoliciesGuard,
        JwtService
    ],
    exports: [HouseHoldService]
})

export class HouseHoldModule {}