export interface Task {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    status: 'waiting' | 'progress' | 'completed';
}
