import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class SignUpDto{
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail({},{message: "Please enter correct email"})
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6,{message: "Password must be at least 6 characters long"})
    readonly password: string;

    @IsOptional()
    readonly role: string[];
   
}