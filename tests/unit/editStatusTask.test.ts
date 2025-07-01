/*
**En tant qu'** utilisateur,  
**Je veux** faire évoluer le statut d'une tâche (TODO → ONGOING → DONE),  
**Afin de** suivre l'avancement de mes activités.

**Critères d'acceptation :**
- **ÉTANT DONNÉ QUE** j'ai une tâche existante, **LORSQUE** je change son statut vers "TODO", "ONGOING" ou "DONE", **ALORS** le statut est mis à jour avec succès
- **ÉTANT DONNÉ QUE** je tente de changer le statut d'une tâche vers une valeur invalide, **LORSQUE** je soumets le changement, **ALORS** j'obtiens une erreur "Invalid status. Allowed values: TODO, ONGOING, DONE"
- **ÉTANT DONNÉ QUE** je tente de changer le statut d'une tâche inexistante, **LORSQUE** j'utilise un ID invalide, **ALORS** j'obtiens une erreur "Task not found"
*/
import { TodoList } from "../../src/models/todoList";
import { TodoItem } from "../../src/models/todoItem";
import assert from "assert";

describe('Edit Status Task', () => {
    let todoList = new TodoList();
    beforeEach(() => {
        todoList = new TodoList();
        todoList.create("Test Task", "This is a test task");
    });

    // **ÉTANT DONNÉ QUE** j'ai une tâche existante,
    // **LORSQUE** je change son statut vers "TODO", "ONGOING" or "DONE",
    // **ALORS** le statut est mis à jour avec succès
    it('should update the status of an existing task', () => {
        let updatedTask: TodoItem;
        let oldTask: TodoItem;        
        
        assert.strictEqual(todoList.readAll().length > 0, true, "There should be at least one task in the list");

        try {
            oldTask = todoList.read(1);
            assert.strictEqual(oldTask.status, "waiting", "Task ID should be greater than 0");
        } catch (error) {
            assert.fail("Task with ID 1 should exist");
        }
        

        try {
            updatedTask = todoList.progress(1);

            assert.strictEqual(updatedTask.status, 'progress', "Task status should be 'progress'");
            assert.strictEqual(updatedTask.id, oldTask.id, "Task ID should remain the same");
            assert.strictEqual(updatedTask.title, oldTask.title, "Task title should remain the same");
            assert.strictEqual(updatedTask.description, oldTask.description, "Task description should remain the same");
            assert.strictEqual(updatedTask.createdAt.getTime(), oldTask.createdAt.getTime(), "Task createdAt should remain the same");
        } catch (error) {
            assert.fail("Task with ID 1 should be updated to 'progress'");
        }
        
        try {
            updatedTask = todoList.progress(1);

            assert.strictEqual(updatedTask.status, 'completed', "Task status should be 'progress'");
            assert.strictEqual(updatedTask.id, oldTask.id, "Task ID should remain the same");
            assert.strictEqual(updatedTask.title, oldTask.title, "Task title should remain the same");
            assert.strictEqual(updatedTask.description, oldTask.description, "Task description should remain the same");
            assert.strictEqual(updatedTask.createdAt.getTime(), oldTask.createdAt.getTime(), "Task createdAt should remain the same");
        } catch (error) {
            assert.fail("Task with ID 1 should be updated to 'completed'");
        }
        
    });

    // **ÉTANT DONNÉ QUE** je tente de changer le statut d'une tâche vers une valeur invalide, 
    // **LORSQUE** je soumets le changement, 
    // **ALORS** j'obtiens une erreur "Invalid status. Allowed values: TODO, ONGOING, DONE"
    it('should throw an error when trying to update the status with an invalid value', () => {
        let updatedTask: TodoItem;
        let oldTask: TodoItem;        
        
        assert.strictEqual(todoList.readAll().length > 0, true, "There should be at least one task in the list");

        try {
            oldTask = todoList.read(1);
            assert.strictEqual(oldTask.status, "waiting", "Task ID should be greater than 0");
        } catch (error) {
            assert.fail("Task with ID 1 should exist");
        }

        try {
            updatedTask = todoList.progress(1);
            updatedTask = todoList.progress(1);
            assert.strictEqual(updatedTask.id, oldTask.id, "Task ID should remain the same");
            assert.strictEqual(updatedTask.title, oldTask.title, "Task title should remain the same");
            assert.strictEqual(updatedTask.description, oldTask.description, "Task description should remain the same");
            assert.strictEqual(updatedTask.createdAt.getTime(), oldTask.createdAt.getTime(), "Task createdAt should remain the same");
            assert.strictEqual(updatedTask.status, 'completed', "Task status should be 'progress'");
        } catch (error) {
            assert.fail("Task should be updated to 'completed'");
        }

        try {
            updatedTask = todoList.progress(1);
            assert.fail("Task can't be upgraded from 'completed' ");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Invalid status", "Error message should be 'Invalid status. Allowed values: waiting, progress, completed'");
        }
    });

    // **ÉTANT DONNÉ QUE** je tente de changer le statut d'une tâche inexistante, 
    // **LORSQUE** j'utilise un ID invalide, 
    // **ALORS** j'obtiens une erreur "Task not found"
    it('should throw an error when trying to update the status of a non-existent task', () => {
        let oldTask: TodoItem;        
        
        assert.strictEqual(todoList.readAll().length > 0, true, "There should be at least one task in the list");

        try {
            todoList.progress(999);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Task not found", "Error message should be 'Task not found'");
        }
    });
});