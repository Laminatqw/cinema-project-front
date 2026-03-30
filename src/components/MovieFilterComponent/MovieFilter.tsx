import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { movieActions } from "../../redux/slices/movieSlice";

const MovieFilters: FC = () => {
    const dispatch = useAppDispatch();
    const filters = useAppSelector(state => state.movieStore.filters);
    const genres = useAppSelector(state => state.movieStore.genres);

    const [name, setName] = useState(filters.name || '');
    const [ratingGte, setRatingGte] = useState<string>(filters.rating__gte?.toString() || '');
    const [ratingLte, setRatingLte] = useState<string>(filters.rating__lte?.toString() || '');
    const [lengthGte, setLengthGte] = useState<string>(filters.length__gte?.toString() || '');
    const [lengthLte, setLengthLte] = useState<string>(filters.length__lte?.toString() || '');
    const [yearExact, setYearExact] = useState<string>(filters.year__exact?.toString() || '');
    const [yearGte, setYearGte] = useState<string>(filters.year__gte?.toString() || '');
    const [yearLte, setYearLte] = useState<string>(filters.year__lte?.toString() || '');
    const [isNowShowing, setIsNowShowing] = useState<'yes' | 'no' | ''>(filters.is_now_showing || '');
    const [selectedGenres, setSelectedGenres] = useState<number[]>(filters.genre || []);

    useEffect(() => {
        dispatch(movieActions.getAllGenres());
    }, []);

    const handleGenreToggle = (id: number) => {
        setSelectedGenres(prev =>
            prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
        );
    };

    const handleApply = () => {
        const newFilters = {
            name: name || undefined,
            rating__gte: ratingGte ? Number(ratingGte) : undefined,
            rating__lte: ratingLte ? Number(ratingLte) : undefined,
            length__gte: lengthGte ? Number(lengthGte) : undefined,
            length__lte: lengthLte ? Number(lengthLte) : undefined,
            year__exact: yearExact ? Number(yearExact) : undefined,
            year__gte: yearGte ? Number(yearGte) : undefined,
            year__lte: yearLte ? Number(yearLte) : undefined,
            is_now_showing: isNowShowing || undefined,
            genres: selectedGenres.length > 0 ? selectedGenres : undefined,
            page: 1,
        };
        dispatch(movieActions.getAllMovies(newFilters));
    };

    const handleReset = () => {
        setName('');
        setRatingGte('');
        setRatingLte('');
        setLengthGte('');
        setLengthLte('');
        setYearExact('');
        setYearGte('');
        setYearLte('');
        setIsNowShowing('');
        setSelectedGenres([]);
        dispatch(movieActions.getAllMovies({ page: 1 }));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3>Фільтри</h3>

            <div>
                <label>Назва</label>
                <input
                    placeholder="Пошук за назвою..."
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{ width: '100%' }}
                />
            </div>

            <div>
                <label>У прокаті</label>
                <select
                    value={isNowShowing}
                    onChange={e => setIsNowShowing(e.target.value as 'yes' | 'no' | '')}
                    style={{ width: '100%' }}
                >
                    <option value="">Всі</option>
                    <option value="yes">Зараз у прокаті</option>
                    <option value="no">Не в прокаті</option>
                </select>
            </div>

            <div>
                <label>Рейтинг</label>
                <div style={{ display: 'flex', gap: 5 }}>
                    <input
                        type="number" min="0" max="10" step="0.1"
                        placeholder="від" value={ratingGte}
                        onChange={e => setRatingGte(e.target.value)}
                        style={{ width: '50%' }}
                    />
                    <input
                        type="number" min="0" max="10" step="0.1"
                        placeholder="до" value={ratingLte}
                        onChange={e => setRatingLte(e.target.value)}
                        style={{ width: '50%' }}
                    />
                </div>
            </div>

            <div>
                <label>Тривалість (хв)</label>
                <div style={{ display: 'flex', gap: 5 }}>
                    <input
                        type="number" min="0"
                        placeholder="від" value={lengthGte}
                        onChange={e => setLengthGte(e.target.value)}
                        style={{ width: '50%' }}
                    />
                    <input
                        type="number" min="0"
                        placeholder="до" value={lengthLte}
                        onChange={e => setLengthLte(e.target.value)}
                        style={{ width: '50%' }}
                    />
                </div>
            </div>

            <div>
                <label>Рік (точно)</label>
                <input
                    type="number" placeholder="наприклад 2023"
                    value={yearExact}
                    onChange={e => setYearExact(e.target.value)}
                    style={{ width: '100%' }}
                />
            </div>

            <div>
                <label>Рік (діапазон)</label>
                <div style={{ display: 'flex', gap: 5 }}>
                    <input
                        type="number" placeholder="від"
                        value={yearGte}
                        onChange={e => setYearGte(e.target.value)}
                        style={{ width: '50%' }}
                    />
                    <input
                        type="number" placeholder="до"
                        value={yearLte}
                        onChange={e => setYearLte(e.target.value)}
                        style={{ width: '50%' }}
                    />
                </div>
            </div>

            <div>
                <label>Жанри</label>
                <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 150, overflowY: 'auto' }}>
                    {genres.map(genre => (
                        <label key={genre.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <input
                                type="checkbox"
                                checked={selectedGenres.includes(genre.id)}
                                onChange={() => handleGenreToggle(genre.id)}
                            />
                            {genre.genre_name}
                        </label>
                    ))}
                </div>
            </div>

            <button onClick={handleApply}>Застосувати</button>
            <button onClick={handleReset}>Скинути</button>
        </div>
    );
};

export default MovieFilters;