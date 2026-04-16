import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            api.defaults.headers.common.Authorization = `Token ${token}`;
        } else {
            delete api.defaults.headers.common.Authorization;
        }
        setLoading(false);
    }, [token]);

    const login = (authToken, userData) => {
        setToken(authToken);
        setUser(userData);
        localStorage.setItem("token", authToken);
        localStorage.setItem("user", JSON.stringify(userData));
        api.defaults.headers.common.Authorization = `Token ${authToken}`;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete api.defaults.headers.common.Authorization;
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
