/*
**En tant qu'** utilisateur,  
**Je veux** consulter les détails complets d'une tâche existante,  
**Afin de** voir toutes les informations associées.

**Critères d'acceptation :**
- **ÉTANT DONNÉ QUE** j'ai une tâche existante avec ID valide, **LORSQUE** je consulte cette tâche, **ALORS** j'obtiens tous ses détails : ID, titre, description, statut, date de création, etc..
- **ÉTANT DONNÉ QUE** je consulte une tâche avec un ID inexistant, **LORSQUE** je fais la demande, **ALORS** j'obtiens une erreur "Task not found" avec, si web, le code 404
- **ÉTANT DONNÉ QUE** je consulte une tâche avec un ID au mauvais format, **LORSQUE** je fais la demande, **ALORS** j'obtiens une erreur "Invalid ID format"
*/
import { TodoList } from "../../src/models/todoList";
import { TodoItem } from "../../src/models/todoItem";
import assert from "assert";

let todoList = new TodoList();
const todoItem = new TodoItem(1, "Test Task", "This is a test task", new Date(), "waiting");
const todoItem2 = new TodoItem(2, "Another Task", "This is another task", new Date(), "waiting");

describe('Read Task', () => {
    beforeEach(() => {
            todoList = new TodoList();
            todoList.setitems([todoItem,todoItem2])
        });
    
    //**ÉTANT DONNÉ QUE** j'ai une tâche existante avec ID valide, 
    // **LORSQUE** je consulte cette tâche, 
    // **ALORS** j'obtiens tous ses détails : ID, titre, description, statut, date de création, etc..
    it('should return the details of an existing task', () => {
        let task : TodoItem;   

        //assert.strictEqual(todoList.readAll().length>0, true, "There should be at least one task in the list");

        try {
            task = todoList.read(1); 
        } catch (error) {
            assert.fail("Task with ID 1 should exist");
        }
        
        assert.strictEqual(task.id>0, true, "Task ID should be greater than 0");
        assert.strictEqual(task.title !== null, true, "Task title should not be null");
        assert.strictEqual(task.description !== null, true, "Task description should not be null");
        assert.strictEqual(task.status, "waiting", "Task status should be 'waiting'");
        assert.strictEqual(task.createdAt instanceof Date, true, "Task createdAt should be a Date object");
    });

    //- **ÉTANT DONNÉ QUE** je consulte une tâche avec un ID inexistant, 
    // **LORSQUE** je fais la demande, 
    // **ALORS** j'obtiens une erreur "Task not found" avec, si web, le code 404
    it('should throw an error when trying to read a task with a non-existent ID', () => {
        try {
            todoList.read(999);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Task not found", "Error message should be 'Task not found'");
        }
    });


    //- **ÉTANT DONNÉ QUE** je consulte une tâche avec un ID au mauvais format, 
    // **LORSQUE** je fais la demande, 
    // **ALORS** j'obtiens une erreur "Invalid ID format"
    it('should throw an error when trying to read a task with an invalid ID format', () => {
        try {
            todoList.read(-1); 
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Invalid ID format", "Error message should be 'Invalid ID format'");
        }

        try {
            todoList.read(0); // Zero ID
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Invalid ID format", "Error message should be 'Invalid ID format'");
        }

        // try{
        //     todoList.read("invalid"); // Invalid ID format
        //     assert.fail("Expected an error to be thrown");
        // } catch (error) {
        //     assert.strictEqual((error as Error).message, "Invalid ID format", "Error message should be 'Invalid ID format'");
        // }

    });

   
    // **ÉTANT DONNÉ QUE** j'ai supprimé une tâche, *
    // **LORSQUE** je tente de la consulter par son ID, 
    // **ALORS** j'obtiens une erreur "Task not found"
    it('should throw an error when trying to read a deleted task', () => {
        //assert.strictEqual(todoList.readAll().length > 0, true, "There should be at least one task in the list");

        let taskToDelete : TodoItem;
        try{
            taskToDelete = todoList.read(1);
        } catch (error) {
            assert.fail("Task should exist");
        }
        
        try{
            todoList.delete(taskToDelete.id);
        } catch (error) {
            assert.fail("Task should be deleted");
        }

        try {
            todoList.read(taskToDelete.id);
            assert.fail("Task should not exist after deletion");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Task not found", "Error message should be 'Task not found'");
        }

    });
});