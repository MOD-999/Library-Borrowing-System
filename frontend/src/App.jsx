import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Books from "./pages/Books";
import Header from "./components/Header";
import Login from "./pages/Login";
import "./App.css";
import Register from "./pages/Register";
import BookDetail from "./pages/BookDetails";
import UserProfile from "./pages/UserProfile";
import BorrowRequestsManagement from "./pages/BorrowRequestsManagement";

function App() {
    return (
        <BrowserRouter>
            <div className="layout">
                <Header />
                <main className="content">
                    <Routes>
                        <Route path="/books" element={<Books />} />
                        <Route path="/books/:id" element={<BookDetail />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route
                            path="/borrow-requests-management"
                            element={<BorrowRequestsManagement />}
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<Books />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
