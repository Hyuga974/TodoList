/*
**En tant qu'** utilisateur,  
**Je veux** filtrer mes tâches par statut (TODO, ONGOING, DONE),  
**Afin de** me concentrer sur un type d'activité.

**Critères d'acceptation :**
- **ÉTANT DONNÉ QUE** j'ai des tâches avec différents statuts, **LORSQUE** je filtre par "TODO", "ONGOING" ou "DONE", **ALORS** seules les tâches avec le statut correspondant sont retournées
- **ÉTANT DONNÉ QUE** je filtre par un statut et qu'aucune tâche ne correspond, **LORSQUE** j'applique le filtre, **ALORS** j'obtiens une liste vide
- **ÉTANT DONNÉ QUE** je filtre par un statut invalide, **LORSQUE** j'applique le filtre, **ALORS** j'obtiens une erreur "Invalid filter status"
- **ÉTANT DONNÉ QUE** je filtre par statut et que j'ai de nombreux résultats, **LORSQUE** j'applique le filtre, **ALORS** les résultats sont paginés
*/
import { TodoList } from "../../src/models/todoList";
import { TodoItem } from "../../src/models/todoItem";
import assert from "assert";

describe("Filter task", () => {
    let todoList : TodoList;
    const todoItem = new TodoItem(1, "Test Task", "This is a test task", new Date(), "waiting");
    const todoItem2 = new TodoItem(2, "Another Task", "This is another task", new Date(), "waiting");
    const todoItem3 = new TodoItem(3, "Another Task Again", "This is again an other task", new Date(), "waiting");
    
    beforeEach(()=>{
        todoList = new TodoList();
        todoList.setitems([
            todoItem,
            todoItem2,
            todoItem3
        ])
    })

    // **ÉTANT DONNÉ QUE** j'ai des tâches avec différents statuts, 
    // **LORSQUE** je filtre par "TODO", "ONGOING" ou "DONE", 
    // **ALORS** seules les tâches avec le statut correspondant sont retournées
    it("should return tasks with the status 'waiting'", () => {
        const result = todoList.filterByStatus("waiting");
        const expected = [todoItem, todoItem2, todoItem3];

        assert.deepEqual(result, expected, "Should return tasks with the status 'waiting'");
    });
    it("should return tasks with the status 'progress'", () => {
        const todoItem4 = new TodoItem(4, "In Progress Task", "This task is in progress", new Date(), "progress");
        todoList.setitems([todoItem, todoItem2, todoItem3, todoItem4]);
        
        const result = todoList.filterByStatus("progress");
        const expected = [todoItem4];

        assert.deepEqual(result, expected, "Should return tasks with the status 'progress'");
    });
    it("should return tasks with the status 'completed'", () => {
        const todoItem4 = new TodoItem(4, "Completed Task", "This task is completed", new Date(), "completed");
        todoList.setitems([todoItem, todoItem2, todoItem3, todoItem4]);
        
        const result = todoList.filterByStatus("completed");
        const expected = [todoItem4];

        assert.deepEqual(result, expected, "Should return tasks with the status 'completed'");
    });

    // **ÉTANT DONNÉ QUE** je filtre par un statut et qu'aucune tâche ne correspond, 
    // **LORSQUE** j'applique le filtre, 
    // **ALORS** j'obtiens une liste vide
    it("should return an empty list when no tasks match the status 'completed'", () => {
        const result = todoList.filterByStatus("completed");
        const expected: TodoItem[] = [];

        assert.deepEqual(result, expected, "Should return an empty list when no tasks match the status 'completed'");
    });

    // **ÉTANT DONNÉ QUE** je filtre par un statut invalide, 
    // **LORSQUE** j'applique le filtre, 
    // **ALORS** j'obtiens une erreur "Invalid filter status"
    it("should throw an error when filtering by an invalid status", () => {
        try {
            todoList.filterByStatus("abc");
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Invalid filter status", "Error message should be 'Invalid filter status'");
        }
    });

    // **ÉTANT DONNÉ QUE** je filtre par statut et que j'ai de nombreux résultats, 
    // **LORSQUE** j'applique le filtre, 
    // **ALORS** les résultats sont paginés
    it("should paginate results when filtering by status with many results", () => {
        
    })
})