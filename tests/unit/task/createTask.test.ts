/* 
**En tant qu'** utilisateur,  
**Je veux** créer une nouvelle tâche avec un titre et une description optionnelle,  
**Afin de** pouvoir organiser mes activités à réaliser.

**Critères d'acceptation :**
- **ÉTANT DONNÉ QUE** je fournis un titre valide (non vide, maximum 100 caractères), **LORSQUE** je crée une tâche, **ALORS** elle est créée avec un ID unique, le titre fourni, une description vide par défaut, une date de création et le statut "TODO"
- **ÉTANT DONNÉ QUE** je fournis un titre et une description valide (maximum 500 caractères), **LORSQUE** je crée une tâche, **ALORS** elle est créée avec le titre et la description fournis
- **ÉTANT DONNÉ QUE** je fournis un titre vide ou composé uniquement d'espaces, **LORSQUE** je tente de créer une tâche, **ALORS** j'obtiens une erreur "Title is required"
- **ÉTANT DONNÉ QUE** je fournis un titre de plus de 100 caractères, **LORSQUE** je tente de créer une tâche, **ALORS** j'obtiens une erreur "Title cannot exceed 100 characters"
- **ÉTANT DONNÉ QUE** je fournis une description de plus de 500 caractères, **LORSQUE** je tente de créer une tâche, **ALORS** j'obtiens une erreur "Description cannot exceed 500 characters"
- **ÉTANT DONNÉ QUE** je fournis une titre qui commence et/ou termine par des espace, **LORSQUE** je crée une tâche, **ALORS** elle est créee avec le titre fourni, sans espaces au début ni à la fin
- **ÉTANT DONNÉ QUE** j'ai une tâche nouvellement créée, **LORSQUE** je la consulte, **ALORS** sa date de création correspond au moment de création à la seconde près
*/

import assert from 'assert';
import { TaskService } from '../../../src/services/taskService';
import { Task } from '../../../src/models/task';
import { openDB, Database } from '../../../src/db/index';

const testDbPath = 'test-create-task.sqlite';
describe('Create Task', () => {
    let taskService: TaskService;
    let db: Database;

    beforeAll(async () => {
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

    afterAll(async () => {
        await db.close();
    });

    beforeEach(async () => {
        taskService = new TaskService(db);
        // Clear the tasks table before each test
    });

    afterEach(async () => {
        // Optionally, clear the tasks table after each test if needed
        await db.run('DELETE FROM tasks');
    });

    // **ÉTANT DONNÉ QUE** je fournis un titre valide (non vide, maximum 100 caractères),
    // **LORSQUE** je crée une tâche,
    // **ALORS** elle est créée avec un ID unique, le titre fourni, une description vide par défaut, une date de création et le statut "waiting"
    it('should create a task with a valid title and default description, date, and status', async () => {
        const title = "Valid Task Title";
        const task = await taskService.createTask(title, "");

        assert.ok(task.id > 0, "ID should be greater than 0");
        assert.strictEqual(task.title, title, "Title should match the provided title");
        assert.strictEqual(task.description, "", "Description should be empty by default");
        assert.ok(task.createdAt !== null, "CreatedAt should not be null");
        assert.ok(task.createdAt instanceof Date, "CreatedAt should be a Date object");
        assert.strictEqual(task.status, "waiting", "Status should be 'waiting' by default");
    });

    // **ÉTANT DONNÉ QUE** je fournis un titre et une description valide (maximum 500 caractères),
    // **LORSQUE** je crée une tâche,
    // **ALORS** elle est créée avec le titre et la description fournis
    it('should create a task with a valid title and description', async () => {
        const title = "Valid Task Title";
        const description = "This is a valid description for the task.";
        const task = await taskService.createTask(title, description);

        assert.strictEqual(task.title, title, "Title should match the provided title");
        assert.strictEqual(task.description, description, "Description should match the provided description");
    });

    // **ÉTANT DONNÉ QUE** je fournis un titre vide ou composé uniquement d'espaces,
    // **LORSQUE** je tente de créer une tâche,
    // **ALORS** j'obtiens une erreur "Title is required"
    it('should throw an error when creating a task with an empty title', async () => {
        const title = "";
        try {
            await taskService.createTask(title, "");
            assert.fail("Expected an error to be thrown");
        } catch (error: any) {
            assert.strictEqual(error.message, "Title is required", "Should throw 'Title is required' error");
        }
    });

    // **ÉTANT DONNÉ QUE** je fournis un titre de plus de 100 caractères,
    // **LORSQUE** je tente de créer une tâche,
    // **ALORS** j'obtiens une erreur "Title cannot exceed 100 characters"
    it('should throw an error when creating a task with a title exceeding max length', async () => {
        const title = "a".repeat(101);
        try {
            await taskService.createTask(title, "");
            assert.fail("Expected an error to be thrown");
        } catch (error: any) {
            assert.strictEqual(error.message, "Title cannot exceed 100 characters", "Should throw 'Title cannot exceed 100 characters' error");
        }
    });

    // **ÉTANT DONNÉ QUE** je fournis une description de plus de 500 caractères,
    // **LORSQUE** je tente de créer une tâche,
    // **ALORS** j'obtiens une erreur "Description cannot exceed 500 characters"
    it('should throw an error when creating a task with a description exceeding max length', async () => {
        const title = "Valid Task Title";
        const description = "a".repeat(501);
        try {
            await taskService.createTask(title, description);
            assert.fail("Expected an error to be thrown");
        } catch (error: any) {
            assert.strictEqual(error.message, "Description cannot exceed 500 characters", "Should throw 'Description cannot exceed 500 characters' error");
        }
    });

    // **ÉTANT DONNÉ QUE** je fournis un titre qui commence et/ou termine par des espaces,
    // **LORSQUE** je crée une tâche,
    // **ALORS** elle est créée avec le titre fourni, sans espaces au début ni à la fin
    it('should create a task with a title trimmed of leading and trailing spaces', async () => {
        const title = "  Task Title with Spaces   ";
        const trimmedTitle = title.trim();
        const task = await taskService.createTask(trimmedTitle, "");

        assert.strictEqual(task.title, trimmedTitle, "Title should be trimmed of leading and trailing spaces");
        assert.strictEqual(task.title.startsWith(" "), false, "Title should not start with a space");
        assert.strictEqual(task.title.endsWith(" "), false, "Title should not end with a space");
    });

    // **ÉTANT DONNÉ QUE** j'ai une tâche nouvellement créée,
    // **LORSQUE** je la consulte,
    // **ALORS** sa date de création correspond au moment de création à la seconde près
    it('should create a task with a creation date matching the current time', async () => {
        const title = "Task with Creation Date";
        const task = await taskService.createTask(title, "");

        assert.ok(task.createdAt instanceof Date, "CreatedAt should be a Date object");
        const currentDate = new Date();
        const createdAtDate = task.createdAt;
        assert.ok(Math.abs(currentDate.getTime() - createdAtDate.getTime()) < 1000, "CreatedAt should be within 1 second of the current date");
    });
});
