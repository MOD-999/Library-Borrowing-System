import { useEffect, useMemo, useState } from "react";
import api from "../../utils/api";
import BooksContainer from "../../components/BooksContainer";
import "./style.css";

function Books() {
    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await api.get("/catalog/books/");
                setBooks(res.data);
            } catch {
                setError("Failed to load books.");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const filteredBooks = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return books;
        return books.filter((book) =>
            (book.title || "").toLowerCase().includes(q),
        );
    }, [books, query]);

    if (loading) return <p className="page-state">Loading books...</p>;
    if (error) return <p className="page-state page-state-error">{error}</p>;
    if (!books.length) return <p className="page-state">No books found.</p>;

    return (
        <section className="page">
            <div className="page-top">
                <h1 className="page-title">Browse Books</h1>
                <p className="page-subtitle">
                    Discover available titles and pick your next read.
                </p>
                <input
                    type="text"
                    placeholder="Search by title.."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-bar"
                />
            </div>
            <BooksContainer books={filteredBooks} />
        </section>
    );
}

export default Books;
