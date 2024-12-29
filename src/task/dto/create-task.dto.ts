

export class CreateTaskDto{
    readonly title: string;
    readonly description: string;
    readonly author: string;
    readonly importance_level: string;
    readonly category: string;
    readonly start_date: Date;
    readonly end_date: Date;
}