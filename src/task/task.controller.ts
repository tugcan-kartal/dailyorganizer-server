import { Body, Controller, Get, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './schemas/task.schema';

@Controller('task')
export class TaskController {
    constructor (private taskService: TaskService ){}

    @Get()
    async getAllTasks(): Promise<Task[]>{
        return this.taskService.findAll();
    }

    @Post()
    async createTask(
        @Body()
        book,
    ): Promise<Task>{
        return this.taskService.create(book)
    }
}
