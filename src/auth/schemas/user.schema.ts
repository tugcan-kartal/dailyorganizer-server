import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Role } from "../enums/role.enum";
@Schema({
    timestamps: true
})

export class User extends Document{
    @Prop()
    name: string

    @Prop({unique: [true,'Duplicate email entered']})
    email: string

    //Google kullanıcıları password girmek zorunda değil o yüzden ? işareti var
    @Prop()
    password?: string

    @Prop({
        type: [{type: String,enum: Role}],
        default: [Role.User],
    })
    role: Role[];

    @Prop({ unique: true, sparse: true }) // Google kullanıcıları için Google ID
    googleId?: string;

    @Prop({ default: 'local' }) // Kimlik doğrulama sağlayıcısı (local/google)
    provider: string;
}

export const UserSchema=SchemaFactory.createForClass(User);