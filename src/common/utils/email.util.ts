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

    async sendOTP(email: string, otp: string, ipAddress?: string, userAgent?: string): Promise<void> {
        const projectName = this.configService.get<string>("PROJECT_NAME");

        await this.transporter.sendMail({
            from: `"${projectName}" <${this.configService.get<string>("EMAIL_USER")}>`,
            to: email,
            subject: `${projectName} - Your OTP Code`,
            text: `Your OTP is ${otp}. It expires in 5 minutes. Requested from IP: ${ipAddress}, Device: ${userAgent}`,
            html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background: #4f46e5; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">${projectName}</h1>
          </div>
          <div style="padding: 30px; text-align: center; background: #f9fafb;">
            <h2 style="color: #111827;">Your OTP Code</h2>
            <p style="color: #6b7280;">Enter the following code to complete your action:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #4f46e5; margin: 20px 0;">${otp}</div>
            <p style="color: #ef4444; font-weight: bold;">This code expires in 5 minutes.</p>
            <hr style="margin: 20px 0; border-color: #e5e7eb;" />
            <p style="font-size: 12px; color: #6b7280;">Request info:</p>
            <p style="font-size: 12px; color: #6b7280;">IP Address: ${ipAddress || "N/A"}</p>
            <p style="font-size: 12px; color: #6b7280;">Device / Browser: ${userAgent || "N/A"}</p>
          </div>
          <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af;">
            © ${new Date().getFullYear()} ${projectName}. All rights reserved.
          </div>
        </div>
      `,
        });
    }


    async NotificationEmail(email: string, notification: string, ipAddress?: string, userAgent?: string): Promise<void> {
        const projectName = this.configService.get<string>("PROJECT_NAME");

        await this.transporter.sendMail({
            from: `"${projectName}" <${this.configService.get<string>("EMAIL_USER")}>`,
            to: email,
            subject: `${projectName} - Notification`,
            text: `${projectName} - ${notification}. IP: ${ipAddress}, Device: ${userAgent}`,
            html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background: #10b981; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">${projectName}</h1>
          </div>
          <div style="padding: 30px; text-align: center; background: #f9fafb;">
            <h2 style="color: #111827;">Notification</h2>
            <p style="font-size: 16px; color: #6b7280;">You have a new update from ${projectName}:</p>
            <div style="font-size: 28px; font-weight: bold; color: #10b981; margin: 20px 0;">${notification}</div>
            <hr style="margin: 20px 0; border-color: #e5e7eb;" />
            <p style="font-size: 12px; color: #6b7280;">Request info:</p>
            <p style="font-size: 12px; color: #6b7280;">IP Address: ${ipAddress || "N/A"}</p>
            <p style="font-size: 12px; color: #6b7280;">Device / Browser: ${userAgent || "N/A"}</p>
          </div>
          <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af;">
            © ${new Date().getFullYear()} ${projectName}. All rights reserved.
          </div>
        </div>
      `,
        });
    }
}

