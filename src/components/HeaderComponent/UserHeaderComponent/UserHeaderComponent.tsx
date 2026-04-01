import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {userActions} from "../../../redux/slices/userSlice";
import {useAppDispatch, useAppSelector} from "../../../redux/store";
import './styles.css';

const UserHeaderComponent = () => {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const user = useAppSelector(state=> state.userStore.user);
    const isLoaded = useAppSelector(state => state.userStore.isLoaded)
    const dispatch = useAppDispatch();

    return (
        <div className={'user-header'}>
            {!isLoaded
                ? null // або <span>...</span> поки завантажується
                : user
                    ? <div
                        className={'user-header__menu'}
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                    >
                        <span className={'user-header__trigger'}>{user.profile?.name || user.email}</span>

                        {dropdownOpen && (
                            <div className={'user-header__dropdown'}>
                                <Link className={'user-header__dropdown-link'} to={'/account'}>Account</Link>
                                <button
                                    className={'user-header__logout-btn'}
                                    onClick={
                                    () =>

                                        dispatch(userActions.logoutUser())}>Logout
                                </button>
                            </div>
                        )}
                    </div>
                    : <div className={'user-header__auth-links'}>
                            <Link className={'user-header__auth-link'} to={'/register'}>to register</Link>
                            <Link className={'user-header__auth-link'} to={'/login'}>to login</Link>
                        </div>
            }
        </div>
    );
};

export default UserHeaderComponent;