import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {useParams} from "react-router-dom";
import {movieActions} from "../../redux/slices/movieSlice";
import MovieSessionsComponent from "../MovieSessionsComponent/MovieSessionComponent";
import './styles.css';

const getYoutubeEmbedUrl = (url: string): string | null => {
    try {
        const parsed = new URL(url);

        if (parsed.hostname.includes('youtu.be')) {
            const id = parsed.pathname.replace('/', '');
            return id ? `https://www.youtube.com/embed/${id}` : null;
        }

        if (parsed.hostname.includes('youtube.com')) {
            if (parsed.pathname.startsWith('/embed/')) return url;

            const id = parsed.searchParams.get('v');
            return id ? `https://www.youtube.com/embed/${id}` : null;
        }

        return null;
    } catch {
        return null;
    }
};

const MovieDetailComponent = () => {

    let {id} = useParams();

    let dispatch = useAppDispatch()

    let movie = useAppSelector(state => state.movieStore.movie)

    useEffect(() => {
        if (id) {
            dispatch(movieActions.getMovieById(+id))
        }
    }, [id]);

    if (!movie) return <p className={'movie-detail__state'}>Завантаження...</p>;
    const trailerEmbedUrl = movie.trailer_link ? getYoutubeEmbedUrl(movie.trailer_link) : null;
    console.log('trailer_link:', movie.trailer_link);
    console.log('embedUrl:', trailerEmbedUrl);

    return (
        <div className={'movie-detail'}>
            <div className={'movie-detail__header'}>
                {movie.picture && <img className={'movie-detail__poster'} src={movie.picture} alt={movie.name}/>}
                <div className={'movie-detail__info'}>
                    <h1 className={'movie-detail__title'}>{movie.name}</h1>
                    <p className={'movie-detail__meta'}>Рік: {movie.year}</p>
                    <p className={'movie-detail__meta'}>Тривалість: {movie.length} хв</p>
                    <p className={'movie-detail__meta'}>Рейтинг: {movie.rating}</p>
                    <p className={'movie-detail__meta'}>Жанри: {movie.genres_detail.map(g => g.genre_name).join(', ')}</p>
                    {movie.release_date && <p className={'movie-detail__meta'}>Дата виходу: {movie.release_date}</p>}
                    {movie.end_date && <p className={'movie-detail__meta'}>Останній показ: {movie.end_date}</p>}
                    <p className={`movie-detail__status ${movie.is_now_showing ? 'is-active' : 'is-inactive'}`}>
                        {movie.is_now_showing ? 'Зараз у прокаті' : 'Не в прокаті'}
                    </p>
                </div>
                {trailerEmbedUrl && (
                    <div className={'movie-detail__trailer-panel'}>
                        <iframe
                            className={'movie-detail__trailer-player'}
                            src={trailerEmbedUrl}
                            title={`Трейлер ${movie.name}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    </div>
                )}
            </div>
            
            <div className={'movie-detail__sessions'}>
                <MovieSessionsComponent movieId={movie.id} />
            </div>
        </div>
    );
};

export default MovieDetailComponent;