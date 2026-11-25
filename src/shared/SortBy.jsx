export default function SortBy({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) {

    return (
        <div className="row">
            <div className="col-12 col-md-6">
                <label htmlFor="sortBy">Sort by
                    <select
                        name="sortBy"
                        id="sortBy"
                        value={sortBy}
                        onChange={(event) => onSortByChange(event.target.value)}
                    >
                        <option value="createdAt">Created At</option>
                        <option value="title">Title</option>
                    </select>
                </label>
            </div>
            <div className="col-12 col-md-6">
                <label htmlFor="sortOrder">Sort Direction
                    <select
                        name="sortOrder"
                        id="sortOrder"
                        value={sortDirection}
                        onChange={(event) => onSortDirectionChange(event.target.value)}
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </label>
            </div>
        </div>
    )
}