/*
**En tant qu'** utilisateur,  
**Je veux** supprimer définitivement une tâche,  
**Afin de** nettoyer ma liste des tâches devenues inutiles.

**Critères d'acceptation :**
- **ÉTANT DONNÉ QUE** j'ai une tâche existante, **LORSQUE** je la supprime, **ALORS** elle n'apparaît plus dans la liste des tâches
- **ÉTANT DONNÉ QUE** j'ai supprimé une tâche, **LORSQUE** je tente de la consulter, de la supprimer, de la modifier ou de change son status par son ID, **ALORS** j'obtiens une erreur "Task not found"
*/

import assert from "assert";
import { TaskService } from "../../../src/services/taskService";
import { Task } from "../../../src/models/task";
import { openDB } from '../../../src/db/index';
import type { Database } from 'sqlite3';
import fs from 'fs';

const testDbPath = 'test-delete-task.sqlite';

describe('Delete Task', () => {
    let taskService: TaskService;
    let db: Database;

    beforeAll(async () => {
        if (fs.existsSync(testDbPath)) {
            fs.unlinkSync(testDbPath);
        }

        db = openDB(testDbPath) as unknown as Database;
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
    // **LORSQUE** je la supprime,
    // **ALORS** elle n'apparaît plus dans la liste des tâches
    it('should delete an existing task', async () => {
        const tasksBeforeDeletion = await taskService.getAllTasks();
        assert.strictEqual(tasksBeforeDeletion.length, 2, "There should be two tasks in the list initially");

        try {
            await taskService.deleteTask(1);
        } catch (error) {
            assert.fail("Task should be deleted");
        }

        try {
            await taskService.getTaskById(1);
            assert.fail("Task should not exist after deletion");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Task not found", "Error message should be 'Task not found'");
        }

        const tasksAfterDeletion = await taskService.getAllTasks();
        assert.strictEqual(tasksAfterDeletion.length, 1, "There should be only one task left in the list after deletion");
    });

    // **ÉTANT DONNÉ QUE** j'ai supprimé une tâche,
    // **LORSQUE** je tente de la consulter, de la supprimer, de la modifier ou de changer son statut par son ID,
    // **ALORS** j'obtiens une erreur "Task not found"
    it('should throw an error when trying to access a deleted task', async () => {
        const tasksBeforeDeletion = await taskService.getAllTasks();
        assert.strictEqual(tasksBeforeDeletion.length, 2, "There should be two tasks in the list initially");

        try {
            await taskService.deleteTask(1);
        } catch (error) {
            assert.fail("Task should be deleted");
        }

        try {
            await taskService.getTaskById(1);
            assert.fail("Task should not exist after deletion");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Task not found", "Error message should be 'Task not found'");
        }

        try {
            await taskService.deleteTask(1);
            assert.fail("Task should not exist after deletion");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Task not found", "Error message should be 'Task not found'");
        }

        try {
            await taskService.updateTask(1, "Updated Task", "This task has been updated");
            assert.fail("Task should not exist after deletion");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Task not found", "Error message should be 'Task not found'");
        }
    });
});
