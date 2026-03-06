import { Body, Controller, Headers, Post, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RequestOTPDTO } from "./dtos/request-otp.dto";
import { VerifyOTPDTO } from "./dtos/verify-otp.dto";

@Controller('auth')
export class authController {
    constructor(private readonly authService: AuthService) { }

    @Post('request-otp')
    requestOTP(@Body() dto: RequestOTPDTO) {
        return this.authService.ReqeustOTP(dto.email)
    }

    @Post('verify-otp')
    verifyOTP(
        @Body() dto: VerifyOTPDTO,
        @Headers('authorization') authHeader: string
    ) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException("Invalid or missing token")
        }
        const token = authHeader.split(' ')[1];

        return this.authService.VerifyOTP(token, dto.otp)
    }
}

