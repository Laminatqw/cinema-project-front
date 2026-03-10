import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {useAppDispatch} from "../../redux/store";
import {useNavigate} from "react-router-dom";
import {TokenObtainPair} from "../../models/TokenObtainPair";
import {authActions} from "../../redux/slices/authSlice";
import {userActions} from "../../redux/slices/userSlice";

const LoginationComponent = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    const [formData, setFormData] = useState<TokenObtainPair>({
        email: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const result = await dispatch(authActions.authenticateUser(formData));

        if (authActions.authenticateUser.fulfilled.match(result)) {
            await dispatch(userActions.getUserInfo());
            navigate("/");
        } else {
            setError(result.payload as string);
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                name="password"
                type="password"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
                required
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button type="submit" disabled={isLoading}>
                {isLoading ? "Завантаження..." : "Увійти"}
            </button>
        </form>
    );
};


export default LoginationComponent;