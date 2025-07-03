import {db, testConnection} from './src/db/index';
import { TodoList } from './src/models/todoList';

testConnection()


const todoList = new TodoList();

// Create a new todo item
const newItem = todoList.create("Buy groceries", "Milk, Bread, Eggs");
console.log("Created Item:", newItem);
// Read all todo items
const items = todoList.readAll();
console.log("All Items:",items);
// Update an existing todo item
const updatedItem = todoList.update(newItem.id, "Buy groceries and fruits", "Milk, Bread, Eggs, Apples");
console.log("Updated Item:", updatedItem);
// Delete a todo item
const deleteResult = todoList.delete(newItem.id);
console.log("Delete Result:", deleteResult);    
// Read all todo items after deletion
const itemsAfterDelete = todoList.readAll();
console.log("Items After Deletion:", itemsAfterDelete);

