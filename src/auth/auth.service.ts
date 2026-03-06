import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/user/schema/user.schema";
import { OTP, OTPDocument } from "./schema/otp.schema";
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "src/common/utils/email.util";
import { generateOTP } from "src/common/utils/otp.util";
import bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,

        @InjectModel(OTP.name)
        private otpModel: Model<OTPDocument>,

        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    async ReqeustOTP(email: string) {
        let checkotp = await this.otpModel.findOne({ email })

        if (checkotp) {
            throw new ConflictException("OTP already Sent, check Email...")
        }

        const otp: string = generateOTP(8);
        const expireOTP = new Date(Date.now() + 5 * 60 * 1000)

        const hashotp = await bcrypt.hash(otp, 10)

        const otpRecord = new this.otpModel({
            email,
            otp: hashotp,
            expireAt: expireOTP,
        });
        await otpRecord.save();

        let user = await this.userModel.findOne({ email })

        if (!user) {
            user = new this.userModel({ email })
            await user.save()
            await this.emailService.sendOTP(user.email, otp)

            const token = this.jwtService.sign(
                { sub: user._id, email, type: "OTP_TOKEN" },
                { expiresIn: '5m' }
            );

            return ({ success: true, message: "Registation Success, OTP send to Email...", token: token })
        }
        else {
            await this.emailService.sendOTP(user.email, otp)

            const token = this.jwtService.sign(
                { sub: user._id, email, type: "OTP_TOKEN" },
                { expiresIn: '5m' }
            );

            return ({ success: true, message: "Welcome Back, OTP send to Email...", token: token })
        }
    }

    async VerifyOTP(token: string, otp: string) {

    }
}