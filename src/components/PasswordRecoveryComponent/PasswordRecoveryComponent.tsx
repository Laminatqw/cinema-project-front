import { useState } from 'react';
import { authServices } from "../../services/auth.services";

const PasswordRecoveryComponent = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await authServices.requestPasswordRecover(email);
            setSuccess(true);
        } catch (e: any) {
            setError(e?.response?.data?.detail || 'Помилка. Перевірте email.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) return (
        <p>Лист для відновлення пароля надіслано на {email}. Перевірте пошту.</p>
    );

    return (
        <form onSubmit={handleSubmit}>
            <h2>Відновлення пароля</h2>
            <input
                type="email"
                placeholder="Введіть ваш email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Відправляємо...' : 'Відправити'}
            </button>
        </form>
    );
};

export default PasswordRecoveryComponent;