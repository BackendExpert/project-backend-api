import {
    IsString,
    IsNumber,
    IsBoolean,
    IsOptional,
    IsNotEmpty
} from "class-validator";

export class CreateHouseHoldDTO {
    @IsString()
    @IsNotEmpty()
    house_number: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    village: string;

    @IsString()
    @IsNotEmpty()
    head_of_household: string;

    @IsNumber()
    member_count: number;

    @IsString()
    @IsNotEmpty()
    income_level: string;

    @IsBoolean()
    land_ownership: boolean;

    @IsString()
    @IsNotEmpty()
    water_source: string;

    @IsBoolean()
    electricity_available: boolean;

    @IsString()
    @IsNotEmpty()
    sanitation_type: string;

    @IsString()
    @IsNotEmpty()
    housing_type: string;

    @IsString()
    gps_location: string;
}