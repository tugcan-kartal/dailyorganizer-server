import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";


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
    
        @IsOptional()
        @IsDate()
        readonly start_date: Date;
    
        @IsOptional()
        @IsDate()
        readonly end_date: Date;
}