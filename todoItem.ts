export interface ITodoItem {
  id: number;
  title: string;
  description: string;
}


export class TodoItem implements ITodoItem {
    
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public status: 'waiting' | 'progress' | 'completed' = 'waiting'

  ) {

  }
    toString(): string {
        return `TodoItem:
        ID: ${this.id}
        Title: ${this.title}
        Description: ${this.description}
        Status: ${this.status}
        \n
        `;
    }

}
