import { useState } from 'react'

export default function Logon({ onSetEmail, onSetToken }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [isLoggingOn, setIsLoggingOn] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        try{ 
            const response = await fetch('/api/users/logon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.status === 200 && data.email && data.csrfToken) {
                onSetEmail(data.email);
                onSetToken(data.csrfToken);
            } else {
                setAuthError(`Authentication failed: ${data?.message}`);
            }
        } catch (error) {
            setAuthError(`Error: ${error.name} | ${error.message}`);
        } finally {
            setIsLoggingOn(false);
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            { authError?.length > 0 ? <div className="alert alert-error">authError</div> : '' }
            <label htmlFor='email'>Email</label>
            <input
                type="email"
                name="email"
                id='email'
                value={ email }
                onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor='password'>Password</label>
            <input
                type="password"
                name='password'
                id='password'
                value={ password }
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                type="submit"
                aria-busy={isLoggingOn}
                disabled={isLoggingOn}
            >
                { isLoggingOn ? 'Logging in...' : 'Log On' }
            </button>
        </form>
    )
}