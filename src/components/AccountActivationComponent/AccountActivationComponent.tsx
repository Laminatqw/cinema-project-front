import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authServices } from "../../services/auth.services";
import './styles.css';

const AccountActivationComponent = () => {
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        if (!token) return;
        authServices.activateAccount(token)
            .then(() => setStatus("success"))
            .catch(() => setStatus("error"));
    }, [token]);

    return (
        <div className="activation">
            <div className="activation__card">
                {status === "loading" && (
                    <>
                        <div className="activation__spinner" />
                        <h2 className="activation__title">Активація акаунту...</h2>
                        <p className="activation__text">Зачекайте, будь ласка</p>
                    </>
                )}
                {status === "success" && (
                    <>
                        <div className="activation__icon activation__icon--success">✓</div>
                        <h2 className="activation__title">Акаунт активовано!</h2>
                        <p className="activation__text">Тепер ви можете увійти в систему</p>
                        <Link to="/auth" className="activation__btn">Увійти</Link>
                    </>
                )}
                {status === "error" && (
                    <>
                        <div className="activation__icon activation__icon--error">✕</div>
                        <h2 className="activation__title">Помилка активації</h2>
                        <p className="activation__text">Посилання недійсне або застаріле</p>
                        <Link to="/auth" className="activation__btn activation__btn--secondary">
                            На головну
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default AccountActivationComponent;