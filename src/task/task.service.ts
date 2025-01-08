import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'
import { Task } from './schemas/task.schema';
import {Query} from "express-serve-static-core";
import { User } from '../auth/schemas/user.schema';
import { uploadImagesAws } from 'src/utils/aws';

@Injectable()
export class TaskService {
    constructor(
        @InjectModel(Task.name)
        private taskModel: mongoose.Model<Task>
    ) {}

    // async findAll(query: Query):Promise<Task[]>{

    //     const resPerPage=2;
    //     const currentPage=Number(query.page) || 1
    //     const skip=resPerPage * (currentPage-1)
        
    //     const keyword=query.keyword ? {
    //         title: {
    //             $regex: query.keyword,
    //             $options: 'i'
    //         }
    //     } : {}

    //     const tasks=await this.taskModel.find({...keyword}).limit(resPerPage).skip(skip);
    //     return tasks;
    // }

    async findAll(filter: any):Promise<Task[]>{
        return this.taskModel.find(filter).sort({ order: 1 }).exec();
    }

    async create(task: Task, user: User): Promise<Task> {
        const data = { ...task, user: user._id }; // Merge task with user data
        const createdTask = await this.taskModel.create(data);
        return createdTask;
      }
      
      async uploadImagesAws(files: Array<Express.Multer.File>): Promise<object[]> {
        if (!files || files.length === 0) {
          return [];
        }
      
        // Upload images to AWS or another storage service
        const images = await uploadImagesAws(files);
        return images as object[];
      }
      

    async findById(id: string): Promise<Task>{
        const isValidId=mongoose.isValidObjectId(id);
        if(!isValidId){
            throw new BadRequestException("Please enter correct id.")
        }

        const task=await this.taskModel.findById(id);
        if(!task){
            throw new NotFoundException("Task not found")
        }
        return task;
    }

    async updateById(id: string,task: Task): Promise<Task>{
        return await this.taskModel.findByIdAndUpdate(id,task,{
            new: true,
            runValidators: true,
        })
    }

    async updateOrder(id: string, order: number): Promise<Task> {
        return await this.taskModel.findByIdAndUpdate(
          id,
          { order },
          { new: true, runValidators: true }
        );
      }
      

    async deleteById(id: string){
        return await this.taskModel.findByIdAndDelete(id);
    }

    // async uploadImages(id: string,files: Array<Express.Multer.File>){
    //   const task=await this.taskModel.findById(id);

    //   if(!task){
    //       throw new NotFoundException("Task not found");
    //   }

    //   const images=await uploadImagesAws(files);

    //   task.images=images as object[];

    //   await task.save();

    //   return task;

    // }

}
