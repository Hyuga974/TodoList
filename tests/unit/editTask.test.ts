/*
**En tant qu'** utilisateur,  
**Je veux** modifier le titre et/ou la description d'une tâche existante,  
**Afin de** corriger ou préciser les informations.

**Critères d'acceptation :**
- **ÉTANT DONNÉ QUE** j'ai une tâche existante, **LORSQUE** je modifie son titre avec une valeur valide, **ALORS** le nouveau titre est sauvegardé et les autres champs restent inchangés
- **ÉTANT DONNÉ QUE** j'ai une tâche existante, **LORSQUE** je modifie sa description avec une valeur valide, **ALORS** la nouvelle description est sauvegardée et les autres champs restent inchangés
- **ÉTANT DONNÉ QUE** j'ai une tâche existante, **LORSQUE** je modifie à la fois le titre et la description, **ALORS** les deux modifications sont sauvegardées
- **ÉTANT DONNÉ QUE** je tente de modifier le titre d'une tâche avec une valeur vide, **LORSQUE** je soumets la modification, **ALORS** j'obtiens une erreur "Title is required"
- **ÉTANT DONNÉ QUE** je tente de modifier une tâche avec un titre de plus de 100 caractères, **LORSQUE** je soumets, **ALORS** j'obtiens une erreur "Title cannot exceed 100 characters"
- **ÉTANT DONNÉ QUE** je tente de modifier une tâche avec une description de plus de 500 caractères, **LORSQUE** je soumets, **ALORS** j'obtiens une erreur "Description cannot exceed 500 characters"
- **ÉTANT DONNÉ QUE** je tente de modifier une tâche inexistante, **LORSQUE** j'utilise un ID invalide, **ALORS** j'obtiens une erreur "Task not found"
- **ÉTANT DONNÉ QUE** je tente de modifier des champs non modifiables (ID, date de création, statut), **LORSQUE** je soumets ces modifications, **ALORS** ces champs sont ignorés et seuls titre/description sont pris en compte

> Attention, à bien factoriser votre code, certaines vérifications ont déjà été faites lors de la création de la tâche. Évitez de les redonder, mais assurez-vous de tester l'ensemble des cas.
*/

import { TodoList } from "../../src/models/todoList";
import { TodoItem } from "../../src/models/todoItem";
import assert from "assert";

let todoList = new TodoList();
todoList.create("Test Task", "This is a test task")
todoList.create("Another Task", "This is another task");

describe('Edit Task', () => {
    beforeEach(() => {
        let todoList = new TodoList();
        todoList.create("Test Task", "This is a test task")
        todoList.create("Another Task", "This is another task");
    });

    // **ÉTANT DONNÉ QUE** j'ai une tâche existante, 
    // **LORSQUE** je modifie son titre avec une valeur valide, 
    // **ALORS** le nouveau titre est sauvegardé et les autres champs restent inchangés
    it('should update the title of an existing task', () => {
        let task: TodoItem;
        let oldtask: TodoItem;

        assert.strictEqual(todoList.readAll().length > 0, true, "There should be at least one task in the list");
        
        try {
            oldtask = todoList.read(1);
        } catch (error) {
            assert.fail("Task with ID 1 should exist");
        }
        try {
            task = todoList.update(1, "Updated Task Title");
        } catch (error) {
            assert.fail("Task with ID 1 should exist");
        }

        assert.strictEqual(task.title, "Updated Task Title", "Task title should be updated");
        assert.strictEqual(task.id , oldtask.id, "Task ID should remain the same");
        assert.strictEqual(task.description, oldtask.description, "Task description should remain unchanged");
        assert.strictEqual(task.status, oldtask.status, "Task status should remain unchanged");
        assert.strictEqual(task.createdAt.getTime(), oldtask.createdAt.getTime(), "Task createdAt should remain unchanged");
    });

    //**ÉTANT DONNÉ QUE** j'ai une tâche existante, 
    // **LORSQUE** je modifie sa description avec une valeur valide, 
    // **ALORS** la nouvelle description est sauvegardée et les autres champs restent inchangés
    it('should update the description of an existing task', () => {
        let task: TodoItem;
        let oldtask: TodoItem;

        assert.strictEqual(todoList.readAll().length > 0, true, "There should be at least one task in the list");
        
        try {
            oldtask = todoList.read(1);
        } catch (error) {
            assert.fail("Task with ID 1 should exist");
        }
        try {
            task = todoList.update(1,undefined, "Updated Task Description");
        } catch (error) {
            assert.fail("Task with ID 1 should exist");
        }

        assert.strictEqual(task.description, "Updated Task Description", "Task description should be updated");
        assert.strictEqual(task.id , oldtask.id, "Task ID should remain the same");
        assert.strictEqual(task.title, oldtask.title, "Task title should remain unchanged");
        assert.strictEqual(task.status, oldtask.status, "Task status should remain unchanged");
        assert.strictEqual(task.createdAt.getTime(), oldtask.createdAt.getTime(), "Task createdAt should remain unchanged");
    });

    // **ÉTANT DONNÉ QUE** j'ai une tâche existante, 
    // **LORSQUE** je modifie à la fois le titre et la description, 
    // **ALORS** les deux modifications sont sauvegardées
    it('should update both title and description of an existing task', () => {
        let task: TodoItem;
        let oldtask: TodoItem;

        assert.strictEqual(todoList.readAll().length > 0, true, "There should be at least one task in the list");
        
        try {
            oldtask = todoList.read(1);
        } catch (error) {
            assert.fail("Task with ID 1 should exist");
        }
        try {
            task = todoList.update(1, "Updated Task Title Again", "Updated Task Description Again");
        } catch (error) {
            assert.fail("Task with ID 1 should exist");
        }

        assert.strictEqual(task.title, "Updated Task Title Again", "Task title should be updated");
        assert.strictEqual(task.description, "Updated Task Description Again", "Task description should be updated");
        assert.strictEqual(task.id , oldtask.id, "Task ID should remain the same");
        assert.strictEqual(task.status, oldtask.status, "Task status should remain unchanged");
        assert.strictEqual(task.createdAt.getTime(), oldtask.createdAt.getTime(), "Task createdAt should remain unchanged");
    });

    // **ÉTANT DONNÉ QUE** je tente de modifier le titre d'une tâche avec une valeur vide, 
    // **LORSQUE** je soumets la modification, 
    // **ALORS** j'obtiens une erreur "Title is required"
    it('should throw an error when trying to update the title with an empty value', () => {
        let task: TodoItem;
        let oldtask: TodoItem;

        assert.strictEqual(todoList.readAll().length > 0, true, "There should be at least one task in the list");
        
        try {
            oldtask = todoList.read(1);
        } catch (error) {
            assert.fail("Task with ID 1 should exist");
        }
        try {
            task = todoList.update(1, "  ");
            assert.fail("Expected an error to be thrown");
        } catch (error: any) {
            assert.strictEqual(error.message, "Title is required", "Error message should be 'Title is required'");
        }
    });

    // **ÉTANT DONNÉ QUE** je tente de modifier une tâche avec un titre de plus de 100 caractères, 
    // **LORSQUE** je soumets, 
    // **ALORS** j'obtiens une erreur "Title cannot exceed 100 characters"
    it('should throw an error when trying to update the title with more than 100 characters', () => {
        let task: TodoItem;
        let oldtask: TodoItem;

        assert.strictEqual(todoList.readAll().length > 0, true, "There should be at least one task in the list");
        
        try {
            oldtask = todoList.read(1);
        } catch (error) {
            assert.fail("Task with ID 1 should exist");
        }
        try {
            task = todoList.update(1, "a".repeat(101));
            assert.fail("Expected an error to be thrown");
        } catch (error: any) {
            assert.strictEqual(error.message, "Title cannot exceed 100 characters", "Error message should be 'Title cannot exceed 100 characters'");
        }
    });

    // **ÉTANT DONNÉ QUE** je tente de modifier une tâche avec une description de plus de 500 caractères, 
    // **LORSQUE** je soumets, 
    // **ALORS** j'obtiens une erreur "Description cannot exceed 500 characters"
    it('should throw an error when trying to update the description with more than 500 characters', () => {
        let task: TodoItem;
        let oldtask: TodoItem;

        assert.strictEqual(todoList.readAll().length > 0, true, "There should be at least one task in the list");
        
        try {
            oldtask = todoList.read(1);
        } catch (error) {
            assert.fail("Task with ID 1 should exist");
        }
        try {
            task = todoList.update(1, undefined, "b".repeat(501));
            assert.fail("Expected an error to be thrown");
        } catch (error: any) {
            assert.strictEqual(error.message, "Description cannot exceed 500 characters", "Error message should be 'Description cannot exceed 500 characters'");
        }
    });

    // **ÉTANT DONNÉ QUE** je tente de modifier une tâche inexistante, 
    // **LORSQUE** j'utilise un ID invalide, 
    // **ALORS** j'obtiens une erreur "Task not found"
    it('should throw an error when trying to update a non-existent task', () => {

        assert.strictEqual(todoList.readAll().length > 0, true, "There should be at least one task in the list");
        
        try {
            todoList.update(999, "Non-existent Task", "This task does not exist");
            assert.fail("Expected an error to be thrown");
        } catch (error: any) {
            assert.strictEqual(error.message, "Task not found", "Error message should be 'Task not found'");
        }
    });

    // **ÉTANT DONNÉ QUE** je tente de modifier des champs non modifiables (ID, date de création, statut), 
    // **LORSQUE** je soumets ces modifications, 
    // **ALORS** ces champs sont ignorés et seuls titre/description sont pris en compte
    it('should ignore non-modifiable fields (ID, createdAt, status) when updating a task', () => {
        let task: TodoItem;
        let oldtask: TodoItem;

        assert.strictEqual(todoList.readAll().length > 0, true, "There should be at least one task in the list");
        
        try {
            oldtask = todoList.read(1);
        } catch (error) {
            assert.fail("Task with ID 1 should exist");
        }
        try {
            task = todoList.update(1, "Updated Task Title Again", "Updated Task Description Again");
        } catch (error) {
            assert.fail("Task with ID 1 should exist");
        }

        assert.strictEqual(task.id, oldtask.id, "Task ID should remain unchanged");
        assert.strictEqual(task.createdAt.getTime(), oldtask.createdAt.getTime(), "Task createdAt should remain unchanged");
        assert.strictEqual(task.status, oldtask.status, "Task status should be updated to 'completed'");
        assert.strictEqual(task.title, "Updated Task Title Again", "Task title should be updated");
        assert.strictEqual(task.description, "Updated Task Description Again", "Task description should be updated");
    });
    // /!\DEMANDER pour cette fonction/!\
})