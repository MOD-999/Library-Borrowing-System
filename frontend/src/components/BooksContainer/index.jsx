import { Link } from "react-router-dom";
import BookCard from "../BookCard";
import "./style.css";

function BooksContainer({ books }) {
    return (
        <section className="books-grid" aria-label="Books list">
            {books.map((book) => (
                <Link
                    key={book.id}
                    style={{ textDecoration: "none" }}
                    to={`/books/${book.id}`}
                >
                    <BookCard book={book} />
                </Link>
            ))}
        </section>
    );
}

export default BooksContainer;
