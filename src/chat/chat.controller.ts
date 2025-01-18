import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TaskService } from 'src/task/task.service'; // TaskService'i import ediyoruz
import { AuthGuard } from '@nestjs/passport';

@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
        private readonly taskService: TaskService, // TaskService'i enjekte ediyoruz
    ) {}

    @Post('set-task')
    @UseGuards(AuthGuard('jwt'))
    async setTaskContext(@Body('taskId') taskId: string, @Req() req) {
        const userId = req.user._id;

        // taskService'yi kullanarak task verisini alıyoruz
        const task = await this.taskService.findById(taskId);
        if (!task) {
            return 'Task bulunamadı.';
        }

        const contextMessage = await this.chatService.prepareTaskContext(userId, task);

        // Return JSON response
        return { message: contextMessage };
    }

    @Post('send-message')
    @UseGuards(AuthGuard('jwt'))
    async chat(@Body('message') message: string, @Req() req) {
        const userId = req.user._id;
        const contextMessage=await this.chatService.chatWithContext(userId, message);
        
        return {message: contextMessage};
    }

    @Get('history/:taskId')
    @UseGuards(AuthGuard('jwt'))
    async getHistory(@Req() req, @Param('taskId') taskId: string) {
        const userId = req.user._id;
        const context = await this.chatService.getChatHistory(userId, taskId);

        if (!context.length) {
            return { messages: [] };
        }

        return { messages: context };
    }

}
