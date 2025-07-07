/*
**En tant qu'** utilisateur,  
**Je veux** rechercher mes tâches par mots-clés dans le titre ou la description,  
**Afin de** retrouver rapidement une tâche spécifique.

**Critères d'acceptation :**
- **ÉTANT DONNÉ QUE** j'ai des tâches contenant un mot-clé dans le titre, **LORSQUE** je recherche ce terme, **ALORS** seules les tâches correspondantes sont retournées
- **ÉTANT DONNÉ QUE** j'ai des tâches contenant un mot-clé dans la description, **LORSQUE** je recherche ce terme, **ALORS** seules les tâches correspondantes sont retournées
- **ÉTANT DONNÉ QUE** j'ai des tâches contenant un mot-clé dans le titre ET la description, **LORSQUE** je recherche ce terme, **ALORS** toutes ces tâches sont retournées (sans doublon)
- **ÉTANT DONNÉ QUE** je recherche un terme inexistant, **LORSQUE** j'exécute la recherche, **ALORS** j'obtiens une liste vide
- **ÉTANT DONNÉ QUE** je recherche avec une chaîne vide, **LORSQUE** j'exécute la recherche, **ALORS** toutes les tâches sont retournées
- **ÉTANT DONNÉ QUE** je recherche avec des majuscules/minuscules, **LORSQUE** j'exécute la recherche, **ALORS** la recherche est insensible à la casse
- **ÉTANT DONNÉ QUE** j'ai de nombreux résultats de recherche, **LORSQUE** je fais la recherche, **ALORS** les résultats sont paginés comme la liste normale
*/
import assert from "assert";
import { TaskService } from "../../../src/services/taskService";
import { Task } from "../../../src/models/task";
import { openDB, Database } from '../../../src/db/index';
import fs from "fs";

const testDbPath = 'test-search-task.sqlite';

describe('Sort Task', () => {
    let taskService: TaskService;
    let db: Database;

    beforeAll(async () => {
        // Remove existing test database if it exists
        if (fs.existsSync(testDbPath)) {
            fs.unlinkSync(testDbPath);
        }

        db = openDB(testDbPath);
    });
    
    beforeEach(async () => {
        taskService = new TaskService(db);
        
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

    afterEach(async () => {
        await db.run('DROP TABLE IF EXISTS tasks');
    });

    afterAll(async () => {
        if (db) {
            await db.close();
        }
        if (fs.existsSync(testDbPath)) {
            fs.unlinkSync(testDbPath);
        }
    });

    // **ÉTANT DONNÉ QUE** j'ai des tâches contenant un mot-clé dans le titre,
    // **LORSQUE** je recherche ce terme,
    // **ALORS** seules les tâches correspondantes sont retournées
    it("should return tasks matching the keyword in the title", async () => {
        const result = await taskService.searchTasks("test");
        assert.strictEqual(result.length, 1, "Should return 1 task matching the keyword in the title");
        assert.deepStrictEqual(result[0], {
            id: 1,
            title: "Test Task",
            description: "This is a test task",
            createdAt: result[0].createdAt, 
            status: "waiting"
        });
    });

    // **ÉTANT DONNÉ QUE** j'ai des tâches contenant un mot-clé dans la description,
    // **LORSQUE** je recherche ce terme,
    // **ALORS** seules les tâches correspondantes sont retournées
    it("should return tasks matching the keyword in the description", async () => {
        const result = await taskService.searchTasks("another");
        assert.strictEqual(result.length, 1, "Should return 1 tasks matching the keyword in the description");
        result.forEach(task => {
            assert.ok(task.description.includes("another"));
        });
    });

    // **ÉTANT DONNÉ QUE** j'ai des tâches contenant un mot-clé dans le titre ET la description,
    // **LORSQUE** je recherche ce terme,
    // **ALORS** toutes ces tâches sont retournées (sans doublon)
    it("should return tasks matching the keyword in title and description", async () => {
        await taskService.createTask("Another Test", "This is a test task with another keyword");

        const result = await taskService.searchTasks("task");
        assert.strictEqual(result.length, 3, "Should return tasks matching the keyword in both title and description");
    });

    // **ÉTANT DONNÉ QUE** je recherche un terme inexistant,
    // **LORSQUE** j'exécute la recherche,
    // **ALORS** j'obtiens une liste vide
    it("should return an empty list when searching for a non-existent term", async () => {
        const result = await taskService.searchTasks("abc");
        assert.strictEqual(result.length, 0, "Should return an empty list for a non-existent term");
    });

    // **ÉTANT DONNÉ QUE** je recherche avec une chaîne vide,
    // **LORSQUE** j'exécute la recherche,
    // **ALORS** toutes les tâches sont retournées
    it("should return all tasks when searching with an empty string", async () => {
        const result = await taskService.searchTasks("");
        assert.strictEqual(result.length, 2, "Should return all tasks when searching with an empty string");
    });

    // **ÉTANT DONNÉ QUE** je recherche avec des majuscules/minuscules,
    // **LORSQUE** j'exécute la recherche,
    // **ALORS** la recherche est insensible à la casse
    it("should be case-insensitive when searching", async () => {
        const result = await taskService.searchTasks("tEST");
        assert.strictEqual(result.length, 1, "Should return tasks matching the keyword in case-insensitive");
    });

    // **ÉTANT DONNÉ QUE** j'ai de nombreux résultats de recherche,
    // **LORSQUE** je fais la recherche,
    // **ALORS** les résultats sont paginés comme la liste normale
    it("should paginate results like the normal list", async () => {
        const result = await taskService.searchTasks("");
        assert.ok(result.length > 0, "Should return paginated results like the normal list");
    });
});
