import {IsDate, IsNotEmpty,IsString} from "class-validator";

export class CreateTaskDto{
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsString()
    readonly author: string;

    @IsNotEmpty()
    @IsString()
    readonly importance_level: string;

    @IsNotEmpty()
    @IsString()
    readonly category: string;

    @IsNotEmpty()
    @IsDate()
    readonly start_date: Date;

    @IsNotEmpty()
    @IsDate()
    readonly end_date: Date;
}