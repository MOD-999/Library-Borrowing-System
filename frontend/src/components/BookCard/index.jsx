import "./style.css";

function BookCard({ book }) {
    const badgeClass = book.is_available
        ? "badge badge-available"
        : "badge badge-unavailable";

    return (
        <article className="card">
            <div className="card-media">
                {book.image ? (
                    <img
                        className="card-image"
                        src={book.image}
                        alt={book.title}
                    />
                ) : (
                    <div className="card-placeholder">No Cover</div>
                )}
                <span className={badgeClass}>
                    {book.is_available ? "Available" : "Borrowed"}
                </span>
            </div>

            <div className="card-body">
                <h3 className="card-title">{book.title}</h3>
                <p className="card-author">By {book.author}</p>
                <p className="card-category">{book.category}</p>
                <p className="card-description">
                    {book.description || "No description available."}
                </p>
            </div>
        </article>
    );
}

export default BookCard;
