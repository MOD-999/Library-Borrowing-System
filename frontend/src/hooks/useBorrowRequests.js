import { useEffect, useState } from "react";
import api from "../utils/api";

/**
 * Custom hook for fetching borrow requests with book details
 * @returns {Object} { requests, loading, error, refetch }
 */
function useBorrowRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await api.get("/loans/requests/");

            // Fetch book details for each request
            const requestsWithBooks = await Promise.all(
                res.data.map(async (request) => {
                    try {
                        // If book is just an ID, fetch the book details
                        if (typeof request.book === "number") {
                            const bookRes = await api.get(
                                `/catalog/books/${request.book}/`,
                            );
                            return { ...request, book: bookRes.data };
                        }
                        return request;
                    } catch {
                        // If book fetch fails, return request as is
                        return request;
                    }
                }),
            );

            setRequests(requestsWithBooks);
            setError("");
        } catch {
            setError("Failed to load borrow requests.");
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return {
        requests,
        setRequests,
        loading,
        error,
        refetch: fetchRequests,
    };
}

export default useBorrowRequests;
