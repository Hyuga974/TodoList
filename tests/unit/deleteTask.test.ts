/*
**En tant qu'** utilisateur,  
**Je veux** supprimer définitivement une tâche,  
**Afin de** nettoyer ma liste des tâches devenues inutiles.

**Critères d'acceptation :**
- **ÉTANT DONNÉ QUE** j'ai une tâche existante, **LORSQUE** je la supprime, **ALORS** elle n'apparaît plus dans la liste des tâches
- **ÉTANT DONNÉ QUE** j'ai supprimé une tâche, **LORSQUE** je tente de la consulter, de la supprimer, de la modifier ou de change son status par son ID, **ALORS** j'obtiens une erreur "Task not found"
*/

import { TodoList } from "../../src/models/todoList";
import { TodoItem } from "../../src/models/todoItem";
import assert from "assert";

let todoList = new TodoList();
const todoItem = new TodoItem(1, "Test Task", "This is a test task", new Date(), "waiting");
const todoItem2 = new TodoItem(2, "Another Task", "This is another task", new Date(), "waiting");
describe('Delete Task', () => {
    beforeEach(() => {
        todoList = new TodoList();
        todoList.setitems([todoItem, todoItem2]);

    });

    // **ÉTANT DONNÉ QUE** j'ai une tâche existante,
    // **LORSQUE** je la supprime,
    // **ALORS** elle n'apparaît plus dans la liste des tâches
    it('should delete an existing task', () => {
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
        try{
            taskToDelete = todoList.read(1);
            assert.fail("Task should not exist after deletion");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Task not found", "Error message should be 'Task not found'");
        }
        
        assert.strictEqual(todoList.readAll().length, 1, "There should be only one task left in the list after deletion");
    });

    // // TODO : Move this test in others files
    // // **ÉTANT DONNÉ QUE** j'ai supprimé une tâche, *
    // // **LORSQUE** je tente de la consulter, de la supprimer, de la modifier ou de change son status par son ID, 
    // // **ALORS** j'obtiens une erreur "Task not found"
    // it('should throw an error when trying to access a deleted task', () => {
    //     //assert.strictEqual(todoList.readAll().length > 0, true, "There should be at least one task in the list");

    //     let taskToDelete : TodoItem;
    //     try{
    //         taskToDelete = todoList.read(1);
    //     } catch (error) {
    //         assert.fail("Task should exist");
    //     }
        
    //     try{
    //         todoList.delete(taskToDelete.id);
    //     } catch (error) {
    //         assert.fail("Task should be deleted");
    //     }

    //     try {
    //         todoList.read(taskToDelete.id);
    //         assert.fail("Task should not exist after deletion");
    //     } catch (error) {
    //         assert.strictEqual((error as Error).message, "Task not found", "Error message should be 'Task not found'");
    //     }

    //     try {
    //         todoList.delete(taskToDelete.id);
    //         assert.fail("Task should not exist after deletion");
    //     } catch (error) {
    //         assert.strictEqual((error as Error).message, "Task not found", "Error message should be 'Task not found'");
    //     }

    //     try {
    //         todoList.update(taskToDelete.id, "Updated Task", "This task has been updated");
    //         assert.fail("Task should not exist after deletion");
    //     } catch (error) {
    //         assert.strictEqual((error as Error).message, "Task not found", "Error message should be 'Task not found'");
    //     }

    // });
});