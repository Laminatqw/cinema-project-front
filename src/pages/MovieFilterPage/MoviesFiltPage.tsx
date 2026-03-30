import { FC, useEffect } from 'react';
import Movies from "../../components/MoviesComponent/MoviesComponent";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { movieActions } from "../../redux/slices/movieSlice";
import MovieFilters from "../../components/MovieFilterComponent/MovieFilter";
import PaginationComponent from "../../components/PaginationComponent/PaginationComponent";
import './styles.css'
const MoviesFiltPage: FC = () => {
    const dispatch = useAppDispatch();
    const { movies, isLoaded, total_pages, filters } = useAppSelector(state => state.movieStore);


    useEffect(() => {
        dispatch(movieActions.getAllMovies());
    }, []);

    return (
        <div className={'all'}>
            <aside >
                <MovieFilters />
            </aside>
            <div className={'filmPag'}>
            <main style={{ flex: 1 }}>
                <h1>Фільми</h1>
                {!isLoaded ? <p>Завантаження...</p> : <Movies movies={movies} />}
            </main>

            </div>
        </div>
    );
};

export default MoviesFiltPage;