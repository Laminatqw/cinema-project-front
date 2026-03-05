import {IMovie} from "../../models/IMovie";
import {FC} from "react";
import {Link} from "react-router-dom";


interface IProps{
    movies:IMovie[]
}

const Movies: FC<IProps> = ({movies}) =>{

    return (
        <ul>
            {
                movies.map(movie => (<li key={movie.name}>
                    <Link to={'/movies/'}>{movie.name}</Link>
                </li>))
            }
        </ul>
    )

}

export default Movies;