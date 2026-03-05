import {Link} from "react-router-dom";

const HeaderComponent = () => {
    return (
        <div>
        <li>

            <Link to={'/movies'}>to movies</Link>
            <br/>
            <Link to={'/'}>to homepage</Link>
        </li>
        </div>

    );
};

export default HeaderComponent;