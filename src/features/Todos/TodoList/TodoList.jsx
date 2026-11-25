import { useMemo } from 'react';
import TodoListItem from './TodoListItem'
function TodoList({ todoList, onUpdateTodo, onCompleteTodo, dataVersion }) {

  const filteredTodoList = useMemo(() => {
    const todos = todoList.filter((todo) => {
      return !todo?.isCompleted;
    });
    return {
      todos,
      version: dataVersion
    }
  }, [todoList, dataVersion]);
  return (
    filteredTodoList.todos?.length === 0 ?
      <p>Add todo above to get started</p>
      :
        <ul>
        {
          filteredTodoList.todos.map(todo => <TodoListItem key={todo.id} todo={todo} onUpdateTodo={onUpdateTodo} onCompleteTodo={onCompleteTodo} /> )
        }
      </ul>
    )
}

export default TodoList