import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ChatContext extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  taskId: string;

  @Prop({ type: Object })
  taskDetails: any;

  @Prop({ type: [{ message: String, timestamp: Date }], default: [] })
  messages: { message: string; timestamp: Date }[];
}

export const ChatContextSchema = SchemaFactory.createForClass(ChatContext);
