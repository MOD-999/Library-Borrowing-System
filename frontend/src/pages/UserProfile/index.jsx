import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useBorrowRequests from "../../hooks/useBorrowRequests";
import RequestsList from "../../components/RequestsList";
import "./style.css";

function UserProfile() {
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();
    const { requests: borrowRequests, loading, error } = useBorrowRequests();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
        // Redirect staff to management page
        if (user?.is_staff) {
            navigate("/borrow-requests-management");
        }
    }, [token, user, navigate]);

    const handleLogout = () => {
        logout();
        navigate("/books");
    };

    if (!token) {
        return null;
    }

    return (
        <section className="page user-profile-page">
            <div className="page-top">
                <div className="profile-header">
                    <div className="profile-info">
                        <h1 className="page-title">My Profile</h1>
                        <p className="profile-username">
                            Welcome, {user?.username}!
                        </p>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <div className="profile-content">
                {loading ? (
                    <p className="page-state">Loading your requests...</p>
                ) : error ? (
                    <p className="page-state page-state-error">{error}</p>
                ) : borrowRequests.length === 0 ? (
                    <p className="page-state">
                        No borrow requests yet. Browse books and submit a
                        request!
                    </p>
                ) : (
                    <RequestsList borrowRequests={borrowRequests} />
                )}
            </div>
        </section>
    );
}

export default UserProfile;
