export interface ITodoItem {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    status: 'waiting' | 'progress' | 'completed';
}


export class TodoItem implements ITodoItem {
    
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public createdAt: Date = new Date(),
        public status: 'waiting' | 'progress' | 'completed' = 'waiting'

    ) {
        if (!title || title.trim() === '') {
            throw new Error('Title is required');
        }
        if (title.length > 100) {
            throw new Error('Title cannot exceed 100 characters');
        }
        if (description.length > 500) {
            throw new Error('Description cannot exceed 500 characters');
        }
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.status = status;
    }

    toString(): string {
        return `ID: ${this.id}, Title: ${this.title}, Description: ${this.description}, Created At: ${this.createdAt.toISOString()}, Status: ${this.status}`;
    }

}
