import { ITodoItem, TodoItem } from './todoItem';

export class TodoList {
    private items: TodoItem[] = [];
    private nextId: number = 1;

    create(title: string, description: string): ITodoItem {
        const item = new TodoItem(
            this.nextId++,
            title,
            description, 
            new Date(),
            'waiting'
        )
        this.items.push(item);
        return item;
    }

    readAll(): TodoItem[] {
        console.log("Reading all tasks...");
        if (this.items.length === 0) {
            throw new Error("No tasks available");
        }
        return [...this.items];
    }

    read(id: number): TodoItem {
        if (typeof id !== 'number' || id <= 0) {
            throw new Error("Invalid ID format");
        }
        const item = this.items.find(i => i.id === id);
        if (item) {
            return item;
        } else {
            throw new Error(`Task not found`);
        }
    }

    update(id: number, newTitle?: string, newDescription?: string, newStatus?: 'waiting' | 'progress' | 'completed'): TodoItem  {
        const item = this.items.find(i => i.id === id);
        if (item) {
            if (newTitle !== undefined) item.title = newTitle;
            if (newDescription !== undefined) item.description = newDescription;
            if (newStatus !== undefined) item.status = newStatus;
            return item;
        } else {
            throw new Error(`TodoItem with id ${id} not found`);
        }
    }

    delete(id: number): string | boolean {
        const index = this.items.findIndex(i => i.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
            return true;
        } else {
            throw new Error(`This item is not found`);
        }
    }
}