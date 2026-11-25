import { useCallback, useEffect, useState } from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx'
import SortBy from '@/shared/SortBy.jsx';
import useDebounce from '@/utils/useDebounce.js';
import FilterInput from '@/shared/FilterInput.jsx';

export default function TodosPage({ token }) {
    const [todoList, setTodoList] = useState([]);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');

    const [filterTerm, setFilterTerm] = useState('');
    const debouncedFilterTerm = useDebounce(filterTerm, 300); 

    const [error, setError] = useState('');
    const [filterError, setFilterError] = useState('');
    const [isTodoListLoading, setIsTodoListLoading] = useState(false);

    const handleFilterChange = (newTerm) => { setFilterTerm(newTerm); };

    const [dataVersion, setDataVersion] = useState(0);
    
    const invalidateCache = useCallback(() => {
        setDataVersion((prev) => prev + 1);
    }, []);
    useEffect(() => {
        if (!token) return;
        // prefixing with `_` due to linter
        let _dataFetched = false;
        (async function fetchTodos() {
            setIsTodoListLoading(true);
            try {
                const paramsObject = {
                    sortBy,
                    sortDirection,
                    limit: 100,
                }
                if (debouncedFilterTerm) {
                   paramsObject.find = debouncedFilterTerm;
                }
                const params = new URLSearchParams(paramsObject);
                const response = await fetch(`/api/tasks?${params}`, {
                    headers: {
                        'X-CSRF-TOKEN': token,
                    },
                    credentials: 'include',
                });
                if (response.ok) {
                    // prefixing pagination as `_pagination` due to linter
                    const { tasks, _pagination } = await response.json();
                    setTodoList(tasks);
                    setFilterError('');
                } else {
                    if (response.status === 401) {
                        throw new Error('unauthorized');
                    } else {
                        const errorBody = await response.json();
                        throw new Error(errorBody.message);
                    }
                }
            } catch (error) {
                if (debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'desc') {
                    setFilterError(`Error filtering/sorting todos: ${error.message}`);
                } else {
                    setError(`Error fetching todos: ${error.message}`);
                }
            } finally {
                setIsTodoListLoading(false);
            }
        })();
        return () => {
            _dataFetched = true;
        }
    }, [token, sortBy, sortDirection, debouncedFilterTerm]);
    
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
                // oxlint-disable-next-line no-unused-vars
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
                    invalidateCache();
                    setFilterError('');
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
            invalidateCache();
            
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
            invalidateCache();
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

    function resetFilters(e) {
        e.preventDefault();
        setFilterTerm('');
        setSortBy('createdAt');
        setSortDirection('desc');
        setFilterError('');
    }

    return (
        <div>
            {   error !== '' ? <div className="alert alert-error">
                    <p>{error}</p>
                <button className="alert-close" aria-label="Close" onClick={() => setError('')}>&times;</button>
            </div> : ''
            }
            {
                filterError != '' && <div className="alert alert-error">
                    <p>
                        {filterError}
                        <a className="secondary" onClick={(e) => resetFilters(e)} style={{marginLeft: '10px'}}>Reset Filters</a>
                    </p>
                <button className="alert-close" aria-label="Close" onClick={() => setFilterError('')}>&times;</button>
            </div>
            }
            {isTodoListLoading ? <div aria-busy="true" style={{ minHeight: '2rem' }}></div> : ''}
            <SortBy sortBy={sortBy} sortDirection={sortDirection} onSortByChange={setSortBy} onSortDirectionChange={setSortDirection} />
            <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange}/>
            <TodoForm onAddTodo={addTodo} /> 
            <TodoList todoList={todoList} onUpdateTodo={updateTodo} onCompleteTodo={completeTodo} dataVersion={dataVersion} />
        </div>
    )
}