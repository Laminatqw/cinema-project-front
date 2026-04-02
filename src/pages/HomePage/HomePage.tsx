import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { movieActions } from "../../redux/slices/movieSlice";
import { sessionActions } from "../../redux/slices/sessionSlice";
import { IMovie } from "../../models/IMovie";
import './styles.css';

const today = new Date().toISOString().split('T')[0];

const HomePage = () => {
    const dispatch = useAppDispatch();
    const { movies, isLoaded } = useAppSelector(state => state.movieStore);
    const { sessions } = useAppSelector(state => state.sessionStore);

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        dispatch(movieActions.getAllMovies({ is_now_showing: 'yes', size: 20 }));
    }, []);

    useEffect(() => {
        if (movies.length > 0) {
            dispatch(sessionActions.getSessionsByDate({ date: today, size: 100 }));
        }
    }, [movies]);

    const activeMovie: IMovie | null = movies[activeIndex] ?? null;

    const movieSessions = activeMovie
        ? sessions.filter(s => s.movie === activeMovie.id)
        : [];

    const prev = useCallback(() => {
        setActiveIndex(i => (i === 0 ? movies.length - 1 : i - 1));
    }, [movies.length]);

    const next = useCallback(() => {
        setActiveIndex(i => (i === movies.length - 1 ? 0 : i + 1));
    }, [movies.length]);

    if (!isLoaded) return <div className="home__loading">Завантаження...</div>;
    if (movies.length === 0) return <div className="home__empty">Немає активних фільмів</div>;

    return (
        <div className="home">
            {/* Hero */}
            <div
                className="home__hero"
                style={{
                    backgroundImage: activeMovie?.picture ? `url(${activeMovie.picture})` : undefined,
                }}
            >
                <div className="home__hero-overlay" />
                <div className={'home-arrow-films'}>
                {/* Стрілки */}
                <button className="home__arrow home__arrow--left" onClick={prev}>‹</button>
                {/*Афіші*/}
                <div className="home__slider">
                    {movies.map((movie, index) => (
                        <div
                            key={movie.id}
                            className={`home__slide ${index === activeIndex ? 'home__slide--active' : ''}`}
                            onClick={() => setActiveIndex(index)}
                        >
                            <div className="home__slide-poster-wrap">
                                {movie.picture
                                    ? <img className="home__slide-poster" src={movie.picture} alt={movie.name} />
                                    : <div className="home__slide-placeholder">🎬</div>
                                }
                            </div>
                            <p className="home__slide-title">{movie.name}</p>
                        </div>
                    ))}
                </div>
                <button className="home__arrow home__arrow--right" onClick={next}>›</button>
                </div>
                {/* Контент активного фільму */}
                {activeMovie && (
                    <div className="home__hero-content">
                        <h1 className="home__hero-title">{activeMovie.name}</h1>
                        <div className="home__hero-meta">
                            <span>{activeMovie.year}</span>
                            <span>{activeMovie.length} хв</span>
                            <span>⭐ {activeMovie.rating}</span>
                            <span>{activeMovie.genres_detail.map(g => g.genre_name).join(', ')}</span>
                        </div>

                        {/* Сесії на сьогодні */}
                        {movieSessions.length > 0 && (
                            <div className="home__sessions">
                                <p className="home__sessions-label">Сьогодні:</p>
                                <div className="home__sessions-list">
                                    {movieSessions.map(session => (
                                        <Link
                                            key={session.id}
                                            to={`/movies/${activeMovie.id}`}
                                            className="home__session-btn"
                                        >
                                            {session.start_time
                                                ? new Date(session.start_time).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
                                                : '—'
                                            }
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Link to={`/movies/${activeMovie.id}`} className="home__hero-btn">
                            Детальніше
                        </Link>
                    </div>
                )}
            </div>


        </div>
    );
};

export default HomePage;