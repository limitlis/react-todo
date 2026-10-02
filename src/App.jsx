import './App.css'

function App() {
  const todoList = [
    {id: 1, title: 'Learn React'},
    {id: 2, title: 'Grocery Shop'},
    {id: 3, title: `Submit this week's assignment`}
  ]
  return (
    <div>
      <h1>ToDo List</h1>
      <ul>
        {
          todoList.map(todo => <li key={todo.id}>{ todo.title }</li>)
        }
      </ul>
    </div>
  )
}

export default App