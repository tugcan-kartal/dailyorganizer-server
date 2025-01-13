import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TaskService } from 'src/task/task.service';
import { TaskModule } from 'src/task/task.module';

@Module({
    imports: [TaskModule],
    controllers: [ChatController],
    providers: [ChatService]
})

export class ChatModule {}
