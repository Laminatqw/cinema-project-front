import {Link} from "react-router-dom";
import './Header.css'
import MovieSearch from "../MovieSearchBar/MovieSearch";
import {useAppSelector} from "../../redux/store";
import {RootState} from "@reduxjs/toolkit/query";
const HeaderComponent = () => {

    const user = useAppSelector(state=> state.userStore.user);

    return (
        <div className={'header'}>
            <div><Link to={'/movies'}>to movies</Link></div>
            <br/>
            <div><Link to={'/'}>to homepage</Link></div>
            <br/>
            <div><Link to={'/filter'}>to filter</Link></div>
            <div>
                {user
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