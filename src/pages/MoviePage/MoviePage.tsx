import  {useEffect} from 'react';
import Movies from "../../components/MoviesComponent/MoviesComponent";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {movieActions} from "../../redux/slices/movieSlice";

const MoviePage = () => {

    let dispatch = useAppDispatch();

    let {movies, isLoaded, error} = useAppSelector(state => state.movieStore);

    useEffect(() => {
        dispatch(movieActions.getAllMovies());
    }, []);
    console.log('пиво')
    return (
        <div>
            <Movies movies={movies}/>
        </div>
    );
};

export default MoviePage;