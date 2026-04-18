import { Link, NavLink } from "react-router-dom";
import "./style.css";
import { useAuth } from "../../context/AuthContext";

function Header() {
    const { user, logout } = useAuth();
    return (
        <header className="header">
            <div className="header-inner">
                <Link className="header-brand" to="/books">
                    Library Borrowing System
                </Link>
                <nav className="header-nav" aria-label="Main navigation">
                    {navLink("Books")}
                    {user ? (
                        <>
                            {!user.is_staff && navLink("Profile")}
                            {user.is_staff && (
                                <NavLink
                                    className={({ isActive }) =>
                                        isActive
                                            ? "header-link is-active"
                                            : "header-link"
                                    }
                                    to="/borrow-requests-management"
                                >
                                    Management
                                </NavLink>
                            )}
                            <NavLink onClick={logout} className="header-link">
                                Logout
                            </NavLink>
                        </>
                    ) : (
                        <>
                            {navLink("Login")}
                            {navLink("Register")}
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

function navLink(page) {
    const link = "/" + page.toLowerCase();
    return (
        <NavLink
            className={({ isActive }) =>
                isActive ? "header-link is-active" : "header-link"
            }
            to={link}
        >
            {page}
        </NavLink>
    );
}

export default Header;
