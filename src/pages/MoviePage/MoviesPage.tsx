import { useEffect } from 'react';
import Movies from "../../components/MoviesComponent/MoviesComponent";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { movieActions } from "../../redux/slices/movieSlice";
import './styles.css';

const MoviesPage = () => {

    let dispatch = useAppDispatch();

    let { movies, isLoaded, error } = useAppSelector(state => state.movieStore);

    useEffect(() => {
        dispatch(movieActions.getAllMovies())
    }, []);
    

    if (!isLoaded) return <div className={'movies-page movies-page__state'}>Завантаження фільмів...</div>
    return (
        <div className={'movies-page'}>
            <div className={'movies-page__inner'}>
                <h1 className={'movies-page__title'}>Фільми</h1>
                {error && <p className={'movies-page__error'}>{error}</p>}
                <Movies movies={movies}/>
            </div>
        </div>
    );
};

export default MoviesPage;