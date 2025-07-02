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

import { TodoList } from "../../src/models/todoList";
import { TodoItem } from "../../src/models/todoItem";
import assert from "assert";

describe("Sort task", () => {
    let todoList : TodoList;
    const todoItem = new TodoItem(1, "Test Task", "This is a test task", new Date("2025-07-01"), "waiting");
    const todoItem2 = new TodoItem(2, "Another Task", "This is another task", new Date("2025-07-02"), "waiting");
    const todoItem3 = new TodoItem(3, "Another Task Again", "This is again an other task", new Date("2025-07-03"), "waiting");
    
    beforeEach(()=>{
        todoList = new TodoList();
        todoList.setitems([
            todoItem,
            todoItem2,
            todoItem3
        ])
    })

    // **ÉTANT DONNÉ QUE** j'ai plusieurs tâches, 
    // **LORSQUE** je trie par date de création ascendante, 
    // **ALORS** les tâches sont affichées de la plus ancienne à la plus récente
    it("should sort tasks by creation date ascending", () => {
        const todoItem4 = new TodoItem(4, "Old Task", "This task is older", new Date("2020-01-01"), "waiting");
        todoList.setitems([todoItem, todoItem2, todoItem3, todoItem4]);
        
        const result = todoList.search("", "", "date", "asc");
        const expected = [todoItem4, todoItem, todoItem2, todoItem3];

        assert.deepEqual(result, expected, "Should sort tasks by creation date ascending");
    });

    // **ÉTANT DONNÉ QUE** j'ai plusieurs tâches,
    // **LORSQUE** je trie par date de création descendante,
    // **ALORS** les tâches sont affichées de la plus récente à la plus ancienne
    it("should sort tasks by creation date descending", () => {
        const todoItem4 = new TodoItem(4, "New Task", "This task is newer", new Date("2025-08-01"), "waiting");
        todoList.setitems([todoItem, todoItem2, todoItem3, todoItem4]);
        
        const result = todoList.search("", "", "date", "desc");
        const expected = [todoItem4, todoItem3, todoItem2, todoItem];

        assert.deepEqual(result, expected, "Should sort tasks by creation date descending");
    })

    // **ÉTANT DONNÉ QUE** j'ai plusieurs tâches,
    // **LORSQUE** je trie par titre ascendant,
    // **ALORS** les tâches sont affichées par ordre alphabétique
    it("should sort tasks by title ascending", () => {
        const todoItem4 = new TodoItem(4, "A Task", "This task has a title starting with A", new Date("2025-07-04"), "waiting");
        todoList.setitems([todoItem, todoItem2, todoItem3, todoItem4]);
        
        const result = todoList.search("", "", "title", "asc");
        const expected = [todoItem4, todoItem2, todoItem3, todoItem];

        assert.deepEqual(result, expected, "Should sort tasks by title ascending");
    });

    // **ÉTANT DONNÉ QUE** j'ai plusieurs tâches,
    // **LORSQUE** je trie par titre descendant,
    // **ALORS** les tâches sont affichées par ordre alphabétique inversé
    it("should sort tasks by title descending", () => {
        const todoItem4 = new TodoItem(4, "Z Task", "This task has a title starting with Z", new Date("2025-07-04"), "waiting");
        todoList.setitems([todoItem, todoItem2, todoItem3, todoItem4]);
        
        const result = todoList.search("", "", "title", "desc");
        const expected = [todoItem4, todoItem, todoItem3, todoItem2];

        assert.deepEqual(result, expected, "Should sort tasks by title descending");
    });

    // **ÉTANT DONNÉ QUE** j'ai plusieurs tâches,
    // **LORSQUE** je trie par statut,
    // **ALORS** les tâches sont groupées par statut dans l'ordre : wainting, progress, completed
    it("should sort tasks by status", () => {
        const todoItem4 = new TodoItem(4, "In Progress Task", "This task is in progress", new Date("2025-08-08"), "progress");
        const todoItem5 = new TodoItem(5, "Completed Task", "This task is completed", new Date("2025-08-05"), "completed");
        todoList.setitems([todoItem4, todoItem, todoItem2, todoItem3, todoItem5]);
        
        const result = todoList.search("", "", "status", "asc");
        const expected = [todoItem, todoItem2, todoItem3, todoItem4, todoItem5];

        assert.deepEqual(result, expected, "Should sort tasks by status");
    });

    // **ÉTANT DONNÉ QUE** je ne spécifie pas de tri,
    // **LORSQUE** je consulte la liste,
    // **ALORS** les tâches sont triées par date de création descendante par défaut
    it("should sort tasks by default date descending when no sort criteria is specified", () => {
        const result = todoList.search();
        const expected = [todoItem3, todoItem2, todoItem];

        assert.deepEqual(result, expected, "Should sort tasks by default date descending");
    });

    //**ÉTANT DONNÉ QUE** je spécifie un critère de tri invalide, 
    // **LORSQUE** je fais la demande, 
    // **ALORS** j'obtiens une erreur "Invalid sort criteria"
    it("should throw an error for invalid sort criteria", () => {
        try{
            todoList.search("", "", "invalidCriteria");
            assert.fail("Expected error not thrown for invalid sort criteria");
        }catch (error) {
            assert.strictEqual((error as Error).message, "Invalid sort criteria", "Should throw error for invalid sort criteria");
        }
    });

    // **ÉTANT DONNÉ QUE** je combine tri et filtre, 
    // **LORSQUE** j'applique les deux, 
    // **ALORS** le tri s'applique sur les résultats filtrés
    it("should apply sort on filtered results", () => {
        const todoItem4 = new TodoItem(4, "In Progress Task", "This task is in progress", new Date("2025-08-01"), "progress");
        todoList.setitems([todoItem, todoItem2, todoItem3, todoItem4]);
        
        const result = todoList.search("", "waiting", "title", "desc");
        // const filteredResult = todoList.filterByStatus("waiting");
        // const sortedResult = todoList.sortBy("title", "desc", filteredResult);
        const expected = [todoItem, todoItem3, todoItem2];

        assert.deepEqual(result, expected, "Should apply sort on filtered results");
    });
}); 