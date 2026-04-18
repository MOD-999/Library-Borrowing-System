import { useState } from "react";
import api from "../../utils/api";
import { useLogin } from "../../hooks/useLogin";
import "./style.css";

const RegisterForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [loading, setLoading] = useState(false);

    const { loginUser } = useLogin();

    const checkUsernameAvailability = async (username) => {
        if (!username) {
            setUsernameError("");
            return;
        }

        try {
            const response = await api.get(
                `/user/check-username/?username=${username}`,
            );
            if (response.data.exists) {
                setUsernameError("Username already taken");
            } else {
                setUsernameError("");
            }
        } catch (err) {
            setUsernameError("");
        }
    };

    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        setTimeout(() => checkUsernameAvailability(value), 500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Password do not match");
            return;
        }

        if (usernameError) {
            setError("Username is not available");
            return;
        }

        setLoading(true);
        try {
            await registerUser();
            await loginUser(username, password);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    err.response?.data?.username?.[0] ||
                    "Registration failed. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    };

    const registerUser = async () => {
        const registerResponse = await api.post("/user/register/", {
            username,
            email,
            password,
        });
    };

    return (
        <div className="register-container">
            <h2>Create Account</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        required
                    />
                    {usernameError && (
                        <span className="field-error">{usernameError}</span>
                    )}
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={loading || !!usernameError}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
