/*
**En tant qu'** administrateur,  
**Je veux** créer un nouvel utilisateur avec nom et email,  
**Afin de** préparer l'assignation de tâches.

**Critères d'acceptation :**
- **ÉTANT DONNÉ QUE** je fournis un nom valide (non vide, maximum 50 caractères) et un email valide, **LORSQUE** je crée un utilisateur, **ALORS** il est créé avec un ID unique, le nom et l'email fournis ainsi que sa date de création
- **ÉTANT DONNÉ QUE** je fournis un email déjà utilisé par un autre utilisateur, **LORSQUE** je tente de créer l'utilisateur, **ALORS** j'obtiens une erreur "Email already in use"
- **ÉTANT DONNÉ QUE** je fournis un email au format invalide, **LORSQUE** je tente de créer l'utilisateur, **ALORS** j'obtiens une erreur "Invalid email format"
- **ÉTANT DONNÉ QUE** je fournis un nom vide ou composé uniquement d'espaces, **LORSQUE** je tente de créer l'utilisateur, **ALORS** j'obtiens une erreur "Name is required"
- **ÉTANT DONNÉ QUE** je fournis un nom de plus de 50 caractères, **LORSQUE** je tente de créer l'utilisateur, **ALORS** j'obtiens une erreur "Name cannot exceed 50 characters"

*/

import { User } from '../../src/models/user';
import { db, getConnection, testConnection } from '../../src/db';
import assert from 'assert';
import { UserService } from '../../src/services/userService';



describe('Creation User', () => {
    beforeAll(async () => {
    const connection = await getConnection();
    // Setup test database=
    // Create users table for testing
    await connection.query('CREATE TABLE IF NOT EXISTS users (id VARCHAR(36) PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), createdAt DATETIME)');
  });

  afterAll(async () => {
    // Clean up test database
    await db.query('DROP TABLE IF EXISTS users');
    await db.end(); // Close the pool after all tests are done
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

    // **ÉTANT DONNÉ QUE** je fournis un nom valide (non vide, maximum 50 caractères) et un email valide, 
    // **LORSQUE** je crée un utilisateur, 
    // **ALORS** il est créé avec un ID unique, le nom et l'email fournis ainsi que sa date de création
    it('should create a user with valid name and email', async () => {
        const name = "Costa Reype";
        const email = "costa.reype@mail.com";

        const user = await UserService.createUser(name, email);

        assert.ok(user.id, "User should have a unique ID");
        assert.strictEqual(user.name, name, "User name should match the provided name");
        assert.strictEqual(user.email, email, "User email should match the provided email");
        assert.ok(user.createdAt instanceof Date, "User createdAt should be a Date object");
    });

})
