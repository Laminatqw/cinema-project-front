import { FC, useEffect } from 'react';
import Movies from "../../components/MoviesComponent/MoviesComponent";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {movieActions} from "../../redux/slices/movieSlice";
import MovieFilters from "../../components/MovieFilterComponent/MovieFilter";

const MoviesFiltPage: FC = () => {
    const dispatch = useAppDispatch();
    let {movies, isLoaded, error} = useAppSelector(state => state.movieStore);
    useEffect(() => {
        dispatch(movieActions.getAllMovies());
    }, []);

    return (
        <div>
            <h1>Movies</h1>
            <MovieFilters />
            <Movies movies={movies}/>
        </div>
    );
};

export default MoviesFiltPage;