import {Link} from "react-router-dom";
import './Header.css'
const HeaderComponent = () => {
    return (
        <div className={'header'}>
            <div><Link to={'/movies'}>to movies</Link></div>
            <br/>
            <div><Link to={'/'}>to homepage</Link></div>
        </div>

    );
};

export default HeaderComponent;