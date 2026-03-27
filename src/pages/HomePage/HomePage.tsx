import {useAppDispatch, useAppSelector} from "../../redux/store";
import {useEffect} from "react";
import {userActions} from "../../redux/slices/userSlice";
import {movieActions} from "../../redux/slices/movieSlice";
import {Link} from "react-router-dom";

const HomePage = () => {
    const dispatch = useAppDispatch();
    const { movies, isLoaded } = useAppSelector(state => state.movieStore);

    useEffect(() => {
        dispatch(movieActions.getAllMovies({ is_now_showing: 'yes' }));
    }, []);

    if (!isLoaded) return <div>Завантаження...</div>;

    return (
        <div>
            <h1>Зараз у прокаті</h1>
            {movies.length === 0 ? (
                <p>Немає активних фільмів</p>
            ) : (
                <div>
                    {movies.map(movie => (
                        <div key={movie.id}>
                            {movie.picture && (
                                <img src={movie.picture} alt={movie.name} style={{ width: 200 }} />
                            )}
                            <h3>{movie.name}</h3>
                            <Link to={`/movies/${movie.id}`}>Детальніше</Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


export default HomePage;