import { Database, openDB } from '../db/index';
import crypto from 'crypto';
import { Task } from '../models/task';
import { Console } from 'console';

export class TaskRepository {
    private db: Database;
    constructor(database?: Database|unknown) {
        if (database && typeof database === 'object' && 'run' in database && 'get' in database && 'all' in database) {
            this.db = database as Database; 
        } else {
            this.db = openDB(); 
        }
   }

    async create(title: string, description: string, createdAt: Date = new Date(), status : string = "waiting"): Promise<Task> {
        try {
            const result = await this.db.run(
                'INSERT INTO tasks (title, description, createdAt, status) VALUES (?, ?, ?, ?)',
                [title, description, createdAt, status]
            );
            return {
                id: result.lastID,
                title: title,
                description: description,
                createdAt: new Date(createdAt),
                status: status as 'waiting' | 'progress' | 'completed'
            };
        } catch (error) {
            throw error;
        }
    }

    async readAll(): Promise<Task[]> {
        const rows = await this.db.all('SELECT * FROM tasks');
        if (rows.length === 0) {
            throw new Error("No tasks available");
        }
        return rows.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
            createdAt: new Date(row.createdAt),
            status: row.status
        }));
    }

    async read(id: number): Promise<Task> {
        if (typeof id !== 'number' || id <= 0) {
            throw new Error("Invalid ID format");
        }
        const row = await this.db.get('SELECT * FROM tasks WHERE id = ?', [id]);
        if (!row) {
            throw new Error(`Task not found`);
        }
        return {
            id: row.id,
            title: row.title,
            description: row.description,
            createdAt: new Date(row.createdAt),
            status: row.status
        };
    }

    async update(id: number, newTitle?: string, newDescription?: string): Promise<Task> {
        const task = await this.read(id);

        if (newTitle !== undefined) {
            if (newTitle.trim() === "") {
                throw new Error("Title is required");
            }
            if (newTitle.length >= 100) {
                throw new Error("Title cannot exceed 100 characters");
            }
            task.title = newTitle;
        }

        if (newDescription !== undefined) {
            if (newDescription.length > 500) {
                throw new Error("Description cannot exceed 500 characters");
            }
            task.description = newDescription;
        }

        await this.db.run(
            'UPDATE tasks SET title = ?, description = ? WHERE id = ?',
            [task.title, task.description, id]
        );

        return task;
    }

    async progress(id: number): Promise<Task> {
        const task = await this.read(id);

        switch (task.status) {
            case 'waiting':
                task.status = 'progress';
                break;
            case 'progress':
                task.status = 'completed';
                break;
            default:
                throw new Error("Invalid status. Allowed values: waiting, progress, completed");
        }

        await this.db.run(
            'UPDATE tasks SET status = ? WHERE id = ?',
            [task.status, id]
        );

        return task;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.db.run('DELETE FROM tasks WHERE id = ?', [id]);
        if (result.changes === 0) {
            throw new Error(`Task not found`);
        }
        return true;
    }

    async search(keyword: string = "", status: string = "", criteria: string = "", order: string = ""): Promise<Task[]> {
        let query = 'SELECT * FROM tasks';
        const conditions = [];
        const params = [];

        if (keyword) {
            conditions.push('(title LIKE ? OR description LIKE ?)');
            params.push(`%${keyword}%`, `%${keyword}%`);
        }

        if (status) {
            const validStatus = ['waiting', 'progress', 'completed'];
            if (validStatus.includes(status)) {
                conditions.push('status = ?');
                params.push(status);
            } else {
                throw Error("Invalid filter status");
            }
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        if (criteria) {
            if (criteria == "date") criteria = "createdAt";
            if (order == "") order = "DESC";
            const validCriteria = ['createdAt', 'title', 'status'];
            const validOrders = ['ASC', 'DESC'];
            console.log("Criteria:", criteria, "Order:", order);
            if (!validCriteria.includes(criteria) ) {
                throw new Error('Invalid sort criteria');
            } else if (!validOrders.includes(order.toUpperCase())){
                throw new Error('Invalid order');
            } else {
                query += ` ORDER BY ${criteria} ${order.toUpperCase()}`;
            }
        }

        const rows = await this.db.all(query, params);
        let result = rows.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
            createdAt: new Date(row.createdAt),
            status: row.status
        }));
        // do me a sort for the list caus i want first the waiting tasks, then the progress tasks and finally the completed tasks
        result.sort((a, b) => {
            const statusOrder: { [key in 'waiting' | 'progress' | 'completed']: number } = {
                'waiting': 1,
                'progress': 2,
                'completed': 3
            };
            return statusOrder[a.status as 'waiting' | 'progress' | 'completed'] - statusOrder[b.status as 'waiting' | 'progress' | 'completed'];
        });
        return result;
    }

}
