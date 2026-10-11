import './App.css'
import TodoForm from './TodoForm.jsx';
import TodoList from './ToDoList.jsx'

function App() {
  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm /> 
      <TodoList />
    </div>
  )
}

export default App;