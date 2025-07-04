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

import { Database, openDB } from '../../src/db';
import assert from 'assert';
import { UserService } from '../../src/services/userService';



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

    // **ÉTANT DONNÉ QUE** je fournis un email déjà utilisé par un autre utilisateur,
    // **LORSQUE** je tente de créer l'utilisateur,
    // **ALORS** j'obtiens une erreur "Email already in use"
    it('should throw an error when trying to create a user with an email already in use', async () => {
        const name = "John Deux";
        const email = "john.doe@mail.com"
        try {
            await UserService.createUser(name, email);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Email already in use", "Error message should be 'Email already in use'");
        }
    });

    // **ÉTANT DONNÉ QUE** je fournis un email au format invalide,
    // **LORSQUE** je tente de créer l'utilisateur,
    // **ALORS** j'obtiens une erreur "Invalid email format"
    it('should throw an error when trying to create a user with an invalid email format', async () => {
        const name = "Jack Frost";
        const email = "invalid-email-format";

        try {
            await UserService.createUser(name, email);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Invalid email format", "Error message should be 'Invalid email format'");
        }
    });

    // **ÉTANT DONNÉ QUE** je fournis un nom vide ou composé uniquement d'espaces, 
    // **LORSQUE** je tente de créer l'utilisateur, 
    // **ALORS** j'obtiens une erreur "Name is required"
    it('should throw an error when trying to create a user with an empty name', async () => {
        const name = "   "; // Spaces only
        const email = "space@mail.com"
        try {
            await UserService.createUser(name, email);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Name is required and cannot exceed 50 characters", "Error message should be 'Name is required'");
        }
    });

    // **ÉTANT DONNÉ QUE** je fournis un nom de plus de 50 caractères, 
    // **LORSQUE** je tente de créer l'utilisateur, 
    // **ALORS** j'obtiens une erreur "Name cannot exceed 50 characters"
    it('should throw an error when trying to create a user with a name longer than 50 characters', async () => {
        const name = "a".repeat(51); // 51 characters long
        const email = "fifty.one@mail.com"
        try {
            await UserService.createUser(name, email);
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Name is required and cannot exceed 50 characters", "Error message should be 'Name cannot exceed 50 characters'");
        }
    });
})
