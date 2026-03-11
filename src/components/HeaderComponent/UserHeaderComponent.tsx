import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {userActions} from "../../redux/slices/userSlice";
import {useAppDispatch, useAppSelector} from "../../redux/store";

const UserHeaderComponent = () => {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const user = useAppSelector(state=> state.userStore.user);
    const isLoaded = useAppSelector(state => state.userStore.isLoaded)
    const dispatch = useAppDispatch();

    return (
        <div>
            {!isLoaded
                ? null // або <span>...</span> поки завантажується
                : user
                    ? <div
                        style={{position: 'relative', display: 'inline-block'}}
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                    >
                        <span style={{cursor: 'pointer'}}>{user.profile?.name || user.email}</span>

                        {dropdownOpen && (
                            <div style={{position: 'absolute', top: '100%', right: 0}}>
                                <Link to={'/account'}>Account</Link>
                                <button onClick={
                                    () =>

                                        dispatch(userActions.logoutUser())}>Logout
                                </button>
                            </div>
                        )}
                    </div>
                    : <span>
                            <Link to={'/register'}>to register</Link>
                            <br/>
                            <Link to={'/login'}>to login</Link>
                        </span>
            }
        </div>
    );
};

export default UserHeaderComponent;