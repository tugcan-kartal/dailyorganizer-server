import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Task } from './schemas/task.schema';
import { User } from '../auth/schemas/user.schema';
import { uploadImagesAws } from 'src/utils/aws';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: mongoose.Model<Task>,
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

  async findAll(query: any): Promise<Task[]> {
    const filter = { user: query.user }; // Kullanıcı bazlı filtreleme
    const sort: [string, mongoose.SortOrder][] = []; // Dinamik sıralama

    // Sorgu filtresini işleme
    if (query.filter) {
      const [listBy, ascORdsc] = query.filter.split(':');
      sort.push([listBy, ascORdsc === 'asc' ? 'asc' : 'desc']); // Artan ya da azalan sıralama
    }

    sort.push(['order', 1]); // Veritabanındaki task 'order' alanına göre artan sıralama ekliyoruz

    return this.taskModel.find(filter).sort(sort).exec();
  }

  async create(task: Task, user: User): Promise<Task> {
    const lastTask = await this.taskModel
      .findOne({ user: user._id })
      .sort({ order: -1 })
      .exec();
    const newOrder = lastTask ? lastTask.order + 1 : 1;

    const data = { ...task, user: user._id, order: newOrder }; // Merge task with user data
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

  async findById(id: string): Promise<Task> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    const task = await this.taskModel.findById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async updateById(id: string, task: Task): Promise<Task> {
    return await this.taskModel.findByIdAndUpdate(id, task, {
      new: true,
      runValidators: true,
    });
  }

  async updateOrder(id: string, order: number): Promise<Task> {
    return await this.taskModel.findByIdAndUpdate(
      id,
      { order },
      { new: true, runValidators: true },
    );
  }

  async deleteById(id: string) {
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
