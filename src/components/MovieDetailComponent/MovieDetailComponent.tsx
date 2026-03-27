import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {useParams} from "react-router-dom";
import {movieActions} from "../../redux/slices/movieSlice";
import MovieSessionsComponent from "../MovieSessionsComponent/MovieSessionComponent";

const MovieDetailComponent = () => {

    let {id} = useParams();

    let dispatch = useAppDispatch()

    let movie = useAppSelector(state => state.movieStore.movie)

    useEffect(() => {
        if (id) {
            dispatch(movieActions.getMovieById(+id))
        }
    }, [id]);

    if (!movie) return <p>Завантаження...</p>;
    return (
        <div>
            {movie.picture && <img src={movie.picture} alt={movie.name}/>}
            <h1>{movie.name}</h1>
            <p>Рік: {movie.year}</p>
            <p>Тривалість: {movie.length} хв</p>
            <p>Рейтинг: {movie.rating}</p>
            <p>Жанри: {movie.genres_detail.map(g => g.genre_name).join(', ')}</p>
            {movie.release_date && <p>Дата виходу: {movie.release_date}</p>}
            {movie.end_date && <p>Останній показ: {movie.end_date}</p>}
            <p>{movie.is_now_showing ? '🟢 Зараз у прокаті' : '🔴 Не в прокаті'}</p>
            {movie.trailer_link && (
                <a href={movie.trailer_link} target="_blank" rel="noreferrer">
                    Дивитись трейлер
                </a>
            )}
            <MovieSessionsComponent movieId={movie.id} />
        </div>
    );
};

export default MovieDetailComponent;