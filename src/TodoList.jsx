function TodoList() {
    const todoList = [
        { id: 1, title: 'Learn React' },
        { id: 2, title: 'Grocery Shop' },
        { id: 3, title: `Submit this week's assignment` }
    ]
    return (
        <ul>
        {
          todoList.map(todo => <li key={todo.id}>{ todo.title }</li>)
        }
      </ul>
    );
}

export default TodoList;