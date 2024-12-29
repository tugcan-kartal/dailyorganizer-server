import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "../../auth/schemas/user.schema";


@Schema({
    timestamps: true
})

export class Task{

    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    author: string;

    @Prop()
    importance_level: string;

    @Prop()
    category: string;

    @Prop()
    start_date: Date;

    @Prop()
    end_date: Date;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user: User;

}

export const TaskSchema=SchemaFactory.createForClass(Task);