import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import "./style.css";

function BookDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [requestMsg, setRequestMsg] = useState("");
    const isRequestError = requestMsg.toLowerCase().includes("could not");

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await api.get(`/catalog/books/${id}/`);
                setBook(res.data);
            } catch {
                setError("Failed to load book details.");
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    const handleBorrowRequest = async () => {
        if (!token) {
            navigate("/login");
            return;
        }

        setSubmitting(true);
        setRequestMsg("");

        try {
            await api.post("/loans/requests/", { book: book.id });
            setRequestMsg("Borrow request submitted successfully.");
        } catch (err) {
            const msg =
                err?.response?.data?.detail ||
                "could not submit borrow request.";
            setRequestMsg(msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p className="page-state">Loading book details...</p>;
    if (error) return <p className="page-state page-state-error">{error}</p>;
    if (!book) return <p className="page-state">Book not found.</p>;

    return (
        <section className="book-details-page">
            <Link className="book-details-back" to="/books">
                Back to books
            </Link>

            <article className="book-details-card">
                <h1 className="book-details-title">{book.title}</h1>
                <p className="book-details-author">By {book.author}</p>
                <p className="book-details-meta">
                    <strong>Category:</strong> {book.category}
                </p>
                <p className="book-details-description">
                    {book.description || "No description available."}
                </p>

                <div className="book-details-actions">
                    <button
                        className="borrow-btn"
                        onClick={handleBorrowRequest}
                        disabled={submitting || !book.is_available}
                    >
                        {submitting
                            ? "Submitting..."
                            : book.is_available
                              ? "Submit Borrow Request"
                              : "Not Available"}
                    </button>
                    {requestMsg && (
                        <p
                            className={
                                isRequestError
                                    ? "request-msg error"
                                    : "request-msg"
                            }
                        >
                            {requestMsg}
                        </p>
                    )}
                </div>
            </article>
        </section>
    );
}

export default BookDetail;
