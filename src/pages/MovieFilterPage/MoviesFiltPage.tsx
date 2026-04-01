import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { sessionActions } from "../../redux/slices/sessionSlice";
import { movieActions } from "../../redux/slices/movieSlice";
import { ISession } from "../../models/ISession";
import { Link } from "react-router-dom";
import {hallActions} from "../../redux/slices/hallSlice";
import './styles.css';

const HALL_TYPES = ['standard', 'imax', '3d'];

const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 10; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push(date);
    }
    return dates;
};

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const formatDateLabel = (date: Date, index: number) => {
    if (index === 0) return 'Сьогодні';
    if (index === 1) return 'Завтра';
    return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' });
};

const MoviesFiltPage = () => {
    const dispatch = useAppDispatch();
    const { sessions } = useAppSelector(state => state.sessionStore);
    const { movies, genres } = useAppSelector(state => state.movieStore);
    const { halls } = useAppSelector(state => state.hallStore);

    const dates = generateDates();
    const [selectedDate, setSelectedDate] = useState(formatDate(dates[0]));
    const [selectedHallType, setSelectedHallType] = useState('');
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [openFilter, setOpenFilter] = useState<string | null>(null);

    useEffect(() => {
        dispatch(movieActions.getAllMovies({ size: 100 }));
        dispatch(movieActions.getAllGenres());
        dispatch(hallActions.getAllHalls());
    }, []);

    useEffect(() => {
        dispatch(sessionActions.getSessionsByDate({
            date: selectedDate,
            hall_type: selectedHallType || undefined,
        }));
    }, [selectedDate, selectedHallType]);

    // групуємо сесії по фільму
    const sessionsByMovie = sessions.reduce((acc, session) => {
        if (!acc[session.movie]) acc[session.movie] = [];
        acc[session.movie].push(session);
        return acc;
    }, {} as Record<number, ISession[]>);

    // фільтруємо по жанру якщо обрано
    const filteredMovieIds = Object.keys(sessionsByMovie)
        .map(Number)
        .filter(movieId => {
            if (selectedGenres.length === 0) return true;
            const movie = movies.find(m => m.id === movieId);
            return movie?.genres_detail.some(g => selectedGenres.includes(g.id));
        });

    const getHallType = (hallId: number) => halls.find(h => h.id === hallId)?.hall_type ?? '';

    return (
        <div className={'movie-filt-page'}>
            <div className={'movie-filt-page__inner'}>
            {/* Полоска з датами */}
            <div className={'movie-filt-page__dates'}>
                {dates.map((date, index) => (
                    <button
                        key={formatDate(date)}
                        onClick={() => setSelectedDate(formatDate(date))}
                        className={`movie-filt-page__date-btn ${selectedDate === formatDate(date) ? 'is-active' : ''}`}
                    >
                        {formatDateLabel(date, index)}
                    </button>
                ))}
            </div>

            {/* Фільтри */}
            <div className={'movie-filt-page__filters'}>

                {/* Формат */}
                <div className={'movie-filt-page__filter-wrap'}>
                    <button
                        onClick={() => setOpenFilter(openFilter === 'format' ? null : 'format')}
                        className={'movie-filt-page__filter-btn'}
                    >
                        Формат {selectedHallType ? `(${selectedHallType.toUpperCase()})` : '▾'}
                    </button>
                    {openFilter === 'format' && (
                        <div className={'movie-filt-page__dropdown'}>
                            <div
                                onClick={() => { setSelectedHallType(''); setOpenFilter(null); }}
                                className={'movie-filt-page__dropdown-item'}
                            >
                                Всі
                            </div>
                            {HALL_TYPES.map(type => (
                                <div
                                    key={type}
                                    onClick={() => { setSelectedHallType(type); setOpenFilter(null); }}
                                    className={`movie-filt-page__dropdown-item ${selectedHallType === type ? 'is-selected' : ''}`}
                                >
                                    {type.toUpperCase()}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Жанр */}
                <div className={'movie-filt-page__filter-wrap'}>
                    <button
                        onClick={() => setOpenFilter(openFilter === 'genre' ? null : 'genre')}
                        className={'movie-filt-page__filter-btn'}
                    >
                        Жанр {selectedGenres.length > 0 ? `(${selectedGenres.length})` : '▾'}
                    </button>
                    {openFilter === 'genre' && (
                        <div className={'movie-filt-page__dropdown movie-filt-page__dropdown--scroll'}>
                            {genres.map(genre => (
                                <label key={genre.id} className={'movie-filt-page__genre-item'}>
                                    <input
                                        type="checkbox"
                                        checked={selectedGenres.includes(genre.id)}
                                        onChange={() => setSelectedGenres(prev =>
                                            prev.includes(genre.id)
                                                ? prev.filter(g => g !== genre.id)
                                                : [...prev, genre.id]
                                        )}
                                    />
                                    {genre.genre_name}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Скинути */}
                {(selectedHallType || selectedGenres.length > 0) && (
                    <button
                        onClick={() => { setSelectedHallType(''); setSelectedGenres([]); }}
                        className={'movie-filt-page__reset-btn'}
                    >
                        Скинути
                    </button>
                )}
            </div>

            {/* Список фільмів з сесіями */}
            <div className={'movie-filt-page__movies'}>
                {filteredMovieIds.length === 0 ? (
                    <p className={'movie-filt-page__empty'}>Немає сеансів на цю дату</p>
                ) : (
                    filteredMovieIds.map(movieId => {
                        const movie = movies.find(m => m.id === movieId);
                        if (!movie) return null;
                        const movieSessions = sessionsByMovie[movieId];

                        return (
                            <div key={movieId} className={'movie-filt-page__movie-row'}>
                                {/* Постер */}
                                <Link to={`/movies/${movie.id}`} className={'movie-filt-page__poster-link'}>
                                    {movie.picture
                                        ? <img src={movie.picture} alt={movie.name} className={'movie-filt-page__poster'} />
                                        : <div className={'movie-filt-page__poster movie-filt-page__poster--placeholder'}>🎬</div>
                                    }
                                </Link>

                                {/* Інфо */}
                                <div className={'movie-filt-page__movie-info'}>
                                    <Link to={`/movies/${movie.id}`} className={'movie-filt-page__movie-link'}>
                                        <h3 className={'movie-filt-page__movie-title'}>{movie.name}</h3>
                                    </Link>
                                    <p className={'movie-filt-page__movie-meta'}>
                                        {movie.genres_detail.map(g => g.genre_name).join(', ')} · {movie.length} хв · {movie.rating}/10
                                    </p>

                                    {/* Сесії */}
                                    <div className={'movie-filt-page__sessions'}>
                                        {movieSessions.map(session => (
                                            <Link
                                                key={session.id}
                                                to={`/sessions/${session.id}/seats`}
                                                className={'movie-filt-page__session-link'}
                                            >
                                                <div className={'movie-filt-page__session-card'}>
                                                    <div className={'movie-filt-page__session-time'}>
                                                        {session.start_time ? new Date(session.start_time).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }) : '—'}
                                                    </div>
                                                    <div className={'movie-filt-page__session-type'}>
                                                        {getHallType(session.hall).toUpperCase()}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            </div>
        </div>
    );
};

export default MoviesFiltPage;