import assert from 'assert';
import { TodoList } from '../../src/models/todoList';
import { TodoItem } from '../../src/models/todoItem';

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


let todoList: TodoList;
let todoItem : TodoItem
let todoItem2 : TodoItem

describe('Create Task', () => {
    let todoList : TodoList;
    beforeEach(() => {
        todoList = new TodoList();
        todoItem = new TodoItem(1, "Test Task", "This is a test task", new Date(), "waiting");
        todoItem2 = new TodoItem(2, "Another Task", "This is another task", new Date(), "waiting");
        todoList.create("Test Task", "This is a test task",)
        todoList.create("Another Task", "This is another task");
    })
    //**ÉTANT DONNÉ QUE** je fournis un titre valide (non vide, maximum 100 caractères), 
    // **LORSQUE** je crée une tâche, 
    // **ALORS** elle est créée avec un ID unique, le titre fourni, une description vide par défaut, une date de création et le statut "TODO"
    it('test Create Todo Item With Valid Title And Default Date Description And Status', () => {
        const title = "Valid Task Title";
        const todoItem = todoList.create(title, "");

        const count = todoList.readAll().filter(item => item.id === todoItem.id).length;

        assert.strictEqual(count, 1, "UID should be unique");
        assert.ok(todoItem.id > 0, "ID should be greater than 0");
        assert.strictEqual(todoItem.title, title, "Title should match the provided title");
        assert.strictEqual(todoItem.description, "", "Description should be empty by default");
        assert.ok(todoItem.createdAt !== null, "CreatedAt should not be null");
        assert.ok(todoItem.createdAt instanceof Date, "CreatedAt should be a Date object");
        assert.ok(todoItem.status !== null, "Status should not be null");
        assert.strictEqual(todoItem.status, "waiting", "Status should be 'waiting' by default");
    });

    //- **ÉTANT DONNÉ QUE** je fournis un titre et une description valide (maximum 500 caractères), 
    // **LORSQUE** je crée une tâche, 
    // **ALORS** elle est créée avec le titre et la description fournis
    it('test Create Todo Item With Valid Title And Description', () => {
        const title = "Valid Task Title";
        const description = "This is a valid description for the task.";
        const todoItem = todoList.create(title, description);

        assert.strictEqual(todoItem.title == null, false, "Title should not be null");
        assert.strictEqual(todoItem.title, title, "Title should match the provided title");
        assert.strictEqual(todoItem.description==null, false, "Description should not be null");
        assert.strictEqual(todoItem.description, description, "Description should match the provided description");
    });
    //**ÉTANT DONNÉ QUE** je fournis un titre vide ou composé uniquement d'espaces, 
    // **LORSQUE** je tente de créer une tâche, 
    // **ALORS** j'obtiens une erreur "Title is required"
    it('test Create Todo Item With Empty Title', () => {
        const title = "";

        assert.strictEqual(title.trim() === "", true, "Title should be empty or contain only spaces");
        try {
            todoList.create(title, "");
            assert.fail("Expected an error to be thrown");
        } catch (error: any) {
            assert.strictEqual(error.message, "Title is required", "Should throw 'Title is required' error");
        }
    });

    //**ÉTANT DONNÉ QUE** je fournis un titre de plus de 100 caractères, 
    // **LORSQUE** je tente de créer une tâche, 
    // **ALORS** j'obtiens une erreur "Title cannot exceed 100 characters"
    it('test Create Todo Item With Title Exceeding Max Length', ()=>{
        const title = "a".repeat(101);

        assert.strictEqual(title == null, false, "Title should not be null");
        assert.strictEqual(title.length> 100, true, "Title should exceed 100 characters");
        try {
            todoList.create(title, "");
            assert.fail("Expected an error to be thrown");
        } catch (error: any) {
            assert.strictEqual(error.message, "Title cannot exceed 100 characters", "Should throw 'Title cannot exceed 100 characters' error");
        }
    })

    //- **ÉTANT DONNÉ QUE** je fournis une description de plus de 500 caractères, 
    // **LORSQUE** je tente de créer une tâche, 
    // **ALORS** j'obtiens une erreur "Description cannot exceed 500 characters"
    it('test Create Todo Item With Description Exceeding Max Length', () => {
        const title = "Valid Task Title";
        const description = "a".repeat(501);

        assert.strictEqual(description == null, false, "Description should not be null");
        assert.strictEqual(title==null, false, "Title should not be null");
        assert.strictEqual(title.length > 0, true, "Title should not be empty");
        assert.strictEqual(title.length <= 100, true, "Title should not exceed 100 characters");
        assert.strictEqual(description.length > 500, true, "Description should exceed 500 characters");

        try {
            todoList.create(title, description);
            assert.fail("Expected an error to be thrown");
        } catch (error: any) {
            assert.strictEqual(error.message, "Description cannot exceed 500 characters", "Should throw 'Description cannot exceed 500 characters' error");
        }

    })

    //- **ÉTANT DONNÉ QUE** je fournis une titre qui commence et/ou termine par des espace, 
    // **LORSQUE** je crée une tâche, 
    // **ALORS** elle est créee avec le titre fourni, sans espaces au début ni à la fin
    it('test Create Todo Item With Title Containing Leading And Trailing Spaces', ()=>{
        const title = "  Task Title with Spaces   ";
        const trimmedTitle = title.trim();

        const todoItem = todoList.create(trimmedTitle, "");

        assert.strictEqual(todoItem.title == null, false, "Title should not be null");
        assert.strictEqual(todoItem.title.length > 0, true, "Title should not be empty");
        assert.strictEqual(todoItem.title.length <= 100, true, "Title should not exceed 100 characters");
        assert.strictEqual(title == null, false, "Title should not be null");
        assert.strictEqual(title.length > 0, true, "Title should not be empty");
        assert.strictEqual(title.length <= 100, true, "Title should not exceed 100 characters");
        assert.strictEqual(trimmedTitle.length > 0, true, "Trimmed title should not be empty");

        assert.strictEqual(todoItem.title, trimmedTitle, "Title should be trimmed of leading and trailing spaces");
        assert.strictEqual(todoItem.title.startsWith(" "), false, "Title should not start with a space");
        assert.strictEqual(todoItem.title.endsWith(" "), false, "Title should not end with a space");
    })

    //- **ÉTANT DONNÉ QUE** j'ai une tâche nouvellement créée, 
    // **LORSQUE** je la consulte, 
    // **ALORS** sa date de création correspond au moment de création à la seconde près
    it('test Create Todo Item With Creation Date', ()=>{

        const title = "Task with Creation Date";
        assert.strictEqual(title == null, false, "Title should not be null");
        assert.strictEqual(title.length > 0, true, "Title should not be empty");
        assert.strictEqual(title.length <= 100, true, "Title should not exceed 100 characters");

        const todoItem = todoList.create(title, "");
        assert.strictEqual(todoItem.title == null, false, "Title should not be null");
        assert.strictEqual(todoItem.title.length > 0, true, "Title should not be empty");
        assert.strictEqual(todoItem.title.length <= 100, true, "Title should not exceed 100 characters");

        assert.strictEqual(todoItem.createdAt == null, false, "CreatedAt should not be null");
        assert.ok(todoItem.createdAt instanceof Date, "CreatedAt should be a Date object");

        const currentDate = new Date();
        const createdAtDate = todoItem.createdAt;

        assert.ok(Math.abs(currentDate.getTime() - createdAtDate.getTime()) < 1000, "CreatedAt should be within 1 second of the current date");
    })
});
