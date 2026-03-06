import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type HouseHoldDocument = HouseHold & Document;

@Schema({ timestamps: true })
export class HouseHold {
    @Prop({ required: true })
    house_number: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    village: string;

    @Prop({ required: true })
    head_of_household: string;

    @Prop({ required: true })
    member_count: number;

    @Prop({ required: true })
    income_level: string;

    @Prop({ required: true })
    land_ownership: boolean;

    @Prop({ required: true })
    water_source: string;

    @Prop({ required: true })
    electricity_available: boolean;

    @Prop({ required: true })
    sanitation_type: string;

    @Prop({ required: true })
    housing_type: string;

    @Prop()
    gps_location: string;
}

export const HouseHoldSchema = SchemaFactory.createForClass(HouseHold);