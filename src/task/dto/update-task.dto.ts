import { Transform } from "class-transformer";
import { IsDate, IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { User } from "../../auth/schemas/user.schema";


export class UpdateTaskDto{
        @IsOptional()
        @IsString()
        readonly title: string;
    
        @IsOptional()
        @IsString()
        readonly description: string;
    
        @IsOptional()
        @IsString()
        readonly author: string;
    
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

        @IsEmpty({message: "You cannot pass user id"})
        readonly user: User
}