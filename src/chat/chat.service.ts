import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatContext } from './schemas/ChatContext';
import { analyze } from 'src/utils/openai';
import { Task } from 'src/task/schemas/task.schema';
import { TaskService } from 'src/task/task.service';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel('ChatContext') private chatContextModel: Model<ChatContext>,
        private taskService: TaskService,  // TaskService burada enjekte ediliyor
    ) {}

    async prepareTaskContext(userId: string, task: Task): Promise<string> {
        // Eski bağlamı bulup güncelleme
        const existingContext = await this.chatContextModel.findOneAndUpdate(
            { userId }, // Kullanıcıya ait
            { 
                taskId: task._id, 
                taskDetails: task,
            },
            { new: true, upsert: true } // Eğer bir bağlam yoksa yeni bir bağlam ekler
        );
    
        return existingContext
            ? `Task "${task.title}" bağlam olarak güncellendi.`
            : `Task "${task.title}" bağlam olarak kaydedildi.`;
    }
    

    async chatWithContext(userId: string, message: string): Promise<string> {
        const context = await this.chatContextModel.findOne({ userId });

        if (!context) {
            return 'Henüz bir task bağlamı ayarlamadınız.';
        }

        const taskDetails = `
        Task başlığı: "${context.taskDetails.title}".
        Açıklama: "${context.taskDetails.description}".
        Önem seviyesi: "${context.taskDetails.importance_level}".
        Kategori: "${context.taskDetails.category}".
        Başlangıç tarihi: "${context.taskDetails.start_date}".
        Bitiş tarihi: "${context.taskDetails.end_date}".
        `;

        const prompt = `Bu task hakkında: ${taskDetails}. Kullanıcıdan gelen mesaj: "${message}".`;
        const response = await analyze(prompt);

        context.messages.push({ message,response ,timestamp: new Date() });
        await context.save();

        return response;
    }
}
