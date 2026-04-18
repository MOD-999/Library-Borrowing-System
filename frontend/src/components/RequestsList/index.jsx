import "./style.css";

function RequestsList({ borrowRequests }) {
    const getStatusBadgeClass = (status) => {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus === "approved") return "status-badge status-approved";
        if (lowerStatus === "pending") return "status-badge status-pending";
        if (lowerStatus === "rejected") return "status-badge status-rejected";
        return "status-badge";
    };

    const getStatusLabel = (status) => {
        if (!status) return status;
        const statusStr = String(status).toLowerCase().trim();
        if (statusStr === "approved") return "✓ Approved";
        if (statusStr === "pending") return "⏳ Pending";
        if (statusStr === "rejected") return "✗ Rejected";
        return status;
    };

    return (
        <div className="requests-list">
            {borrowRequests.map((request) => (
                <div key={request.id} className="request-card">
                    <div className="request-book-info">
                        {request.book.image && (
                            <img
                                src={request.book.image}
                                alt={request.book.title}
                                className="request-book-image"
                            />
                        )}
                        <div className="request-details">
                            <h3 className="request-book-title">
                                {request.book.title}
                            </h3>
                            <p className="request-book-author">
                                {request.book.author}
                            </p>
                            <p className="request-book-category">
                                {request.book.category}
                            </p>
                        </div>
                    </div>

                    <div className="request-meta">
                        <div className="request-dates">
                            <div className="date-info">
                                <span className="date-label">
                                    Request Date:
                                </span>
                                <span className="date-value">
                                    {new Date(
                                        request.request_date,
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                            {request.approval_date && (
                                <div className="date-info">
                                    <span className="date-label">
                                        Approval Date:
                                    </span>
                                    <span className="date-value">
                                        {new Date(
                                            request.approval_date,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className={getStatusBadgeClass(request.status)}>
                            {getStatusLabel(request.status)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RequestsList;
