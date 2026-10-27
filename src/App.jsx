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
        title: todoTitle
      }
      setTodoList([newTodo, ...todoList]);
    }
  }
  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} /> 
      <TodoList todoList={todoList}/>
    </div>
  )
}

export default App;