import { TaskRepository } from '../repositories/taskRepository';
import { Task } from '../models/task';
import { Database } from 'sqlite';
import { openDB } from '../db/index'; // Add this import

export class TaskService {
    private taskRepository: TaskRepository;
    private db: unknown;
    
    constructor(database : Database | unknown) {
        this.db = database || openDB();
        this.taskRepository = new TaskRepository(this.db); // Pass DB to repository
    }

    async createTask(title: string, description: string, date: Date = new Date(), status : string = 'waiting'): Promise<Task> {
        if (!title || title.trim() === '') {
            throw new Error('Title is required');
        }
        if (title.length > 100) {
            throw new Error('Title cannot exceed 100 characters');
        }
        if (description.length > 500) {
            throw new Error('Description cannot exceed 500 characters');
        }

        return this.taskRepository.create(title, description, date, status);
    }

    async getAllTasks(): Promise<Task[]> {
        return this.taskRepository.readAll();
    }

    async getTaskById(id: number): Promise<Task> {
        if (typeof id !== 'number' || id <= 0) {
            throw new Error("Invalid ID format");
        }
        return this.taskRepository.read(id);
    }

    async updateTask(id: number, newTitle?: string, newDescription?: string): Promise<Task> {
        if (newTitle !== undefined) {
            if (newTitle.trim() === "") {
                throw new Error("Title is required");
            }
            if (newTitle.length >= 100) {
                throw new Error("Title cannot exceed 100 characters");
            }
        }

        if (newDescription !== undefined && newDescription.length > 500) {
            throw new Error("Description cannot exceed 500 characters");
        }

        return this.taskRepository.update(id, newTitle, newDescription);
    }

    async progressTask(id: number): Promise<Task> {
        if (typeof id !== 'number' || id <= 0) {
            throw new Error("Invalid ID format");
        }
        return this.taskRepository.progress(id);
    }

    async deleteTask(id: number): Promise<void> {
        const task = await this.getTaskById(id);
        if (!task) {
            throw new Error("Task not found");
        }
        try {
            await this.taskRepository.delete(id);

        } catch (error) {
            throw new Error("Task not found");
        }
    }

    async searchTasks(keyword: string = "", status: string = "", criteria: string = "", order: string = ""): Promise<Task[]> {
        return this.taskRepository.search(keyword, status, criteria, order);
    }
}