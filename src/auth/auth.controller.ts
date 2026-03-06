import { Body, Controller, Headers, Post, Req, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RequestOTPDTO } from "./dtos/request-otp.dto";
import { VerifyOTPDTO } from "./dtos/verify-otp.dto";
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('request-otp')
    requestOTP(@Body() dto: RequestOTPDTO, @Req() req: Request) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'] || '';
        return this.authService.RequestOTP(dto.email, ipAddress, userAgent);
    }

    @Post('verify-otp')
    verifyOTP(
        @Body() dto: VerifyOTPDTO,
        @Headers('authorization') authHeader: string,
        @Req() req: Request
    ) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException("Invalid or missing token");
        }
        const token = authHeader.split(' ')[1];
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'] || '';
        return this.authService.VerifyOTP(token, dto.otp, ipAddress, userAgent);
    }
}