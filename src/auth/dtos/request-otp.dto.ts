import { IsEmail } from "class-validator";

export class RequestDTO {
    @IsEmail()
    email: string;
}