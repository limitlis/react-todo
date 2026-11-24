export default function SortBy({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) {

    return (
        <>
            <select
                name="sortBy"
                id="sortBy"
                value={sortBy}
                onChange={(event) => onSortByChange(event.target.value)}
            >
                <option value="createdAt">Created At</option>
                <option value="title">Title</option>
            </select>
            <select
                name="sortOrder"
                id="sortOrder"
                value={sortDirection}
                onChange={(event) => onSortDirectionChange(event.target.value)}
            >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
            </select>
        </>
    )
}