import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskModule } from 'src/task/task.module';  // Burada TaskModule'u import ediyoruz
import { ChatContext, ChatContextSchema } from './schemas/ChatContext';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'ChatContext', schema: ChatContextSchema }]),
    TaskModule,  // Burada TaskModule'u import ediyoruz
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
