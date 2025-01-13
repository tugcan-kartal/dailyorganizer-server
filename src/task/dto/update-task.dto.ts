import { Transform } from "class-transformer";
import { IsDate, IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { User } from "../../auth/schemas/user.schema";
import mongoose from "mongoose";


export class UpdateTaskDto{
        @IsOptional()
        readonly _id?: mongoose.Types.ObjectId; // _id alanını ekledik

        @IsOptional()
        @IsString()
        readonly title: string;
    
        @IsOptional()
        @IsString()
        readonly description: string;
    
        @IsOptional()
        @IsString()
        readonly importance_level: string;
    
        @IsOptional()
        @IsString()
        readonly category: string;
    
        @Transform(({ value }) => new Date(value))
        @IsOptional()
        @IsDate()
        readonly start_date: Date;
    
        @Transform(({ value }) => new Date(value))
        @IsOptional()
        @IsDate()
        readonly end_date: Date;

        @IsNumber()
        @IsOptional()
        readonly order: number;

        @IsOptional()
        images?: object[];

        @IsEmpty({message: "You cannot pass user id"})
        readonly user: User
}