/*
**En tant qu'** utilisateur,  
**Je veux** trier mes tâches par date de création, titre ou statut,  
**Afin de** organiser l'affichage selon mes besoins.

**Critères d'acceptation :**
- **ÉTANT DONNÉ QUE** j'ai plusieurs tâches, **LORSQUE** je trie par date de création ascendante, **ALORS** les tâches sont affichées de la plus ancienne à la plus récente
- **ÉTANT DONNÉ QUE** j'ai plusieurs tâches, **LORSQUE** je trie par date de création descendante, **ALORS** les tâches sont affichées de la plus récente à la plus ancienne
- **ÉTANT DONNÉ QUE** j'ai plusieurs tâches, **LORSQUE** je trie par titre ascendant, **ALORS** les tâches sont affichées par ordre alphabétique
- **ÉTANT DONNÉ QUE** j'ai plusieurs tâches, **LORSQUE** je trie par titre descendant, **ALORS** les tâches sont affichées par ordre alphabétique inversé
- **ÉTANT DONNÉ QUE** j'ai plusieurs tâches, **LORSQUE** je trie par statut, **ALORS** les tâches sont groupées par statut dans l'ordre : TODO, ONGOING, DONE
- **ÉTANT DONNÉ QUE** je ne spécifie pas de tri, **LORSQUE** je consulte la liste, **ALORS** les tâches sont triées par date de création descendante par défaut
- **ÉTANT DONNÉ QUE** je spécifie un critère de tri invalide, **LORSQUE** je fais la demande, **ALORS** j'obtiens une erreur "Invalid sort criteria"
- **ÉTANT DONNÉ QUE** je combine tri et filtre, **LORSQUE** j'applique les deux, **ALORS** le tri s'applique sur les résultats filtrés
*/
import assert from "assert";
import { TaskService } from "../../../src/services/taskService";
import { Task } from "../../../src/models/task";
import { openDB, Database } from '../../../src/db/index';
import fs from "fs";

const testDbPath = 'test-sort-task.sqlite';

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



    // **ÉTANT DONNÉ QUE** j'ai plusieurs tâches,
    // **LORSQUE** je trie par date de création ascendante,
    // **ALORS** les tâches sont affichées de la plus ancienne à la plus récente
    it("should sort tasks by creation date ascending", async () => {
        
        try {
            await db.run(
                'INSERT INTO tasks (title, description, createdAt, status) VALUES (?, ?, ?, ?)',
                ["Old Task", "This task is older", new Date("2020-01-01").toISOString(), "waiting"]
            );;
        } catch (error) {
            assert.fail("Expected no error when creating task with old date");
        }
        let result : Task[] = [];
        try {
            result = await taskService.searchTasks("", "", "date", "asc");
        } catch (error) {
            assert.fail("Expected no error when sorting tasks by creation date ascending");
        }
        assert.strictEqual(result.length, 3, "Should return 3 tasks sorted by creation date ascending");
        assert.strictEqual(result[0].title, "Old Task", "The first task should be the oldest");
    });

    // **ÉTANT DONNÉ QUE** j'ai plusieurs tâches,
    // **LORSQUE** je trie par date de création descendante,
    // **ALORS** les tâches sont affichées de la plus récente à la plus ancienne
    it("should sort tasks by creation date descending", async () => {
        try {
            await db.run(
                'INSERT INTO tasks (title, description, createdAt, status) VALUES (?, ?, ?, ?)',
                ["New Task", "This task is newer", new Date("2025-08-01").toISOString(), "waiting"]
            );
        } catch (error) {
            assert.fail("Expected no error when creating task with new date");  
        }
        let result : Task[] = [];
        try {
            result = await taskService.searchTasks("", "", "date", "desc");
        } catch (error) {
            assert.fail("Expected no error when sorting tasks by creation date descending");
        }
        
        assert.strictEqual(result.length, 3, "Should return 3 tasks sorted by creation date descending");
        assert.strictEqual(result[0].title, "New Task", "The first task should be the newest");
    });

    // **ÉTANT DONNÉ QUE** j'ai plusieurs tâches,
    // **LORSQUE** je trie par titre ascendant,
    // **ALORS** les tâches sont affichées par ordre alphabétique
    it("should sort tasks by title ascending", async () => {
        try {
            await taskService.createTask("A Task", "This task has a title starting with A", new Date("2025-08-01"));
        } catch (error) {
            assert.fail("Expected no error when creating task with title B");
        }
        let result 
        try{
            result = await taskService.searchTasks("", "", "title", "asc");
        } catch (error) {
            assert.fail("Error occurred while sorting tasks by title ascending");
        }
        assert.strictEqual(result.length, 3, "Should return 3 tasks sorted by title ascending");
        assert.strictEqual(result[0].title, "A Task", "The first task should start with 'A'");
    });

    // **ÉTANT DONNÉ QUE** j'ai plusieurs tâches,
    // **LORSQUE** je trie par titre descendant,
    // **ALORS** les tâches sont affichées par ordre alphabétique inversé
    it("should sort tasks by title descending", async () => {
        try {
            await taskService.createTask("Z Task", "This task has a title starting with Z ", new Date("2025-08-01"));
        } catch (error) {
            assert.fail("Expected no error when creating task with title Z");
        }

        let result 
        try{
            result= await taskService.searchTasks("", "", "title", "desc");
        } catch (error) {
            assert.fail("Error occurred while sorting tasks by title descending");
        }
        assert.strictEqual(result.length, 3, "Should return 3 tasks sorted by title descending");
        assert.strictEqual(result[0].title, "Z Task", "The first task should start with 'Z'");
    });

    // **ÉTANT DONNÉ QUE** j'ai plusieurs tâches,
    // **LORSQUE** je trie par statut,
    // **ALORS** les tâches sont groupées par statut dans l'ordre : waiting, progress, completed
    it("should sort tasks by status", async () => {
        try {
            await taskService.createTask("Completed Task", "This task is completed", new Date(), "completed");
            await taskService.createTask("In Progress Task", "This task is in progress", new Date(), "progress");
        } catch (error) {
            assert.fail("Expected no error when creating tasks with different statuses");
        }

        let result : Task[] = [];
        try{
            result = await taskService.searchTasks("", "", "status", "asc");
        } catch (error) {
            assert.fail("Error occurred while sorting tasks by status");
        }

        assert.strictEqual(result.length, 4, "Should return 4 tasks sorted by status");
        
        const goodResult: Task[] = [
            {
                id: 1,
                title: "Test Task",
                description: "This is a test task",
                createdAt: new Date(),
                status: "waiting"
            },
            {
                id: 2,
                title: "Another Task",
                description: "This is another task",
                createdAt: new Date(),
                status: "waiting"
            },
            {
                id: 4,
                title: "In Progress Task",
                description: "This task is in progress",
                createdAt: new Date(),
                status: "progress"
            },
            {
                id: 3,
                title: "Completed Task",
                description: "This task is completed",
                createdAt: new Date(),
                status: "completed"
            }
        ]
        assert.strictEqual(result[0].status, "waiting", "The first tasks should have status 'waiting'");
        assert.strictEqual(result[2].status, "progress", "The next tasks should have status 'progress'");
        assert.strictEqual(result[3].status, "completed", "The last tasks should have status 'completed'");
    });

    // **ÉTANT DONNÉ QUE** je ne spécifie pas de tri,
    // **LORSQUE** je consulte la liste,
    // **ALORS** les tâches sont triées par date de création descendante par défaut
    it("should sort tasks by default date descending when no sort criteria is specified", async () => {
        let result 
        try {
            result = await taskService.searchTasks();
        } catch (error) {
            assert.fail("Expected no error when searching tasks without sort criteria");
        }
        const expectedTasks = [
            {
                id: 1,
                title: "Test Task",
                description: "This is a test task",
                createdAt: new Date(),
                status: "waiting"
            },
            {
                id: 2,
                title: "Another Task",
                description: "This is another task",
                createdAt: new Date(),
                status: "waiting"
            }
        ];
        assert.strictEqual(result.length, 2, "Should return 3 tasks sorted by default date descending");
    });

    // **ÉTANT DONNÉ QUE** je spécifie un critère de tri invalide,
    // **LORSQUE** je fais la demande,
    // **ALORS** j'obtiens une erreur "Invalid sort criteria"
    it("should throw an error for invalid sort criteria", async () => {
        try {
            await taskService.searchTasks("", "", "invalidCriteria");
            assert.fail("Expected error not thrown for invalid sort criteria");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Invalid sort criteria", "Should throw error for invalid sort criteria");
        }
    });

    // **ÉTANT DONNÉ QUE** je combine tri et filtre,
    // **LORSQUE** j'applique les deux,
    // **ALORS** le tri s'applique sur les résultats filtrés
    it("should apply sort on filtered results", async () => {
        try {
            await taskService.createTask("In Progress Task", "This task is in progress", new Date(), "progress");
            await taskService.createTask("Waiting Task", "This task is waiting", new Date(), "waiting");
            await taskService.createTask("Completed Task", "This task is completed", new Date(), "completed");
        } catch (error) {
            assert.fail("Expected no error when creating task with status 'progress'");
        }

        let result 
        try {
            result = await taskService.searchTasks("", "waiting", "title", "desc");
        } catch (error){
            assert.fail((error as Error).message);
        }
        assert.strictEqual(result.length, 3, "Should return 3 tasks sorted and filtered");
        assert.strictEqual(result[0].title, "Waiting Task", "The first task should be 'Waiting Task'");
    });
});
