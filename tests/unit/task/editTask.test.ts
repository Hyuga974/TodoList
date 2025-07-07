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

import assert from "assert";
import { TaskService } from "../../../src/services/taskService";
import { Task } from "../../../src/models/task";
import { openDB, Database } from '../../../src/db/index';
import fs from "fs";

const testDbPath = 'test-edit-task.sqlite';

describe('Edit Task', () => {
    let taskService: TaskService;
    let db: Database;

    beforeAll(async () => {
        // Remove existing test database if it exists
        if (fs.existsSync(testDbPath)) {
            fs.unlinkSync(testDbPath);
        }

        db = openDB(testDbPath);
        await db.run(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                createdAt DATETIME NOT NULL,
                status TEXT NOT NULL
            )
        `);
    });

    afterEach(async () => {
        // Clear the tasks table after each test
        await db.run('DELETE FROM tasks');
    });

    afterAll(async () => {
        await db.close();
        if (fs.existsSync(testDbPath)) {
            fs.unlinkSync(testDbPath);
        }
    });

    beforeEach(async () => {
        taskService = new TaskService(db);
        // Clear the tasks table before each test
        await db.run('DELETE FROM tasks');

        // Insert initial tasks for testing
        await db.run(
            'INSERT INTO tasks (id, title, description, createdAt, status) VALUES (?, ?, ?, ?, ?)',
            [1, "Test Task", "This is a test task", new Date().toISOString(), "waiting"]
        );
        await db.run(
            'INSERT INTO tasks (id, title, description, createdAt, status) VALUES (?, ?, ?, ?, ?)',
            [2, "Another Task", "This is another task", new Date().toISOString(), "waiting"]
        );
    });

    // **ÉTANT DONNÉ QUE** j'ai une tâche existante,
    // **LORSQUE** je modifie son titre avec une valeur valide,
    // **ALORS** le nouveau titre est sauvegardé et les autres champs restent inchangés
    it('should update the title of an existing task', async () => {
        let oldTask: Task;
        let updatedTask: Task;

        try {
            oldTask = await taskService.getTaskById(1);
        } catch (error) {
            assert.fail("Task with ID 1 should exist");
        }

        try {
            updatedTask = await taskService.updateTask(1, "Updated Task Title", undefined);
        } catch (error) {
            assert.fail("Task with ID 1 should be updated");
        }

        assert.strictEqual(updatedTask.title, "Updated Task Title", "Task title should be updated");
        assert.strictEqual(updatedTask.id, oldTask.id, "Task ID should remain the same");
        assert.strictEqual(updatedTask.description, oldTask.description, "Task description should remain unchanged");
        assert.strictEqual(updatedTask.status, oldTask.status, "Task status should remain unchanged");
        assert.strictEqual(updatedTask.createdAt.getTime(), oldTask.createdAt.getTime(), "Task createdAt should remain unchanged");
    });

    // **ÉTANT DONNÉ QUE** j'ai une tâche existante,
    // **LORSQUE** je modifie sa description avec une valeur valide,
    // **ALORS** la nouvelle description est sauvegardée et les autres champs restent inchangés
    it('should update the description of an existing task', async () => {
        let oldTask: Task;
        let updatedTask: Task;

        try {
            oldTask = await taskService.getTaskById(1);
        } catch (error) {
            assert.fail("Task with ID 1 should exist");
        }

        try {
            updatedTask = await taskService.updateTask(1, undefined, "Updated Task Description");
        } catch (error) {
            assert.fail("Task with ID 1 should be updated");
        }

        assert.strictEqual(updatedTask.description, "Updated Task Description", "Task description should be updated");
        assert.strictEqual(updatedTask.id, oldTask.id, "Task ID should remain the same");
        assert.strictEqual(updatedTask.title, oldTask.title, "Task title should remain unchanged");
        assert.strictEqual(updatedTask.status, oldTask.status, "Task status should remain unchanged");
        assert.strictEqual(updatedTask.createdAt.getTime(), oldTask.createdAt.getTime(), "Task createdAt should remain unchanged");
    });

    // **ÉTANT DONNÉ QUE** j'ai une tâche existante,
    // **LORSQUE** je modifie à la fois le titre et la description,
    // **ALORS** les deux modifications sont sauvegardées
    it('should update both title and description of an existing task', async () => {
        let oldTask: Task;
        let updatedTask: Task;

        try {
            oldTask = await taskService.getTaskById(1);
        } catch (error) {
            assert.fail("Task with ID 1 should exist");
        }

        try {
            updatedTask = await taskService.updateTask(1, "Updated Task Title Again", "Updated Task Description Again");
        } catch (error) {
            assert.fail("Task with ID 1 should be updated");
        }

        assert.strictEqual(updatedTask.title, "Updated Task Title Again", "Task title should be updated");
        assert.strictEqual(updatedTask.description, "Updated Task Description Again", "Task description should be updated");
        assert.strictEqual(updatedTask.id, oldTask.id, "Task ID should remain the same");
        assert.strictEqual(updatedTask.status, oldTask.status, "Task status should remain unchanged");
        assert.strictEqual(updatedTask.createdAt.getTime(), oldTask.createdAt.getTime(), "Task createdAt should remain unchanged");
    });

    // **ÉTANT DONNÉ QUE** je tente de modifier le titre d'une tâche avec une valeur vide,
    // **LORSQUE** je soumets la modification,
    // **ALORS** j'obtiens une erreur "Title is required"
    it('should throw an error when trying to update the title with an empty value', async () => {
        try {
            await taskService.updateTask(1, "  ", undefined);
            assert.fail("Expected an error to be thrown");
        } catch (error: any) {
            assert.strictEqual(error.message, "Title is required", "Error message should be 'Title is required'");
        }
    });

    // **ÉTANT DONNÉ QUE** je tente de modifier une tâche avec un titre de plus de 100 caractères,
    // **LORSQUE** je soumets,
    // **ALORS** j'obtiens une erreur "Title cannot exceed 100 characters"
    it('should throw an error when trying to update the title with more than 100 characters', async () => {
        try {
            await taskService.updateTask(1, "a".repeat(101), undefined);
            assert.fail("Expected an error to be thrown");
        } catch (error: any) {
            assert.strictEqual(error.message, "Title cannot exceed 100 characters", "Error message should be 'Title cannot exceed 100 characters'");
        }
    });

    // **ÉTANT DONNÉ QUE** je tente de modifier une tâche avec une description de plus de 500 caractères,
    // **LORSQUE** je soumets,
    // **ALORS** j'obtiens une erreur "Description cannot exceed 500 characters"
    it('should throw an error when trying to update the description with more than 500 characters', async () => {
        try {
            await taskService.updateTask(1, undefined, "b".repeat(501));
            assert.fail("Expected an error to be thrown");
        } catch (error: any) {
            assert.strictEqual(error.message, "Description cannot exceed 500 characters", "Error message should be 'Description cannot exceed 500 characters'");
        }
    });

    // **ÉTANT DONNÉ QUE** je tente de modifier une tâche inexistante,
    // **LORSQUE** j'utilise un ID invalide,
    // **ALORS** j'obtiens une erreur "Task not found"
    it('should throw an error when trying to update a non-existent task', async () => {
        try {
            await taskService.updateTask(999, "Non-existent Task", "This task does not exist");
            assert.fail("Expected an error to be thrown");
        } catch (error: any) {
            assert.strictEqual(error.message, "Task not found", "Error message should be 'Task not found'");
        }
    });

    // **ÉTANT DONNÉ QUE** je tente de modifier des champs non modifiables (ID, date de création, statut),
    // **LORSQUE** je soumets ces modifications,
    // **ALORS** ces champs sont ignorés et seuls titre/description sont pris en compte
    it('should ignore non-modifiable fields (ID, createdAt, status) when updating a task', async () => {
        let oldTask: Task;
        let updatedTask: Task;

        try {
            oldTask = await taskService.getTaskById(1);
        } catch (error) {
            assert.fail("Task with ID 1 should exist");
        }

        try {
            updatedTask = await taskService.updateTask(1, "Updated Task Title Again", "Updated Task Description Again");
        } catch (error) {
            assert.fail("Task with ID 1 should be updated");
        }

        assert.strictEqual(updatedTask.id, oldTask.id, "Task ID should remain unchanged");
        assert.strictEqual(updatedTask.createdAt.getTime(), oldTask.createdAt.getTime(), "Task createdAt should remain unchanged");
        assert.strictEqual(updatedTask.status, oldTask.status, "Task status should remain unchanged");
        assert.strictEqual(updatedTask.title, "Updated Task Title Again", "Task title should be updated");
        assert.strictEqual(updatedTask.description, "Updated Task Description Again", "Task description should be updated");
    });

    // **ÉTANT DONNÉ QUE** j'ai supprimé une tâche,
    // **LORSQUE** je tente de la modifier par son ID,
    // **ALORS** j'obtiens une erreur "Task not found"
    it('should throw an error when trying to update a deleted task', async () => {
        
        try {
            await taskService.deleteTask(1);
        } catch (error) {
            assert.fail("Task should be deleted");
        }

        try {
            await taskService.updateTask(1, "Updated Task", "This task has been updated");
            assert.fail("Task should not exist after deletion");
        } catch (error: any) {
            assert.strictEqual(error.message, "Task not found", "Error message should be 'Task not found'");
        }
    });
});
