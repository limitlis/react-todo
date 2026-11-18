import { useEffect, useState } from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx'

export default function TodosPage({ token }) {

    const [todoList, setTodoList] = useState([]);
    const [error, setError] = useState('');
    const [isTodoListLoading, setIsTodoListLoading] = useState(false);

    useEffect(() => {
        if (!token) return;
        let dataFetched = false;
        (async function fetchTodos() {
            setIsTodoListLoading(true);
            try {
                const params = new URLSearchParams({
                    limit: 99,
                });
                const response = await fetch(`/api/tasks?${params}`, {
                    headers: {
                        'X-CSRF-TOKEN': token,
                    },
                    credentials: 'include',
                });
                if (response.ok) {
                    const { tasks, pagination } = await response.json();
                    setTodoList(tasks);
                } else {
                    if (response.status === 401) {
                        throw new Error('unauthorized');
                    } else {
                        const errorBody = await response.json();
                        throw new Error(errorBody.message);
                    }
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsTodoListLoading(false);
            }
        })();
        return () => {
            dataFetched = true;
        }
    }, [token]);
    
    async function addTodo(todoTitle) {
        if (todoTitle?.length) {
            const tmpID = Date.now();
            const newTodo = {
                id: tmpID,
                title: todoTitle,
                isCompleted: false
            }

            setTodoList((previous) => [newTodo, ...previous]);
            try {
                const { id, ...payload } = newTodo;
                const response = await fetch(`/api/tasks`, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': token,
                    },
                    credentials: 'include',
                }).catch((error) => {
                    throw new Error(error);
                });
                if (response.ok) {
                    const task = await response.json();
                    setTodoList((previous) => {
                        const previousResults = previous.filter((todo) => todo.id !== tmpID);
                        return [task, ...previousResults];
                    });
                } else {
                    const errorBody = await response.json();
                    throw new Error(errorBody.message);
                }
            } catch (error) {
                setError(error.message);
                setTodoList((previous) => [...previous.filter((todo) => todo.id !== tmpID)]);
            }

        }
    }
    async function completeTodo(id) {
        if (!id) return;
        const tmpTodo = todoList.find((todo) => todo.id === id);
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
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ 'isCompleted': true }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                credentials: 'include',
            });
            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.message);
            }
            
        } catch (error) {
            setError(error.message);
            setTodoList(
                todoList.map((todo) => {
                    if (todo.id === id) {
                        return {...tmpTodo}
                    }
                    return todo;
                })
            );
        }

    }
    async function updateTodo(editedTodo) {
        let editedTodoPreviousState;
        const updatedTodos = todoList.map((todo) => {
            if (todo.id === editedTodo.id) {
                editedTodoPreviousState = {...todo};
                return { ...editedTodo };
            }
            return todo;
        });
        setTodoList(updatedTodos);
        try {
            const response = await fetch(`/api/tasks/${editedTodo.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ title: editedTodo.title, 'isCompleted': editedTodo.isCompleted }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                credentials: 'include',
            });
            
            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.message);
            }
        } catch (error) {
            setError(error.message);
            setTodoList(
                todoList.map((todo) => {
                    if (todo.id === editedTodoPreviousState.id) {
                        return {...editedTodoPreviousState}
                    }
                    return todo;
                })
            );
        }
    }

    return (
        <div>
            {   error !== '' ? <div className="alert alert-error">
                    <p>{error}</p>
                <button className="alert-close" aria-label="Close" onClick={() => setError('')}>&times;</button>
            </div> : ''
            }
            { isTodoListLoading ? <div aria-busy="true" style={{minHeight: '2rem'}}></div> : '' }
            <TodoForm onAddTodo={addTodo} /> 
            <TodoList todoList={todoList} onUpdateTodo={updateTodo} onCompleteTodo={completeTodo} />
        </div>
    )
}