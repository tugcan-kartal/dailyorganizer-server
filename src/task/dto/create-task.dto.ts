import { Transform } from "class-transformer";
import {IsDate, IsEmpty, IsNotEmpty,IsNumber,IsOptional,IsString} from "class-validator";
import { User } from "../../auth/schemas/user.schema";

export class CreateTaskDto{
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsString()
    readonly importance_level: string;

    @IsNotEmpty()
    @IsString()
    readonly category: string;

    @Transform(({ value }) => new Date(value))
    @IsNotEmpty()
    @IsDate()
    readonly start_date: Date;

    @Transform(({ value }) => new Date(value))
    @IsNotEmpty()
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