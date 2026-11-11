import { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

function TodoForm({ onAddTodo }) {
    const inputRef = useRef(null);
    const [workingTodoTitle, setWorkingTodoTitle] = useState('');

    const handleAddTodo = (event) => {
        event.preventDefault();

        if (workingTodoTitle) {
            onAddTodo(workingTodoTitle);
            setWorkingTodoTitle('');
            inputRef.current.focus();
        }
    };
    return (
        <form onSubmit={handleAddTodo}>
            <TextInputWithLabel
                elementId='todoTitle'
                labelText='Todo'
                ref={inputRef}
                value={ workingTodoTitle }
                onChange={(e) => setWorkingTodoTitle(e.target.value)}
            />
            <button type="submit" disabled={!workingTodoTitle.trim()}>Add Todo</button>
        </form>
    )
}

export default TodoForm