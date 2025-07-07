/*
**En tant qu'** utilisateur,  
**Je veux** faire évoluer le statut d'une tâche (TODO → ONGOING → DONE),  
**Afin de** suivre l'avancement de mes activités.

**Critères d'acceptation :**
- **ÉTANT DONNÉ QUE** j'ai une tâche existante, **LORSQUE** je change son statut vers "TODO", "ONGOING" ou "DONE", **ALORS** le statut est mis à jour avec succès
- **ÉTANT DONNÉ QUE** je tente de changer le statut d'une tâche vers une valeur invalide, **LORSQUE** je soumets le changement, **ALORS** j'obtiens une erreur "Invalid status. Allowed values: TODO, ONGOING, DONE"
- **ÉTANT DONNÉ QUE** je tente de changer le statut d'une tâche inexistante, **LORSQUE** j'utilise un ID invalide, **ALORS** j'obtiens une erreur "Task not found"
*/

import assert from "assert";
import { TaskService } from "../../../src/services/taskService";
import { Task } from "../../../src/models/task";
import { openDB, Database } from '../../../src/db/index';
import fs from "fs";

const testDbPath = 'test-edit-status-task.sqlite';

describe('Sort Task', () => {
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
        if (db) {
            await db.close();
        }
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
    // **LORSQUE** je change son statut vers "TODO", "ONGOING" ou "DONE",
    // **ALORS** le statut est mis à jour avec succès
    it('should update the status of an existing task', async () => {
        let oldTask: Task;
        let updatedTask: Task;

        const tasksBeforeUpdate = await taskService.getAllTasks();
        assert.strictEqual(tasksBeforeUpdate.length, 2, "There should be two tasks in the list initially");

        try {
            oldTask = await taskService.getTaskById(1);
            assert.strictEqual(oldTask.status, "waiting", "Task status should initially be 'waiting'");
        } catch (error) {
            assert.fail("Task with ID 1 should exist");
        }

        try {
            updatedTask = await taskService.progressTask(1);
            assert.strictEqual(updatedTask.status, 'progress', "Task status should be updated to 'progress'");
            assert.strictEqual(updatedTask.id, oldTask.id, "Task ID should remain the same");
            assert.strictEqual(updatedTask.title, oldTask.title, "Task title should remain the same");
            assert.strictEqual(updatedTask.description, oldTask.description, "Task description should remain the same");
            assert.strictEqual(updatedTask.createdAt.getTime(), oldTask.createdAt.getTime(), "Task createdAt should remain the same");
        } catch (error) {
            assert.fail("Task with ID 1 should be updated to 'progress'");
        }

        try {
            updatedTask = await taskService.progressTask(1);
            assert.strictEqual(updatedTask.status, 'completed', "Task status should be updated to 'completed'");
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
    it('should throw an error when trying to update the status with an invalid value', async () => {
        let updatedTask: Task;
        let oldTask: Task;

        const tasksBeforeUpdate = await taskService.getAllTasks();
        assert.strictEqual(tasksBeforeUpdate.length, 2, "There should be two tasks in the list initially");

        try {
            oldTask = await taskService.getTaskById(1);
            assert.strictEqual(oldTask.status, "waiting", "Task status should initially be 'waiting'");
        } catch (error) {
            assert.fail("Task with ID 1 should exist");
        }

        try {
            let updatedTask = await taskService.progressTask(1);
            updatedTask = await taskService.progressTask(1);
            assert.strictEqual(updatedTask.status, 'completed', "Task status should be updated to 'completed'");
            assert.strictEqual(updatedTask.id, oldTask.id, "Task ID should remain the same");
            assert.strictEqual(updatedTask.title, oldTask.title, "Task title should remain the same");
            assert.strictEqual(updatedTask.description, oldTask.description, "Task description should remain the same");
            assert.strictEqual(updatedTask.createdAt.getTime(), oldTask.createdAt.getTime(), "Task createdAt should remain the same");
        } catch (error) {
            assert.fail("Task should be updated to 'completed'");
        }

        try {
            await taskService.progressTask(1);
            assert.fail("Task can't be upgraded from 'completed'");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Invalid status. Allowed values: waiting, progress, completed", "Error message should be 'Invalid status. Allowed values: waiting, progress, completed'");
        }
    });

    // **ÉTANT DONNÉ QUE** je tente de changer le statut d'une tâche inexistante,
    // **LORSQUE** j'utilise un ID invalide,
    // **ALORS** j'obtiens une erreur "Task not found"
    it('should throw an error when trying to update the status of a non-existent task', async () => {
        try {
            await taskService.progressTask(999);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Task not found", "Error message should be 'Task not found'");
        }
    });

    // **ÉTANT DONNÉ QUE** j'ai supprimé une tâche,
    // **LORSQUE** je tente de changer son statut par son ID,
    // **ALORS** j'obtiens une erreur "Task not found"
    it('should throw an error when trying to update the status of a deleted task', async () => {
        try {
            await taskService.deleteTask(1);
        } catch (error) {
            assert.fail("Task should be deleted");
        }

        try {
            await taskService.progressTask(1);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Task not found", "Error message should be 'Task not found'");
        }
    });
});
