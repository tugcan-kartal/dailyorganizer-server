import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./schemas/user.schema";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService, // JWT Servisi Enjekte Edildi
    ) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { id, displayName, emails } = profile;

        // Kullanıcıyı bul veya oluştur
        let user = await this.userModel.findOne({ googleId: id });

        if (!user) {
            user = await this.userModel.create({
                googleId: id,
                name: displayName,
                email: emails[0].value,
                provider: 'google',
            });
        }

        if (!user) {
            throw new UnauthorizedException('Google authentication failed.');
        }

        // Kullanıcı için JWT token oluştur
        const token = this.jwtService.sign({ id: user._id });

        done(null, { user, token }); // Token ve kullanıcı döndürülüyor
    }
}
