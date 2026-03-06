import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { HouseHold, HouseHoldDocument } from "./schema/house-hold.schema";
import { Model } from "mongoose";
import { AuditLog, AuditLogDocument } from "src/auditlogs/schema/auditlog.schema";
import { createAuditLog } from "src/common/utils/auditlogs.util";
import { JwtService } from "@nestjs/jwt";
import { User, UserDocument } from "src/user/schema/user.schema";
import { CreateHouseHoldDTO } from "./dtos/create-household.dto";


@Injectable()
export class HouseHoldService {
    constructor(
        @InjectModel(HouseHold.name)
        private householdModel: Model<HouseHoldDocument>,

        @InjectModel(AuditLog.name)
        private auditlogModel: Model<AuditLogDocument>,

        @InjectModel(User.name)
        private userModel: Model<UserDocument>,

        private jwtService: JwtService,
    ) { }


    async CreateHouseHold(
        email: string,
        dto: CreateHouseHoldDTO,
        ipAddress: string,
        userAgent: string
    ) {
        const user = await this.userModel.findOne({ email });
        if (!user) throw new NotFoundException("User Not Found");

        const checkhouse = await this.householdModel.findOne({ house_number: dto.house_number });
        if (checkhouse) throw new ConflictException("The House is Already Registered");

        const house = await this.householdModel.create({
            house_number: dto.house_number,
            address: dto.address,
            village: dto.village,
            head_of_household: dto.head_of_household,
            member_count: dto.member_count,
            income_level: dto.income_level,
            land_ownership: dto.land_ownership,
            water_source: dto.water_source,
            electricity_available: dto.electricity_available,
            sanitation_type: dto.sanitation_type,
            housing_type: dto.housing_type,
            gps_location: dto.gps_location
        });

        await createAuditLog(this.auditlogModel, {
            user: user._id,
            action: "HOUSE_REGISTERED",
            description: `House ${dto.house_number} registered by ${user.email}`,
            ipAddress,
            userAgent,
            metadata: { ipAddress, userAgent }
        });

        return { success: true, message: "House registered successfully" };
    }
}