import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { authServices } from "../../services/auth.services";
import { useNavigate } from 'react-router-dom';

const PasswordChangeComponent = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Паролі не співпадають');
            return;
        }
        if (!token) return;

        setIsLoading(true);
        setError(null);

        try {
            await authServices.recoveryChangePassword(token, { password });
            setSuccess(true);
            setTimeout(() => navigate('/auth'), 2000);
        } catch (e: any) {
            setError(e?.response?.data?.detail || 'Помилка. Посилання недійсне або застаріле.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) return (
        <div className="auth-layout">
            <div className="auth-card">
                <p className="auth-form__success">✅ Пароль успішно змінено! Перенаправлення...</p>
            </div>
        </div>
    );

    return (
        <div className="auth-layout">
            <div className="auth-card">
                <h2 className="auth-card__title">🔐 Новий пароль</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-form__group">
                        <label>Новий пароль</label>
                        <input
                            className="auth-form__input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="auth-form__group">
                        <label>Підтвердіть пароль</label>
                        <input
                            className="auth-form__input"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="auth-form__error">{error}</p>}
                    <button className="auth-form__btn" type="submit" disabled={isLoading}>
                        {isLoading ? 'Збереження...' : 'Змінити пароль'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PasswordChangeComponent;