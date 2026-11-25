export default function FilterInput({ filterTerm, onFilterChange }) {   

    return (
        <div>
            <label htmlFor='filterInput'>
                Search todos:
                <input
                    type="text"
                    id='filterInput'
                    value={filterTerm}
                    onChange={(e) => onFilterChange(e.target.value)}
                    placeholder='Search by title...'
                />
            </label>
        </div>
    )
}