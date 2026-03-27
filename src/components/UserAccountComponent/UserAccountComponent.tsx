import React from 'react';
import {useAppSelector} from "../../redux/store";

const UserAccountComponent = () => {

    let user = useAppSelector(state => state.userStore.user)

    return (
        <div>
            <h1>{user?.profile?.name} {user?.profile?.surname}</h1>
            <h2>{user?.profile?.age}</h2>
            <h2>{user?.email}</h2>
        </div>
    );
};

export default UserAccountComponent;