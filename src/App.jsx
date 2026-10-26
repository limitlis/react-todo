import { useState } from 'react';

import './App.css'
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList.jsx'

const todos = [
    { id: 1, title: 'Learn React' },
    { id: 2, title: 'Grocery Shop' },
    { id: 3, title: `Submit this week's assignment` }
]

function App() {
  const [todoList, _setTodoList] = useState(todos);
  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm /> 
      <TodoList todoList={todoList}/>
    </div>
  )
}

export default App;