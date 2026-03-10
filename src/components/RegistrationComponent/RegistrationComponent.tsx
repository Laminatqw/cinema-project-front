import React, {useState} from 'react';
import {IRegisterModel} from "../../models/IRegisterModel";
import {userServices} from "../../services/user.services";

const RegistrationComponent = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState<IRegisterModel>({
        email: "",
        password: "",
        profile: {
            name: "",
            surname: "",
            age: 0,
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (["name", "surname", "age"].includes(name)) {
            setFormData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    [name]: name === "age" ? Number(value) : value,
                },
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await userServices.register(formData);
            setSuccess(true);
        } catch (e: any) {
            setError(e?.response?.data?.detail || "Помилка реєстрації");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return <p>Реєстрація успішна! Перевірте пошту для активації акаунту.</p>;
    }

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
            <input
                name="name"
                type="text"
                placeholder="Ім'я"
                value={formData.profile.name}
                onChange={handleChange}
                required
            />
            <input
                name="surname"
                type="text"
                placeholder="Прізвище"
                value={formData.profile.surname}
                onChange={handleChange}
                required
            />
            <input
                name="age"
                type="number"
                placeholder="Вік"
                value={formData.profile.age || ""}
                onChange={handleChange}
                required
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button type="submit" disabled={isLoading}>
                {isLoading ? "Завантаження..." : "Зареєструватися"}
            </button>
        </form>
    );
};

export default RegistrationComponent;