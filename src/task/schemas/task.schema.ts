import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


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

}

export const TaskSchema=SchemaFactory.createForClass(Task);