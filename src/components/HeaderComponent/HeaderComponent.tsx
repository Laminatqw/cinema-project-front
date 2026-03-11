import {Link} from "react-router-dom";
import './Header.css'
import MovieSearch from "../MovieSearchBar/MovieSearch";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {RootState} from "@reduxjs/toolkit/query";
import {useEffect} from "react";
import {userActions} from "../../redux/slices/userSlice";
const HeaderComponent = () => {

    const user = useAppSelector(state=> state.userStore.user);
    const isLoaded = useAppSelector(state => state.userStore.isLoaded)


    const dispatch = useAppDispatch();

    useEffect(() => {
        const tokenPair = localStorage.getItem('tokenPair');
        if (tokenPair) {
            dispatch(userActions.getUserInfo());
        }
    }, []);

    return (
        <div className={'header'}>
            <div><Link to={'/movies'}>to movies</Link></div>
            <br/>
            <div><Link to={'/'}>to homepage</Link></div>
            <br/>
            <div><Link to={'/filter'}>to filter</Link></div>
            <div>
                {!isLoaded
                    ? null // або <span>...</span> поки завантажується
                    : user
                        ? <span>{user.profile?.name}</span>
                        : <>
                            <Link to={'/register'}>to register</Link>
                            <br/>
                            <Link to={'/login'}>to login</Link>
                        </>
                }
            </div>
            <MovieSearch/>
        </div>

    );
};

export default HeaderComponent;