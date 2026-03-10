import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {authServices} from "../../services/auth.services";

const AccountActivationComponent = () => {
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        if (!token) return;

        authServices.activateAccount(token)
            .then(() => setStatus("success"))
            .catch(() => setStatus("error"));
    }, [token]);

    if (status === "loading") return <p>Активація акаунту...</p>;
    if (status === "success") return <p>Акаунт успішно активовано! Тепер можна увійти.</p>;
    return <p>Помилка активації. Посилання недійсне або застаріле.</p>;
};

export default AccountActivationComponent;