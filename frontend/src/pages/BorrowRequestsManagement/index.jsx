import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import useBorrowRequests from "../../hooks/useBorrowRequests";
import "./style.css";

function BorrowRequestsManagement() {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const { requests, setRequests, loading, error } = useBorrowRequests();

    const [successMessage, setSuccessMessage] = useState("");
    const [statusError, setStatusError] = useState("");
    const [filter, setFilter] = useState("all"); // all, pending, approved, rejected

    useEffect(() => {
        // Check if user is staff
        if (!token || !user?.is_staff) {
            navigate("/books");
            return;
        }
    }, [token, user, navigate]);

    const handleStatusChange = async (requestId, newStatus) => {
        try {
            setSuccessMessage("");
            setStatusError("");
            await api.patch(`/loans/requests/${requestId}/`, {
                status: newStatus,
            });

            setRequests(
                requests.map((req) =>
                    req.id === requestId ? { ...req, status: newStatus } : req,
                ),
            );

            setSuccessMessage(
                `Request updated to ${getStatusLabel(newStatus.toLowerCase())} successfully!`,
            );
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setStatusError(
                err?.response?.data?.detail ||
                    "Failed to update request status.",
            );
        }
    };

    const filteredRequests = requests.filter((request) => {
        if (filter === "all") return true;
        const statusMap = {
            pending: "Pending",
            approved: "Approved",
            rejected: "Rejected",
        };
        return request.status === statusMap[filter];
    });

    const getStatusLabel = (status) => {
        if (!status) return status;
        return String(status).trim();
    };

    const getStatusBadgeClass = (status) => {
        const lowerStatus = String(status).toLowerCase().trim();
        if (lowerStatus === "approved") return "status-badge status-approved";
        if (lowerStatus === "pending") return "status-badge status-pending";
        if (lowerStatus === "rejected") return "status-badge status-rejected";
        return "status-badge";
    };

    if (!user?.is_staff) {
        return null;
    }

    return (
        <section className="page borrow-requests-management">
            <div className="page-top">
                <h1 className="page-title">Manage Borrow Requests</h1>
                <p className="page-subtitle">
                    Review and approve/reject book borrowing requests
                </p>
            </div>

            {successMessage && (
                <div className="success-message">{successMessage}</div>
            )}
            {error && <div className="error-message">{error}</div>}
            {statusError && <div className="error-message">{statusError}</div>}

            <div className="filter-tabs">
                <button
                    className={`filter-tab ${filter === "all" ? "active" : ""}`}
                    onClick={() => setFilter("all")}
                >
                    All ({requests.length})
                </button>
                <button
                    className={`filter-tab ${
                        filter === "pending" ? "active" : ""
                    }`}
                    onClick={() => setFilter("pending")}
                >
                    Pending (
                    {requests.filter((r) => r.status === "Pending").length})
                </button>
                <button
                    className={`filter-tab ${
                        filter === "approved" ? "active" : ""
                    }`}
                    onClick={() => setFilter("approved")}
                >
                    Approved (
                    {requests.filter((r) => r.status === "Approved").length})
                </button>
                <button
                    className={`filter-tab ${
                        filter === "rejected" ? "active" : ""
                    }`}
                    onClick={() => setFilter("rejected")}
                >
                    Rejected (
                    {requests.filter((r) => r.status === "Rejected").length})
                </button>
            </div>

            <div className="requests-container">
                {loading ? (
                    <p className="page-state">Loading requests...</p>
                ) : filteredRequests.length === 0 ? (
                    <p className="page-state">
                        No {filter !== "all" ? filter : ""} requests found.
                    </p>
                ) : (
                    <div className="requests-table-wrapper">
                        <table className="requests-table">
                            <thead>
                                <tr>
                                    <th>Book</th>
                                    <th>Requester</th>
                                    <th>Request Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.map((request) => (
                                    <tr key={request.id}>
                                        <td className="book-cell">
                                            {request.book?.image && (
                                                <img
                                                    src={request.book.image}
                                                    alt={request.book?.title}
                                                    className="book-thumbnail"
                                                />
                                            )}
                                            <div className="book-info">
                                                <strong>
                                                    {request.book?.title ||
                                                        `Book ID: ${request.book}`}
                                                </strong>
                                                <p>
                                                    {request.book?.author ||
                                                        "Unknown"}
                                                </p>
                                            </div>
                                        </td>
                                        <td>
                                            {request.user_username || "Unknown"}
                                        </td>
                                        <td>
                                            {new Date(
                                                request.request_date,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <span
                                                className={getStatusBadgeClass(
                                                    request.status,
                                                )}
                                            >
                                                {getStatusLabel(request.status)}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            {request.status === "Pending" && (
                                                <>
                                                    <button
                                                        className="btn-approve"
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                request.id,
                                                                "Approved",
                                                            )
                                                        }
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="btn-reject"
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                request.id,
                                                                "Rejected",
                                                            )
                                                        }
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {request.status !== "Pending" && (
                                                <span className="status-locked">
                                                    {request.status ===
                                                    "Approved"
                                                        ? "Approved"
                                                        : "Rejected"}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}

export default BorrowRequestsManagement;
