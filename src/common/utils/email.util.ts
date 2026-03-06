import nodemailer, { Transporter } from "nodemailer";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
    private transporter: Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: this.configService.get<string>("EMAIL_USER"),
                pass: this.configService.get<string>("EMAIL_PASSWORD")
            },
        });
    }

    async sendOTP(email: string, otp: string): Promise<void> {
        await this.transporter.sendMail({
            from: `"Nest Auth" <${this.configService.get<string>("EMAIL_USER")}>`,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is ${otp}. It expires in 5 minutes.`,
            html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Your OTP Code</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This code expires in 5 minutes.</p>
        </div>
      `,
        });
    }

    async NotificationEmail(email: string, notification: string): Promise<void> {
        await this.transporter.sendMail({
            from: `"Nest Auth" <${this.configService.get<string>("EMAIL_USER")}>`,
            to: email,
            subject: "Your OTP Code",
            text: `${this.configService.get<string>("PROJECT_NAME")} - ${notification}`,
            html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>THis is Notication from</h2>
          <p>${process.env.PROJECT_NAME}</p>
          <h1 style="letter-spacing: 4px;">${notification}</h1>
        </div>
      `,
        });
    }
}

