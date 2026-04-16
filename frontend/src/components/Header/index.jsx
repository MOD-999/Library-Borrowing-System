import { Link, NavLink } from "react-router-dom";
import "./style.css";

function Header() {
    return (
        <header className="header">
            <div className="header-inner">
                <Link className="header-brand" to="/books">
                    Library Borrowing System
                </Link>
                <nav className="header-nav" aria-label="Main navigation">
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? "header-link is-active" : "header-link"
                        }
                        to="/books"
                    >
                        Books
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? "header-link is-active" : "header-link"
                        }
                        to="/login"
                    >
                        Login
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? "header-link is-active" : "header-link"
                        }
                        to="/register"
                    >
                        Register
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}

export default Header;
