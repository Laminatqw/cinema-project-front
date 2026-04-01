import React from 'react';
import {useAppSelector} from "../../redux/store";
import './styles.css';

const UserAccountComponent = () => {

    let user = useAppSelector(state => state.userStore.user)

    return (
        <div className={'account-card'}>
            <h1 className={'account-card__name'}>{user?.profile?.name} {user?.profile?.surname}</h1>
            <div className={'account-card__info'}>
                <span className={'account-card__label'}>Вік:</span>
                <span>{user?.profile?.age ?? '—'}</span>
            </div>
            <div className={'account-card__info'}>
                <span className={'account-card__label'}>Email:</span>
                <span>{user?.email ?? '—'}</span>
            </div>
        </div>
    );
};

export default UserAccountComponent;