import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export const useLogin = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const loginUser = async (username, password) => {
        const loginResponse = await api.post("/auth/token/", {
            username,
            password,
        });

        const authToken = loginResponse.data.token;
        api.defaults.headers.common.Authorization = `Token ${authToken}`;

        const userResponse = await api.get("/user/me/");
        const userData = userResponse.data;

        login(authToken, userData);
        navigate("/books");
    };

    return { loginUser };
};
