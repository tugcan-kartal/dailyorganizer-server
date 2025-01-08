import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
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
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FilesInterceptor('files'))
  async createTask(
    @Body() task: CreateTaskDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1000 * 1000, // 1MB
          message: 'File size must be less than 1MB',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Array<Express.Multer.File>,
    @Req() req,
  ): Promise<Task> {
    // Upload images if files are provided
    const images =
      files.length > 0 ? await this.taskService.uploadImagesAws(files) : [];

    // Create the task with uploaded images
    const createdTask = await this.taskService.create(
      { ...task, images },
      req.user,
    );

    return createdTask;
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

  // @Put('upload/:id')
  // @UseGuards(AuthGuard())
  // @UseInterceptors(FilesInterceptor('files'))
  // async updateImages(
  //   @Param('id') id: string,
  //   @UploadedFiles(
  //     new ParseFilePipeBuilder().addFileTypeValidator({
  //       fileType: /(jpg|jpeg|png)$/
  //     })
  //     .addMaxSizeValidator({
  //       maxSize: 1000 * 1000,
  //       message: "File size must be less than 1MB"
  //     })
  //     .build({
  //       errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //     }),
  //   ) files: Array<Express.Multer.File>,
  // ){
  //   return this.taskService.uploadImages(id,files);
  // }

}
