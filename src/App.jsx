import { useState } from 'react';

import './App.css'
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList.jsx'

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
      todoList.map((todo, index) => {
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
  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} /> 
      <TodoList todoList={todoList} onCompleteTodo={ completeTodo } />
    </div>
  )
}

export default App;