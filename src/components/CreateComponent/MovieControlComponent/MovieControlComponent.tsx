import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { IMovie } from "../../../models/IMovie";
import { movieActions } from "../../../redux/slices/movieSlice";
import { IGenre } from "../../../models/IGenre";
import PaginationComponent from "../../PaginationComponent/PaginationComponent";
import './styles.css'

const MovieControlComponent = () => {
    const dispatch = useAppDispatch();
    const { movies, genres, isLoaded, error, filters, total_pages } = useAppSelector(state => state.movieStore);

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
        const { name, value, type, checked } = e.target;
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
                await dispatch(movieActions.loadPicture({ id: result.payload.id, file: pictureFile }));
            }
        } else if (selectedMovie) {
            await dispatch(movieActions.updateMovie({ id: selectedMovie.id, payload }));
            if (pictureFile) {
                await dispatch(movieActions.loadPicture({ id: selectedMovie.id, file: pictureFile }));
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
        <div>
            <h2>Управління фільмами</h2>

            <form onSubmit={handleSubmit}>
                <h3>{mode === 'create' ? 'Додати фільм' : `Редагувати: ${selectedMovie?.name}`}</h3>

                <div>
                    <label>Назва</label>
                    <input name="name" placeholder="Назва" value={formData.name || ''} onChange={handleChange} required />
                </div>
                <div>
                    <label>Рік</label>
                    <input name="year" type="number" placeholder="Рік" value={formData.year || ''} onChange={handleChange} required />
                </div>
                <div>
                    <label>Тривалість (хв)</label>
                    <input name="length" type="number" placeholder="Тривалість" value={formData.length || ''} onChange={handleChange} required />
                </div>
                <div>
                    <label>Рейтинг</label>
                    <input name="rating" type="number" step="0.1" min="0" max="10" placeholder="Рейтинг" value={formData.rating || ''} onChange={handleChange} />
                </div>
                <div>
                    <label>Посилання на трейлер</label>
                    <input name="trailer_link" placeholder="https://..." value={formData.trailer_link || ''} onChange={handleChange} />
                </div>
                <div>
                    <label>Дата виходу</label>
                    <input name="release_date" type="date" value={formData.release_date || ''} onChange={handleChange} />
                </div>
                <div>
                    <label>Дата завершення прокату</label>
                    <input name="end_date" type="date" value={formData.end_date || ''} onChange={handleChange} />
                </div>
                <div>
                    <label>
                        <input name="is_now_showing" type="checkbox" checked={formData.is_now_showing || false} onChange={handleChange} />
                        Зараз у прокаті
                    </label>
                </div>
                <div>
                    <label>Постер</label>
                    <input type="file" accept="image/*" onChange={e => setPictureFile(e.target.files?.[0] || null)} />
                    {mode === 'edit' && selectedMovie?.picture && (
                        <img src={selectedMovie.picture} alt="poster" style={{ width: '80px', marginLeft: '10px' }} />
                    )}
                </div>

                <div>
                    <p>Жанри:</p>
                    {genres.map(genre => (
                        <label key={genre.id} style={{ marginRight: '10px' }}>
                            <input
                                type="checkbox"
                                checked={!!selectedGenres.find(g => g.id === genre.id)}
                                onChange={() => handleGenreToggle(genre)}
                            />
                            {genre.genre_name}
                        </label>
                    ))}
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit">{mode === 'create' ? 'Створити' : 'Зберегти'}</button>
                {mode === 'edit' && <button type="button" onClick={handleReset}>Скасувати</button>}
            </form>

            <input
                placeholder="Пошук фільму..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            <h3>Список фільмів</h3>
            {!isLoaded ? <p>Завантаження...</p> : (
                <table className={'movieControlTable'}>
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
                                    ? <img src={movie.picture} alt={movie.name} style={{ width: '50px' }} />
                                    : '—'
                                }
                            </td>
                            <td>{movie.name}</td>
                            <td>{movie.year}</td>
                            <td>{movie.length} хв</td>
                            <td>{movie.rating}</td>
                            <td className={'genres'}>{movie.genres_detail.map(g => g.genre_name).join(', ')}</td>
                            <td>{movie.is_now_showing ? '✅' : '❌'}</td>
                            <td>
                                <button onClick={() => handleSelect(movie)}>Редагувати</button>
                                <button onClick={() => handleDelete(movie.id)}>Видалити</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            <PaginationComponent currentPage={filters.page || 1}
                                 totalPages={total_pages || 1}
                                 onPageChange={handlePageChange}
                                 pageSize={filters.size ||10}
                                onPageSizeChange={handlePageSizeChange}/>
        </div>
    );
};

export default MovieControlComponent;