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
import { TodoList } from '../../todoList';
import { TodoItem } from '../../todoItem';

function testCreateTodoItem() {
}

//**ÉTANT DONNÉ QUE** je fournis un titre valide (non vide, maximum 100 caractères), 
// **LORSQUE** je crée une tâche, 
// **ALORS** elle est créée avec un ID unique, le titre fourni, une description vide par défaut, une date de création et le statut "TODO"
function testCreateTodoItemWithValidTitleAndDefaultDateDescriptionAndStatus() {
}

//- **ÉTANT DONNÉ QUE** je fournis un titre et une description valide (maximum 500 caractères), 
// **LORSQUE** je crée une tâche, 
// **ALORS** elle est créée avec le titre et la description fournis
function testCreateTodoItemWithValidTitleAndDescription() {
}

//**ÉTANT DONNÉ QUE** je fournis un titre vide ou composé uniquement d'espaces, 
// **LORSQUE** je tente de créer une tâche, 
// **ALORS** j'obtiens une erreur "Title is required"
function testCreateTodoItemWithEmptyTitle() {
}

//**ÉTANT DONNÉ QUE** je fournis un titre de plus de 100 caractères, 
// **LORSQUE** je tente de créer une tâche, 
// **ALORS** j'obtiens une erreur "Title cannot exceed 100 characters"
function testCreateTodoItemWithTitleExceedingMaxLength() {
}

//- **ÉTANT DONNÉ QUE** je fournis une description de plus de 500 caractères, 
// **LORSQUE** je tente de créer une tâche, 
// **ALORS** j'obtiens une erreur "Description cannot exceed 500 characters"
function testCreateTodoItemWithDescriptionExceedingMaxLength() {
}

//- **ÉTANT DONNÉ QUE** je fournis une titre qui commence et/ou termine par des espace, 
// **LORSQUE** je crée une tâche, 
// **ALORS** elle est créee avec le titre fourni, sans espaces au début ni à la fin
function testCreateTodoItemWithTitleContainingLeadingAndTrailingSpaces() {
}

//- **ÉTANT DONNÉ QUE** j'ai une tâche nouvellement créée, 
// **LORSQUE** je la consulte, 
// **ALORS** sa date de création correspond au moment de création à la seconde près
function testCreateTodoItemWithCreationDate() {
}
