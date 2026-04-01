import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { IMovie } from "../../../models/IMovie";
import { movieActions } from "../../../redux/slices/movieSlice";
import { IGenre } from "../../../models/IGenre";
import PaginationComponent from "../../PaginationComponent/PaginationComponent";
import './styles.css'

const MovieControlComponent = () => {
    const dispatch = useAppDispatch();
    const {movies, genres, isLoaded, error, filters, total_pages} = useAppSelector(state => state.movieStore);

    const [selectedMovie, setSelectedMovie] = useState<IMovie | null>(null);
    const [formData, setFormData] = useState<Partial<IMovie>>({
        name: '',
        year: undefined,
        length: undefined,
        rating: undefined,
        trailer_link: '',
        is_now_showing: false,
        release_date: null,
        end_date: null,
    });
    const [pictureFile, setPictureFile] = useState<File | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [search, setSearch] = useState('');
    const [selectedGenres, setSelectedGenres] = useState<IGenre[]>([]);

    useEffect(() => {
        dispatch(movieActions.getAllMovies(filters));
        dispatch(movieActions.getAllGenres());
    }, [filters.size, filters.page]);

    const filteredMovies = movies.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox'
                ? checked
                : value === '' ? null : value,
        }));
    };

    const handleSelect = (movie: IMovie) => {
        setSelectedMovie(movie);
        setMode('edit');
        setSelectedGenres(movie.genres_detail);
        setFormData({
            name: movie.name,
            year: movie.year,
            length: movie.length,
            rating: movie.rating,
            trailer_link: movie.trailer_link,
            is_now_showing: movie.is_now_showing,
            release_date: movie.release_date,
            end_date: movie.end_date,

        });
    };

    const handleGenreToggle = (genre: IGenre) => {
        setSelectedGenres(prev =>
            prev.find(g => g.id === genre.id)
                ? prev.filter(g => g.id !== genre.id)
                : [...prev, genre]
        );
    };
    const handlePageChange = (page: number) => {
        dispatch(movieActions.setPage(page));
    };
    const handlePageSizeChange = (size: number) => {
        dispatch(movieActions.setPageSize(size));
    };


    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            genres: selectedGenres.map(g => g.id)
        } as unknown as IMovie;

        if (mode === 'create') {
            const result = await dispatch(movieActions.createMovie(payload));
            if (movieActions.createMovie.fulfilled.match(result) && pictureFile) {
                await dispatch(movieActions.loadPicture({id: result.payload.id, file: pictureFile}));
            }
        } else if (selectedMovie) {
            await dispatch(movieActions.updateMovie({id: selectedMovie.id, payload}));
            if (pictureFile) {
                await dispatch(movieActions.loadPicture({id: selectedMovie.id, file: pictureFile}));
            }
        }
        handleReset();
        dispatch(movieActions.getAllMovies());
    };

    const handleDelete = async (id: number) => {
        await dispatch(movieActions.deleteMovie(id));
        dispatch(movieActions.getAllMovies());
    };

    const handleReset = () => {
        setSelectedMovie(null);
        setMode('create');
        setSelectedGenres([]);
        setFormData({
            name: '', year: undefined, length: undefined,
            rating: undefined, trailer_link: '', is_now_showing: false,
            release_date: null, end_date: null,
        });
        setPictureFile(null);
    };

    return (
        <div className="movie-control">
            <h2 className="movie-control__title">Управління фільмами</h2>

            {/* ===== FORM ===== */}
            <form className="movie-form" onSubmit={handleSubmit}>
                <h3 className="movie-form__title">
                    {mode === 'create' ? 'Додати фільм' : `Редагувати: ${selectedMovie?.name}`}
                </h3>

                <div className="movie-form__grid">
                    <div className="movie-form__group">
                        <label>Назва</label>
                        <input className="movie-form__input" name="name" value={formData.name || ''}
                               onChange={handleChange} required/>
                    </div>

                    <div className="movie-form__group">
                        <label>Рік</label>
                        <input className="movie-form__input" name="year" type="number" value={formData.year || ''}
                               onChange={handleChange} required/>
                    </div>

                    <div className="movie-form__group">
                        <label>Тривалість</label>
                        <input className="movie-form__input" name="length" type="number" value={formData.length || ''}
                               onChange={handleChange} required/>
                    </div>

                    <div className="movie-form__group">
                        <label>Рейтинг</label>
                        <input className="movie-form__input" name="rating" type="number" step="0.1" min="0" max="10"
                               value={formData.rating || ''} onChange={handleChange}/>
                    </div>

                    <div className="movie-form__group movie-form__group--full">
                        <label>Трейлер</label>
                        <input className="movie-form__input" name="trailer_link" value={formData.trailer_link || ''}
                               onChange={handleChange}/>
                    </div>

                    <div className="movie-form__group">
                        <label>Дата виходу</label>
                        <input className="movie-form__input" name="release_date" type="date"
                               value={formData.release_date || ''} onChange={handleChange}/>
                    </div>

                    <div className="movie-form__group">
                        <label>Кінець прокату</label>
                        <input className="movie-form__input" name="end_date" type="date" value={formData.end_date || ''}
                               onChange={handleChange}/>
                    </div>

                    <div className="movie-form__group movie-form__checkbox">
                        <label>
                            <input type="checkbox" name="is_now_showing" checked={formData.is_now_showing || false}
                                   onChange={handleChange}/>
                            Зараз у прокаті
                        </label>
                    </div>
                </div>

                {/* Poster */}
                <div className="movie-form__poster">
                    <label>Постер</label>
                    <input type="file" onChange={e => setPictureFile(e.target.files?.[0] || null)}/>

                    {mode === 'edit' && selectedMovie?.picture && (
                        <img className="movie-form__preview" src={selectedMovie.picture} alt="poster"/>
                    )}
                </div>

                {/* Genres */}
                <div className="movie-form__genres">
                    <p>Жанри:</p>
                    <div className="movie-form__genres-list">
                        {genres.map(genre => (
                            <label key={genre.id} className="movie-form__genre-item">
                                <input
                                    type="checkbox"
                                    checked={!!selectedGenres.find(g => g.id === genre.id)}
                                    onChange={() => handleGenreToggle(genre)}
                                />
                                {genre.genre_name}
                            </label>
                        ))}
                    </div>
                </div>

                {error && <p className="movie-form__error">{error}</p>}

                <div className="movie-form__actions">
                    <button className="btn btn--primary" type="submit">
                        {mode === 'create' ? 'Створити' : 'Зберегти'}
                    </button>

                    {mode === 'edit' && (
                        <button className="btn btn--secondary" onClick={handleReset}>
                            Скасувати
                        </button>
                    )}
                </div>
            </form>

            {/* ===== SEARCH ===== */}
            <input
                className="movie-search"
                placeholder="Пошук фільму..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            {/* ===== TABLE ===== */}
            <h3 className="movie-list__title">Список фільмів</h3>

            {!isLoaded ? (
                <p className="loading">Завантаження...</p>
            ) : (
                <table className="movie-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Постер</th>
                        <th>Назва</th>
                        <th>Рік</th>
                        <th>Тривалість</th>
                        <th>Рейтинг</th>
                        <th>Жанри</th>
                        <th>У прокаті</th>
                        <th>Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredMovies.map(movie => (
                        <tr key={movie.id}>
                            <td>{movie.id}</td>

                            <td>
                                {movie.picture
                                    ? <img className="movie-table__poster" src={movie.picture} alt={movie.name}/>
                                    : '—'}
                            </td>

                            <td>{movie.name}</td>
                            <td>{movie.year}</td>
                            <td>{movie.length} хв</td>
                            <td>{movie.rating}</td>

                            <td className="movie-table__genres">
                                {movie.genres_detail.map(g => g.genre_name).join(', ')}
                            </td>

                            <td>{movie.is_now_showing ? '✅' : '❌'}</td>

                            <td className="movie-table__actions">
                                <button className="btn btn--edit" onClick={() => handleSelect(movie)}>Редагувати
                                </button>
                                <button className="btn btn--danger" onClick={() => handleDelete(movie.id)}>Видалити
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <div className="pagination-wrapper">
                <PaginationComponent
                    currentPage={filters.page || 1}
                    totalPages={total_pages || 1}
                    onPageChange={handlePageChange}
                    pageSize={filters.size || 10}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>
        </div>
    );
}

export default MovieControlComponent;