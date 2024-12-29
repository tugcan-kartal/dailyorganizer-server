import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'
import { Task } from './schemas/task.schema';

@Injectable()
export class TaskService {
    constructor(
        @InjectModel(Task.name)
        private taskModal: mongoose.Model<Task>
    ) {}

    async findAll():Promise<Task[]>{
        const tasks=await this.taskModal.find();
        return tasks;
    }

    async create(task: Task):Promise<Task>{
        const res=await this.taskModal.create(task);
        return res;
    }
}
