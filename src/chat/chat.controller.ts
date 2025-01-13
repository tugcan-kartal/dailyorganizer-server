import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TaskService } from 'src/task/task.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('chat')
export class ChatController {
    constructor(
        private chatService: ChatService,
        private taskService: TaskService,
    ){}

    @Post("set-task")
    @UseGuards(AuthGuard())
    async setTaskContext(@Body('taskId') taskId: string,@Req() req){
        const userId=req.user._id;
        const task=await this.taskService.findById(taskId);

        if(!task){
            return {message: "Task bulunamadı!"};
        }

        return this.chatService.prepareTaskContext(userId, task);
    }

    @Post("send-message")
    @UseGuards(AuthGuard())
    async chat(@Body('message') message: string, @Req() req){
        const userId=req.user._id;
        return this.chatService.chatWithContext(userId, message);
    }
}
