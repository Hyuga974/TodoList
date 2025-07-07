/*
**En tant qu'** utilisateur,  
**Je veux** consulter la liste des utilisateurs disponibles,  
**Afin de** savoir à qui je peux assigner des tâches.

**Critères d'acceptation :**
- **ÉTANT DONNÉ QUE** j'ai plusieurs utilisateurs créés, **LORSQUE** je demande la liste des utilisateurs, **ALORS** j'obtiens tous les utilisateurs avec leurs informations (ID, nom, email)
- **ÉTANT DONNÉ QUE** j'ai de nombreux utilisateurs, **LORSQUE** je demande la liste avec pagination, **ALORS** les utilisateurs sont paginés comme les tâches
- **ÉTANT DONNÉ QUE** je n'ai aucun utilisateur, **LORSQUE** je demande la liste, **ALORS** j'obtiens une liste vide
- **ÉTANT DONNÉ QUE** je demande la liste des utilisateurs, **LORSQUE** j'exécute la requête, **ALORS** les utilisateurs sont triés par nom par défaut
*/
import { Database, openDB } from '../../../src/db';
import assert from 'assert';
import { UserService } from '../../../src/services/userService';



describe('Creation User', () => {
    let db: Database;
    beforeAll(async () => {
        db = openDB();
        await db.run(`
            CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(36) PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            createdAt DATETIME
            )`);

        // Log the schema to verify the unique constraint
        const tableInfo = await db.all("PRAGMA table_info(users)");
        });


  afterAll(async () => {
    await db.close();
  });
    beforeEach(async () => {
        await UserService.deleteAllUsers();
        await UserService.createUser("John Doe", "john.doe@mail.com");
        await UserService.createUser("Sarah Conor", "sarah.conor@mail.com");
        await UserService.createUser("Hyuga Neiji", "hyuga.neiji@mail.com");
    });
    afterEach(async () => {
        await UserService.deleteAllUsers(); 
    });

    // **ÉTANT DONNÉ QUE** j'ai plusieurs utilisateurs créés, 
    // **LORSQUE** je demande la liste des utilisateurs, 
    // **ALORS** j'obtiens tous les utilisateurs avec leurs informations (ID, nom, email)

    it('should list all users with their information', async () => {
        const users = await UserService.listUsers();
        assert.strictEqual(users.length, 3, "Should return 3 users");
        assert.strictEqual(users[0].name, "Hyuga Neiji", "First user should be Hyuga Neiji");
        assert.strictEqual(users[0].email, "hyuga.neiji@mail.com", "First user email should be");
        assert.strictEqual(users[1].name, "John Doe", "Second user should be John Doe");
        assert.strictEqual(users[1].email, "john.doe@mail.com", "Second user email should be");
        assert.strictEqual(users[2].name, "Sarah Conor", "Third user should be Sarah Conor");
        assert.strictEqual(users[2].email, "sarah.conor@mail.com", "Third user email should be");
        assert.ok(users[0].id, "First user should have an ID");
        assert.ok(users[1].id, "Second user should have an ID");
        assert.ok(users[2].id, "Third user should have an ID");

    });

    // **ÉTANT DONNÉ QUE** j'ai de nombreux utilisateurs,
    // **LORSQUE** je demande la liste avec pagination,
    // **ALORS** les utilisateurs sont paginés comme les tâches
    it('should paginate users like tasks', async () => {
    });

    // **ÉTANT DONNÉ QUE** je n'ai aucun utilisateur,
    // **LORSQUE** je demande la liste,
    // **ALORS** j'obtiens une liste vide
    it('should return an empty list when no users exist', async () => {
        await UserService.deleteAllUsers();
        const users = await UserService.listUsers();
        assert.strictEqual(users.length, 0, "Should return an empty list");
    });

    // **ÉTANT DONNÉ QUE** je demande la liste des utilisateurs, 
    // **LORSQUE** j'exécute la requête, 
    // **ALORS** les utilisateurs sont triés par nom par défaut
    it('should return users sorted by name by default', async () => {
        const users = await UserService.listUsers();
        assert.strictEqual(users.length, 3, "Should return 3 users");
        assert.strictEqual(users[0].name, "Hyuga Neiji", "First user should be Hyuga Neiji");
        assert.strictEqual(users[1].name, "John Doe", "Second user should be John Doe");
        assert.strictEqual(users[2].name, "Sarah Conor", "Third user should be Sarah Conor");
    });
});
