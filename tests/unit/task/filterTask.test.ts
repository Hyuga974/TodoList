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

import assert from "assert";
import { TaskService } from "../../../src/services/taskService";
import { openDB, Database } from '../../../src/db/index';
import fs from "fs";

const testDbPath = 'test-filter-task.sqlite';

describe('Filter Task', () => {
    let taskService: TaskService;
    let db: Database;

    beforeAll(async () => {
        // Remove existing test database if it exists
        if (fs.existsSync(testDbPath)) {
            fs.unlinkSync(testDbPath);
        }

        db = openDB(testDbPath) as unknown as Database;
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
        
        await db.run(`DROP TABLE IF EXISTS tasks`);
        await db.run(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                createdAt DATETIME NOT NULL,
                status TEXT NOT NULL
            )
        `);

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

    // **ÉTANT DONNÉ QUE** j'ai des tâches avec différents statuts,
    // **LORSQUE** je filtre par "waiting", "progress" ou "completed",
    // **ALORS** seules les tâches avec le statut correspondant sont retournées
    it("should return tasks with the status 'waiting'", async () => {
        await db.run(
            'INSERT INTO tasks (title, description, createdAt, status) VALUES (?, ?, ?, ?)',
            ["In Progress Task", "This task is in progress", new Date().toISOString(), "progress"]
        );
        await db.run(
            'INSERT INTO tasks (title, description, createdAt, status) VALUES (?, ?, ?, ?)',
            ["Completed Task", "This task is completed", new Date().toISOString(), "completed"]
        );
        const result = await taskService.searchTasks("", "waiting");
        assert.strictEqual(result.length, 2, "Should return tasks with the status 'waiting'");
    });

    it("should return tasks with the status 'progress'", async () => {
        await db.run(
            'INSERT INTO tasks (title, description, createdAt, status) VALUES (?, ?, ?, ?)',
            ["In Progress Task", "This task is in progress", new Date().toISOString(), "progress"]
        );

        const result = await taskService.searchTasks("", "progress");
        assert.strictEqual(result.length, 1, "Should return tasks with the status 'progress'");
    });

    it("should return tasks with the status 'completed'", async () => {
        await db.run(
            'INSERT INTO tasks (title, description, createdAt, status) VALUES (?, ?, ?, ?)',
            ["Completed Task", "This task is completed", new Date().toISOString(), "completed"]
        );

        const result = await taskService.searchTasks("", "completed");
        assert.strictEqual(result.length, 1, "Should return tasks with the status 'completed'");
    });

    // **ÉTANT DONNÉ QUE** je filtre par un statut et qu'aucune tâche ne correspond,
    // **LORSQUE** j'applique le filtre,
    // **ALORS** j'obtiens une liste vide
    it("should return an empty list when no tasks match the status 'completed'", async () => {
        const result = await taskService.searchTasks("", "completed");
        assert.strictEqual(result.length, 0, "Should return an empty list when no tasks match the status 'completed'");
    });

    // **ÉTANT DONNÉ QUE** je filtre par un statut invalide,
    // **LORSQUE** j'applique le filtre,
    // **ALORS** j'obtiens une erreur "Invalid filter status"
    it("should throw an error when filtering by an invalid status", async () => {
        let errorThrown = false;
        try {
            await taskService.searchTasks("", "abc");
        } catch (error) {
            errorThrown = true;
            assert.strictEqual((error as Error).message, "Invalid filter status", "Error message should be 'Invalid filter status'");
        }
        
        if (!errorThrown) {
            assert.fail("Expected an error to be thrown");
        }
    });

    // **ÉTANT DONNÉ QUE** je filtre par statut et que j'ai de nombreux résultats,
    // **LORSQUE** j'applique le filtre,
    // **ALORS** les résultats sont paginés
    it("should paginate results when filtering by status with many results", async () => {
        
    });
});
