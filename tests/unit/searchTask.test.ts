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
import { TodoItem } from "../../src/models/todoItem";
import { TodoList } from "../../src/models/todoList";


describe("Search task", ()=>{
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

    // **ÉTANT DONNÉ QUE** j'ai des tâches contenant un mot-clé dans le titre, 
    // **LORSQUE** je recherche ce terme, 
    // **ALORS** seules les tâches correspondantes sont retournées
    it("should return tasks matching the keyword in the title", () => {
        const result = todoList.search("test");
        const expected = [todoItem];

        assert.deepEqual(result, expected, "Should return tasks matching the keyword in the title");
    });

    // **ÉTANT DONNÉ QUE** j'ai des tâches contenant un mot-clé dans la description, 
    // **LORSQUE** je recherche ce terme, 
    // **ALORS** seules les tâches correspondantes sont retournées
    it("should return tasks matching the keyword in the description", () => {
        const result = todoList.search("another");
        const expected = [todoItem3, todoItem2];

        assert.deepEqual(result, expected, "Should return tasks matching the keyword in the description");
    });

    // **ÉTANT DONNÉ QUE** j'ai des tâches contenant un mot-clé dans le titre ET la description, 
    // **LORSQUE** je recherche ce terme, 
    // **ALORS** toutes ces tâches sont retournées (sans doublon)
    it("should return tasks matching the keyword in title and description", () => {
        const todoItem4 = new TodoItem(4, "Another Test", "This is a test task with another keyword", new Date("2025-08-07"), "waiting");
        todoList.setitems([ todoItem, todoItem2, todoItem3, todoItem4 ]);
        const result = todoList.search("task");
        const expected = [todoItem4, todoItem3, todoItem2, todoItem];

        assert.deepEqual(result, expected, "Should return tasks matching the keyword in both title and description");
    });

    // **ÉTANT DONNÉ QUE** je recherche un terme inexistant, 
    // **LORSQUE** j'exécute la recherche, 
    // **ALORS** j'obtiens une liste vide
    it("should return an empty list when searching for a non-existent term", () => {
        const result = todoList.search("abc");
        const expected: TodoItem[] = [];

        assert.deepEqual(result, expected, "Should return an empty list for a non-existent term");
    });

    // **ÉTANT DONNÉ QUE** je recherche avec une chaîne vide, 
    // **LORSQUE** j'exécute la recherche, 
    // **ALORS** toutes les tâches sont retournées
    it("should return all tasks when searching with an empty string", () => {
        const result = todoList.search("");
        const expected = [todoItem3, todoItem2, todoItem];

        assert.deepEqual(result, expected, "Should return all tasks when searching with an empty string");
    });

    // **ÉTANT DONNÉ QUE** je recherche avec des majuscules/minuscules,
    // **LORSQUE** j'exécute la recherche,
    // **ALORS** la recherche est insensible à la casse
    it("should be case-insensitive when searching", () => {
        const result = todoList.search("tEST");
        const expected = [todoItem];

        assert.deepEqual(result, expected, "Should return tasks matching the keyword in case-insensitive");
    });

    // **ÉTANT DONNÉ QUE** j'ai de nombreux résultats de recherche, 
    // **LORSQUE** je fais la recherche, 
    // **ALORS** les résultats sont paginés comme la liste normale
    it("should paginate results like the normal list", () => {
    });
})