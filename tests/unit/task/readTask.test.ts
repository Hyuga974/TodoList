/*
**En tant qu'** utilisateur,  
**Je veux** consulter les détails complets d'une tâche existante,  
**Afin de** voir toutes les informations associées.

**Critères d'acceptation :**
- **ÉTANT DONNÉ QUE** j'ai une tâche existante avec ID valide, **LORSQUE** je consulte cette tâche, **ALORS** j'obtiens tous ses détails : ID, titre, description, statut, date de création, etc..
- **ÉTANT DONNÉ QUE** je consulte une tâche avec un ID inexistant, **LORSQUE** je fais la demande, **ALORS** j'obtiens une erreur "Task not found" avec, si web, le code 404
- **ÉTANT DONNÉ QUE** je consulte une tâche avec un ID au mauvais format, **LORSQUE** je fais la demande, **ALORS** j'obtiens une erreur "Invalid ID format"
*/

import assert from "assert";
import { TaskService } from "../../../src/services/taskService";
import { Task } from "../../../src/models/task";
import { openDB, Database } from '../../../src/db/index';
import fs from "fs";

const testDbPath = 'test-read-task.sqlite';

describe('Read Task', () => {
    let taskService: TaskService;
    let db: Database;

    beforeAll(async () => {
        // Remove existing test database if it exists
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
        if (db) await db.close();
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


    // **ÉTANT DONNÉ QUE** j'ai une tâche existante avec ID valide,
    // **LORSQUE** je consulte cette tâche,
    // **ALORS** j'obtiens tous ses détails : ID, titre, description, statut, date de création, etc.
    it('should return the details of an existing task', async () => {
        let task: Task;

        try {
            task = await taskService.getTaskById(1);
        } catch (error) {
            assert.fail("Task with ID 1 should exist");
        }

        assert.ok(task.id > 0, "Task ID should be greater than 0");
        assert.ok(task.title !== null, "Task title should not be null");
        assert.ok(task.description !== null, "Task description should not be null");
        assert.strictEqual(task.status, "waiting", "Task status should be 'waiting'");
        assert.ok(task.createdAt instanceof Date, "Task createdAt should be a Date object");
    });

    // **ÉTANT DONNÉ QUE** je consulte une tâche avec un ID inexistant,
    // **LORSQUE** je fais la demande,
    // **ALORS** j'obtiens une erreur "Task not found"
    it('should throw an error when trying to read a task with a non-existent ID', async () => {
        try {
            await taskService.getTaskById(999);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Task not found", "Error message should be 'Task not found'");
        }
    });

    // **ÉTANT DONNÉ QUE** je consulte une tâche avec un ID au mauvais format,
    // **LORSQUE** je fais la demande,
    // **ALORS** j'obtiens une erreur "Invalid ID format"
    it('should throw an error when trying to read a task with an invalid ID format', async () => {
        try {
            await taskService.getTaskById(-1);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Invalid ID format", "Error message should be 'Invalid ID format'");
        }

        try {
            await taskService.getTaskById(0); // Zero ID
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Invalid ID format", "Error message should be 'Invalid ID format'");
        }
    });

    // **ÉTANT DONNÉ QUE** j'ai supprimé une tâche,
    // **LORSQUE** je tente de la consulter par son ID,
    // **ALORS** j'obtiens une erreur "Task not found"
    it('should throw an error when trying to read a deleted task', async () => {
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
    });
});
