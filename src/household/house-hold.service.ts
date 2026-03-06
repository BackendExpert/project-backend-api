import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { HouseHold, HouseHoldDocument } from "./schema/house-hold.schema";
import { Model } from "mongoose";
import { AuditLog, AuditLogDocument } from "src/auditlogs/schema/auditlog.schema";
import { createAuditLog } from "src/common/utils/auditlogs.util";
import { JwtService } from "@nestjs/jwt";
import { User, UserDocument } from "src/user/schema/user.schema";

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
        token: string,
        house_number: string,
        address: string,
        village: string,
        head_of_household: string,
        member_count: number,
        income_level: string,
        land_ownership: boolean,
        water_source: string,
        electricity_available: boolean,
        sanitation_type: string,
        gps_location: string,
        ipAddress: string,
        userAgent: string,
    ) {
        const payload = this.jwtService.verify(token)

        const user = await this.userModel.findOne({ email: payload.email })

        if(!user){
            throw new NotFoundException("User Not Found")
        }

        const checkhouse = await this.householdModel.findOne({ house_number: house_number })

        if (checkhouse) {
            throw new ConflictException("The House is Already Registed")
        }

        await this.householdModel.create({
            house_number,
            address,
            village,
            head_of_household,
            member_count,
            income_level,
            land_ownership,
            water_source,
            electricity_available,
            sanitation_type,
            gps_location,
        })


        await createAuditLog(this.auditlogModel, {
            user: user._id,
            action: "HOUSE_REGISTED",
            description: `The House ${house_number} Registed at System Successful by, ${user.email}`,
            ipAddress,
            userAgent,
            metadata: { ipAddress, userAgent }
        });

        return {
            success: true,
            message: "THe House Is Registatd Successfully"
        }

    }
}