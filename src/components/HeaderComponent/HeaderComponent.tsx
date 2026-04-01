import {Link} from "react-router-dom";
import './styles.css'
import MovieSearch from "../MovieSearchBar/MovieSearch";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {useEffect, useState} from "react";
import {userActions} from "../../redux/slices/userSlice";
import UserHeaderComponent from "./UserHeaderComponent/UserHeaderComponent";
const HeaderComponent = () => {

    const user = useAppSelector(state=> state.userStore.user);
    const isLoaded = useAppSelector(state => state.userStore.isLoaded)


    const dispatch = useAppDispatch();

    useEffect(() => {
        const tokenPair = localStorage.getItem('tokenPair');
        if (tokenPair) {
            dispatch(userActions.getUserInfo());
        } else {
            dispatch(userActions.clearError()); // додатковий action
        }
    }, []);


    console.log('isLoaded:', isLoaded, 'user:', user);

    return (
        <div className={'header'}>
            <div className={'header__nav'}>
                <Link className={'header__link'} to={'/movies'}>to movies</Link>
                <Link className={'header__link'} to={'/'}>to homepage</Link>
                <Link className={'header__link'} to={'/filter'}>to filter</Link>
                {user?.is_staff && <Link className={'header__link header__link--admin'} to={'/admin'}>Адмін панель</Link>}
            </div>

            <div className={'header__actions'}>
                <MovieSearch/>
                <UserHeaderComponent/>
            </div>
        </div>

    );
};

export default HeaderComponent;