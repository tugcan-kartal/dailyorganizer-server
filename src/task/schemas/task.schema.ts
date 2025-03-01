import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "../../auth/schemas/user.schema";


@Schema({
    timestamps: true
})

export class Task{

    _id?: mongoose.Types.ObjectId; // _id alanını ekledik

    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    importance_level: string;

    @Prop()
    category: string;

    @Prop()
    images?: object[]

    @Prop()
    start_date: Date;

    @Prop()
    end_date: Date;

    @Prop({default: 0})
    order: number;

    @Prop({default: "process"})
    status: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user: User;

}

export const TaskSchema=SchemaFactory.createForClass(Task);