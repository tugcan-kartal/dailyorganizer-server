import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  // @SkipThrottle()
  // @Throttle({default: {limit: 3, ttl: 2000}});
  @Get()
  // @Roles(Role.Moderator,Role.Admin)
  @UseGuards(AuthGuard())
  async getAllTasks(@Query() query: ExpressQuery, @Req() req): Promise<Task[]> {
    const userId = req.user._id;
    return this.taskService.findAll({ ...query, user: userId });
  }

  @Post()
  @UseGuards(AuthGuard())
  async createTask(
    @Body()
    task: CreateTaskDto,
    @Req() req,
  ): Promise<Task> {
    return this.taskService.create(task, req.user);
  }

  @Get(':id')
  async getTask(
    @Param('id')
    id: string,
  ): Promise<Task> {
    return this.taskService.findById(id);
  }

  @Put(':id')
  async updateTask(
    @Param('id')
    id: string,
    @Body()
    task: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.updateById(id, task);
  }

  @Post('update-order')
  @UseGuards(AuthGuard())
  async updateOrder(@Body() body: { tasks: { _id: string; order: number }[] }) {
    const { tasks } = body;
    for (const task of tasks) {
      await this.taskService.updateOrder(task._id, task.order);
    }
    return { message: 'Order updated successfully' };
  }

  @Delete(':id')
  async deleteTask(
    @Param('id')
    id: string,
  ): Promise<Task> {
    return this.taskService.deleteById(id);
  }
}
