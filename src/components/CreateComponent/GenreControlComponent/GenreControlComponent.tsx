import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../../redux/store";
import {IGenre} from "../../../models/IGenre";
import {movieActions} from "../../../redux/slices/movieSlice";

const GenreControlComponent = () => {

    const dispatch = useAppDispatch();
    const{genres, error} = useAppSelector(state => state.movieStore)
    const [selectedGenre, setSelectedGenre] = useState<IGenre | null>(null);
    const [genreName, setGenreName] = useState('');
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(movieActions.getAllGenres());
    }, []);

    const filteredGenres = genres.filter(g =>
        g.genre_name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (genre: IGenre) => {
        setSelectedGenre(genre);
        setGenreName(genre.genre_name);
        setMode('edit');
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (mode === 'create') {
            await dispatch(movieActions.createGenre({ id: 0, genre_name: genreName }));
        } else if (selectedGenre) {
            await dispatch(movieActions.updateGenre({ id: selectedGenre.id, payload: { genre_name: genreName } }));
        }
        handleReset();
        dispatch(movieActions.getAllGenres());
    };

    const handleDelete = async (id: number) => {
        await dispatch(movieActions.deleteGenre(id));
        dispatch(movieActions.getAllGenres());
    };

    const handleReset = () => {
        setSelectedGenre(null);
        setGenreName('');
        setMode('create');
    };





    return (
        <div>
            <h2>Управління жанрами</h2>

            <form onSubmit={handleSubmit}>
                <h3>{mode === 'create' ? 'Додати жанр' : `Редагувати: ${selectedGenre?.genre_name}`}</h3>
                <input
                    placeholder="Назва жанру"
                    value={genreName}
                    onChange={e => setGenreName(e.target.value)}
                    required
                />
                {error && <p style={{color: 'red'}}>{error}</p>}
                <button type="submit">{mode === 'create' ? 'Створити' : 'Зберегти'}</button>
                {mode === 'edit' && <button type="button" onClick={handleReset}>Скасувати</button>}
            </form>

            <input
                placeholder="Пошук жанру..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            <h3>Список жанрів</h3>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Назва</th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                {filteredGenres.map(genre => (
                    <tr key={genre.id}>
                        <td>{genre.id}</td>
                        <td>{genre.genre_name}</td>
                        <td>
                            <button onClick={() => handleSelect(genre)}>Редагувати</button>
                            <button onClick={() => handleDelete(genre.id)}>Видалити</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default GenreControlComponent;