import {Link} from "react-router-dom";
import './Header.css'
import MovieSearch from "../MovieStringSearchComponent/MovieSearch";
const HeaderComponent = () => {
    return (
        <div className={'header'}>
            <div><Link to={'/movies'}>to movies</Link></div>
            <br/>
            <div><Link to={'/'}>to homepage</Link></div>
            <br/>
            <div><Link to={'/filter'}>to filter</Link></div>
            <MovieSearch/>
        </div>

    );
};

export default HeaderComponent;