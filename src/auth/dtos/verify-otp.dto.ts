import { IsEmail, IsString, Length } from "class-validator";

export class VerifyDTO {
    @IsString()
    @Length(8)
    otp: string;
}