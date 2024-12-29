import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {Query as ExpressQuery} from "express-serve-static-core";

@Controller('task')
export class TaskController {
    constructor (private taskService: TaskService ){}

    @Get()
    async getAllTasks(@Query() query: ExpressQuery): Promise<Task[]>{
        return this.taskService.findAll(query);
    }

    @Post()
    async createTask(
        @Body()
        task: CreateTaskDto,
    ): Promise<Task>{
        return this.taskService.create(task)
    }

    @Get(':id')
    async getTask(
        @Param('id')
        id: string
    ): Promise<Task>{
        return this.taskService.findById(id);
    }

    @Put(":id")
    async updateBook(
        @Param('id')
        id: string,
        @Body()
        task: UpdateTaskDto,
    ): Promise<Task>{
        return this.taskService.updateById(id,task);
    }

    @Delete(':id')
    async deleteTask(
        @Param('id')
        id: string
    ): Promise<Task>{
        return this.taskService.deleteById(id);
    }
}
