import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/user/schema/user.schema";
import { OTP, OTPDocument } from "./schema/otp.schema";
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "src/common/utils/email.util";
import { generateOTP } from "src/common/utils/otp.util";
import bcrypt from 'bcrypt';
import { createAuditLog } from "src/common/utils/auditlogs.util";
import { AuditLog, AuditLogDocument } from "src/auditlogs/schema/auditlog.schema";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,

        @InjectModel(OTP.name)
        private otpModel: Model<OTPDocument>,

        @InjectModel(AuditLog.name)
        private auditLogModel: Model<AuditLogDocument>,

        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    async RequestOTP(email: string, ipAddress?: string, userAgent?: string) {
        const existingOTP = await this.otpModel.findOne({ email });

        if (existingOTP) {
            throw new ConflictException("OTP already sent, check your email...");
        }

        const otp = generateOTP(8);
        const expireOTP = new Date(Date.now() + 5 * 60 * 1000);
        const hashedOTP = await bcrypt.hash(otp, 10);

        await this.otpModel.create({
            email,
            otp: hashedOTP,
            expireAt: expireOTP,
        });

        let user = await this.userModel.findOne({ email });

        if (!user) {
            user = await this.userModel.create({ email });
            await this.emailService.sendOTP(user.email, otp);

            const token = this.jwtService.sign(
                { sub: user._id, email, type: "OTP_TOKEN" },
                { expiresIn: '5m' }
            );

            // Audit log for new registration OTP
            await createAuditLog(this.auditLogModel, {
                user: user._id,
                action: "REGISTER_OTP_SENT",
                description: `Registration OTP sent to ${user.email}`,
                ipAddress,
                userAgent,
                metadata: { ipAddress, userAgent }
            });

            return { success: true, message: "Registration successful, OTP sent to email", token };
        } else {
            // await this.emailService.sendOTP(user.email, otp);
            await this.emailService.sendOTP(user.email, otp, ipAddress, userAgent);

            const token = this.jwtService.sign(
                { sub: user._id, email, type: "OTP_TOKEN" },
                { expiresIn: '5m' }
            );

            // Audit log for login OTP
            await createAuditLog(this.auditLogModel, {
                user: user._id,
                action: "LOGIN_OTP_SENT",
                description: `Login OTP sent to ${user.email}`,
                ipAddress,
                userAgent,
                metadata: { ipAddress, userAgent }
            });

            return { success: true, message: "Welcome back, OTP sent to email", token };
        }
    }

    async VerifyOTP(token: string, otp: string, ipAddress?: string, userAgent?: string) {
        const payload = this.jwtService.verify(token);

        if (payload.type !== "OTP_TOKEN") {
            throw new UnauthorizedException("Token type mismatch");
        }

        const otpRecord = await this.otpModel.findOne({ email: payload.email });
        if (!otpRecord) {
            throw new NotFoundException("OTP record not found, try again");
        }

        const user = await this.userModel.findOne({ email: payload.email });
        if (!user) {
            throw new NotFoundException("User not found");
        }

        const isOTPValid = await bcrypt.compare(otp, otpRecord.otp);
        if (!isOTPValid) {
            await createAuditLog(this.auditLogModel, {
                user: user?._id,
                action: "LOGIN_FAILD - WRONG_OTP",
                description: `Login Faild with Wrong OTP`,
                ipAddress,
                userAgent,
                metadata: { ipAddress, userAgent }
            });
            throw new UnauthorizedException("OTP does not match");
        }

        user.last_login = new Date();
        await user.save();

        const loginToken = this.jwtService.sign({
            sub: user?._id,
            user: user?.email,
            role: user?.role,
            type: "LOGIN_TOKEN"
        });

        // await this.emailService.NotificationEmail(user?.email || '', "Login Success");
        await this.emailService.NotificationEmail(user?.email || '', "Login Success", ipAddress, userAgent);
        await this.otpModel.deleteOne({ email: payload.email });

        // Audit log for successful login
        await createAuditLog(this.auditLogModel, {
            user: user?._id,
            action: "LOGIN_SUCCESS",
            description: `User logged in successfully`,
            ipAddress,
            userAgent,
            metadata: { ipAddress, userAgent }
        });



        return { success: true, message: "Login successful", token: loginToken };
    }
}