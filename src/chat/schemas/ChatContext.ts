import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Task } from "src/task/schemas/task.schema";
import { User } from "src/auth/schemas/user.schema";

@Schema({ timestamps: true })
export class ChatContext extends Document {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  taskId: string;

  @Prop({ type: Object, required: true })
  taskDetails: Partial<Task>;
}

export const ChatContextSchema = SchemaFactory.createForClass(ChatContext);
