import React, { useState } from 'react';
import { useAppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { TokenObtainPair } from "../../models/TokenObtainPair";
import { IRegisterModel } from "../../models/IRegisterModel";
import { authActions } from "../../redux/slices/authSlice";
import { userActions } from "../../redux/slices/userSlice";
import { userServices } from "../../services/user.services";
import { authServices } from "../../services/auth.services";
import './styles.css';

type AuthTab = 'login' | 'register' | 'recovery';

const AuthLayout = () => {
    const [activeTab, setActiveTab] = useState<AuthTab>('login');

    return (
        <div className="auth-layout">
            <div className="auth-card">
                <h2 className="auth-card__title">🎬 CinemaApp</h2>

                {/* Tabs */}
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${activeTab === 'login' ? 'auth-tab--active' : ''}`}
                        onClick={() => setActiveTab('login')}
                    >
                        Вхід
                    </button>
                    <button
                        className={`auth-tab ${activeTab === 'register' ? 'auth-tab--active' : ''}`}
                        onClick={() => setActiveTab('register')}
                    >
                        Реєстрація
                    </button>
                    <button
                        className={`auth-tab ${activeTab === 'recovery' ? 'auth-tab--active' : ''}`}
                        onClick={() => setActiveTab('recovery')}
                    >
                        Відновлення
                    </button>
                </div>

                {/* Content */}
                <div className="auth-content">
                    {activeTab === 'login' && <LoginForm onForgot={() => setActiveTab('recovery')} />}
                    {activeTab === 'register' && <RegisterForm />}
                    {activeTab === 'recovery' && <RecoveryForm onBack={() => setActiveTab('login')} />}
                </div>
            </div>
        </div>
    );
};

// ===== LOGIN =====
const LoginForm = ({ onForgot }: { onForgot: () => void }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<TokenObtainPair>({ email: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        const result = await dispatch(authActions.authenticateUser(formData));
        if (authActions.authenticateUser.fulfilled.match(result)) {
            await dispatch(userActions.getUserInfo());
            navigate('/');
        } else {
            setError(result.payload as string);
        }
        setIsLoading(false);
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__group">
                <label>Email</label>
                <input className="auth-form__input" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="auth-form__group">
                <label>Пароль</label>
                <input className="auth-form__input" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            </div>
            {error && <p className="auth-form__error">{error}</p>}
            <button className="auth-form__btn" type="submit" disabled={isLoading}>
                {isLoading ? 'Завантаження...' : 'Увійти'}
            </button>
            <button className="auth-form__link" type="button" onClick={onForgot}>
                Забули пароль?
            </button>
        </form>
    );
};

// ===== REGISTER =====
const RegisterForm = () => {
    const [formData, setFormData] = useState<IRegisterModel>({
        email: '', password: '',
        profile: { name: '', surname: '', age: 0 },
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (['name', 'surname', 'age'].includes(name)) {
            setFormData(prev => ({
                ...prev,
                profile: { ...prev.profile, [name]: name === 'age' ? Number(value) : value },
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await userServices.register(formData);
            setSuccess(true);
        } catch (e: any) {
            setError(e?.response?.data?.detail || 'Помилка реєстрації');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) return (
        <p className="auth-form__success">✅ Реєстрація успішна! Перевірте пошту для активації акаунту.</p>
    );

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__group">
                <label>Email</label>
                <input className="auth-form__input" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="auth-form__group">
                <label>Пароль</label>
                <input className="auth-form__input" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="auth-form__group">
                <label>Ім'я</label>
                <input className="auth-form__input" name="name" type="text" placeholder="Іван" value={formData.profile.name} onChange={handleChange} required />
            </div>
            <div className="auth-form__group">
                <label>Прізвище</label>
                <input className="auth-form__input" name="surname" type="text" placeholder="Іваненко" value={formData.profile.surname} onChange={handleChange} required />
            </div>
            <div className="auth-form__group">
                <label>Вік</label>
                <input className="auth-form__input" name="age" type="number" placeholder="18" value={formData.profile.age || ''} onChange={handleChange} required />
            </div>
            {error && <p className="auth-form__error">{error}</p>}
            <button className="auth-form__btn" type="submit" disabled={isLoading}>
                {isLoading ? 'Завантаження...' : 'Зареєструватися'}
            </button>
        </form>
    );
};

// ===== RECOVERY =====
const RecoveryForm = ({ onBack }: { onBack: () => void }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
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
        <p className="auth-form__success">✅ Лист надіслано на {email}. Перевірте пошту.</p>
    );

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <p className="auth-form__hint">Введіть email і ми надішлемо посилання для відновлення пароля.</p>
            <div className="auth-form__group">
                <label>Email</label>
                <input className="auth-form__input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            {error && <p className="auth-form__error">{error}</p>}
            <button className="auth-form__btn" type="submit" disabled={isLoading}>
                {isLoading ? 'Відправляємо...' : 'Відправити'}
            </button>
            <button className="auth-form__link" type="button" onClick={onBack}>
                ← Назад до входу
            </button>
        </form>
    );
};

export default AuthLayout;