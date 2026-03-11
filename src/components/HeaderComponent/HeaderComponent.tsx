import {Link} from "react-router-dom";
import './Header.css'
import MovieSearch from "../MovieSearchBar/MovieSearch";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {RootState} from "@reduxjs/toolkit/query";
import {useEffect, useState} from "react";
import {userActions} from "../../redux/slices/userSlice";
import UserHeaderComponent from "./UserHeaderComponent";
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

    return (
        <div className={'header'}>
            <div><Link to={'/movies'}>to movies</Link></div>
            <br/>
            <div><Link to={'/'}>to homepage</Link></div>
            <br/>
            <div><Link to={'/filter'}>to filter</Link></div>
            <UserHeaderComponent/>
            <div>{user?.is_staff && <Link to={'/admin'}>Адмін панель</Link>}</div>
            <MovieSearch/>
        </div>

    );
};

export default HeaderComponent;