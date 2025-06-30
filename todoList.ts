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

    read(): TodoItem[] {
        return [...this.items];
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