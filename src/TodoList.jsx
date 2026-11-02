import TodoListItem from './TodoListItem'
function TodoList({ todoList, onCompleteTodo }) {

  const filteredTodoList = todoList.filter((todo) => {
    return !todo?.isCompleted;
  });
  return (
    filteredTodoList?.length === 0 ?
      'Add todo above to get started'
      :
        <ul>
        {
          filteredTodoList.map(todo => <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} /> )
        }
      </ul>
    )
}

export default TodoList