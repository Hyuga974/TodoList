import { ITodoItem, TodoItem } from './todoItem';

export class TodoList {
    private items: TodoItem[] = [];
    private nextId: number = 1;

    // TODO : Init items
    setitems(tasks: TodoItem[]): void {
        if (!Array.isArray(tasks)) {
            throw new Error("Items must be an array");
        }
        for (const task of tasks) {
            if (!(task instanceof TodoItem)) {
                throw new Error("All items must be instances of TodoItem");
            }
        }
        this.items = tasks.map(task => {
            return task;
        });
    }

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
        //console.log("Reading all tasks...");
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

    // Faire une copie e l'item avant de la réinsérer dans le tableau
    update(id: number, newTitle?: string, newDescription?: string): TodoItem  {
        const item = this.items.find(i => i.id === id);
        if (item) {
            if (newTitle !== undefined && newTitle.length <100){
                if (newTitle.trim() === "") {
                    throw new Error("Title is required");
                } else {
                    item.title = newTitle;
                }
            } else if (newTitle !== undefined && newTitle.length >= 100) {
                throw new Error("Title cannot exceed 100 characters");
            }
            if (newDescription !== undefined){
                if (newDescription.length > 500) {
                    throw new Error("Description cannot exceed 500 characters");
                }
                item.description = newDescription;
            } 
            return item;
        } else {
            throw new Error(`Task not found`);
        }
    }

    progress(id: number): TodoItem {
        if (typeof id !== 'number' || id <= 0) {
            throw new Error("Invalid ID format");
        }

        const item = this.items.find(i => i.id === id);
        if (!item) throw new Error(`Task not found`);

        switch (item.status) {
            case 'waiting':
                item.status = 'progress';
                break;
            case 'progress':
                item.status = 'completed';
                break;
            default:
                throw new Error("Invalid status");
        }
        return item;
    }

    delete(id: number): string | boolean {
        const index = this.items.findIndex(i => i.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
            return true;
        } else {
            throw new Error(`Task not found`);
        }
    }

    search(
        keyword: string ="",
        status : "waiting" | "progress" | "completed" | "" = "",
        criteria: "id" | "date" | "title" | "status" = "id",
        order: "asc" | "desc" = "desc"
    ): TodoItem[] {
        if (typeof keyword !== 'string') {
            throw new Error("Keyword must be a string");
        }
        let results: TodoItem[] = [...this.items];
        try{
            results = this.sortBy(criteria, order);
        } catch (_) {
            
        }

        if (status !== ""){
            try{
                results = this.filterByStatus(status);
            } catch (_) {
                
            }
        }

        if (keyword.trim() === "") {
            return results;
        }

        const lowerKeyword = keyword.toLowerCase();
        results = results.filter(item => 
            item.title.toLowerCase().includes(lowerKeyword) || 
            item.description.toLowerCase().includes(lowerKeyword)
        );

        return results;
    }

    filterByStatus(status: string): TodoItem[] {
        const validStatuses = ['waiting', 'progress', 'completed'];
        if (!validStatuses.includes(status)) {
            throw new Error("Invalid filter status");
        }

        const results = this.items.filter(item => item.status === status);
        return results;
    }

    sortBy(criteria: string = "date", order: string = "desc", filterList : TodoItem[]=this.items): TodoItem[] {
        const validCriteria = ['date', 'title', 'status'];
        const validOrders = ['asc', 'desc'];

        if (!validCriteria.includes(criteria)) {
            throw new Error("Invalid sort criteria");
        }
        if (!validOrders.includes(order)) {
            throw new Error("Invalid sort order");
        }

        let sortedItems = [...filterList];
        switch (criteria) {
            case 'date':
                sortedItems.sort((a, b) => {
                    return b.createdAt.getTime() - a.createdAt.getTime();
                });
                break;
            case 'title':
                sortedItems.sort((a, b) => {
                    return b.title.localeCompare(a.title)
                }
                );
                break;
            case 'status':
                const statusOrder = ['waiting', 'progress', 'completed'];
                sortedItems.sort((a, b) => {
                    return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
                }
                );
                break;
            default:
                throw new Error("Invalid sort criteria");
        }
        if (order === 'asc' && criteria !== 'status') {
            sortedItems.reverse();
        }
        return sortedItems;

    }
}