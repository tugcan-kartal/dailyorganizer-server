import { Injectable } from '@nestjs/common';
import { TaskService } from 'src/task/task.service';
import { Task } from 'src/task/schemas/task.schema';
import { analyze } from 'src/utils/openai';

@Injectable()
export class ChatService {
    private userContexts: Map<string, Task> = new Map();

    constructor(private readonly taskService: TaskService) {} // TaskService burada enjeksiyonla alınıyor

    async prepareTaskContext(userId: string, task: Task): Promise<string> {
        this.userContexts.set(userId, task);
        console.log(`Bağlam Ayarlandı: UserId: ${userId}, Task: ${JSON.stringify(task)}`);
        return `Task "${task.title}" bağlam olarak ayarlandı.`;
    }

    async chatWithContext(userId: string, message: string): Promise<string> {
        console.log(`Context Map: ${JSON.stringify(Array.from(this.userContexts.entries()))}`);
        const task = this.userContexts.get(userId);
    
        if (!task) {
            console.log(`Bağlam Bulunamadı: UserId: ${userId}`);
            return 'Henüz bir task bağlamı ayarlamadınız.';
        }
    
        const taskDetails = `
        Task başlığı: "${task.title}".
        Açıklama: "${task.description}".
        Önem seviyesi: "${task.importance_level}".
        Kategori: "${task.category}".
        Başlangıç tarihi: "${task.start_date}".
        Bitiş tarihi: "${task.end_date}".
        `;
    
        const prompt = `Bu task hakkında: ${taskDetails}. Kullanıcıdan gelen mesaj: "${message}".`;
        console.log(`Prompt: ${prompt}`);
        const response = await analyze(prompt);
        return response;
    }
}
