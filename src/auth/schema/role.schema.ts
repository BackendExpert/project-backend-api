import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserRoleDocument = UserRole & Document

@Schema({ timestamps: true })
export class UserRole {
    @Prop({ required: true })
    role_name: string

    @Prop({ required: true })
    role_permissions: [string]
}   

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);