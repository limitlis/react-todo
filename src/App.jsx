import { useState } from 'react';

import './App.css'
import TodoForm from './features/TodoForm.jsx';
import TodoList from './features/TodoList/TodoList.jsx'

function App() {
  const [todoList, setTodoList] = useState([]);
  function addTodo(todoTitle) {
    if (todoTitle?.length) {

      const newTodo = {
        id: Date.now(),
        title: todoTitle,
        isCompleted: false
      }
      setTodoList((previous) => [newTodo, ...previous]);
    }
  }
  function completeTodo(id) {
    if (!id) return;
    setTodoList(
      todoList.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isCompleted: true
          }
        }
        return todo;
      })
    );
  }
  function updateTodo(editedTodo) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return { ...editedTodo };
      }
      return todo;
    });
    setTodoList(updatedTodos);
  }
  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} /> 
      <TodoList todoList={todoList} onUpdateTodo={updateTodo} onCompleteTodo={ completeTodo } />
    </div>
  )
}

export default App;