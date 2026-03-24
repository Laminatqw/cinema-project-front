import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { sessionActions } from "../../../redux/slices/sessionSlice";
import { movieActions } from "../../../redux/slices/movieSlice";
import { hallActions } from "../../../redux/slices/hallSlice";
import { ISession } from "../../../models/ISession";
import { ISession_price } from "../../../models/ISession_price";
import { SeatType } from "../../../models/IHallSeat";
import SearchSelect from "../../SearchSelectComponent/SearchSelectComponent";

const SEAT_TYPES: SeatType[] = ['regular', 'vip', 'disabled'];

const SessionControlComponent = () => {
    const dispatch = useAppDispatch();
    const { sessions, prices, error } = useAppSelector(state => state.sessionStore);
    const { movies } = useAppSelector(state => state.movieStore);
    const { halls } = useAppSelector(state => state.hallStore);

    // --- Session form ---
    const [selectedSession, setSelectedSession] = useState<ISession | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState<Partial<ISession>>({
        movie: undefined,
        hall: undefined,
        start_time: null,
        end_time: null,
        is_active: true,
    });

    // --- Price form ---
    const [showPrices, setShowPrices] = useState(false);
    const [priceFormData, setPriceFormData] = useState<Partial<ISession_price>>({
        seat_type: 'regular',
        price: 0,
    });
    const [editingPrice, setEditingPrice] = useState<ISession_price | null>(null);

    useEffect(() => {
        dispatch(sessionActions.getAllSessions());
        dispatch(movieActions.getAllMovies());
        dispatch(hallActions.getAllHalls());
    }, []);

    const filteredSessions = sessions.filter(s => {
        const movie = movies.find(m => m.id === s.movie);
        return movie?.name.toLowerCase().includes(search.toLowerCase()) ?? true;
    });

    // --- Session handlers ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox'
                ? (e.target as HTMLInputElement).checked
                : value === '' ? null : ['movie', 'hall'].includes(name) ? Number(value) : value,
        }));
    };

    const formatDateTime = (dt: string | null) => {
        if (!dt) return '';
        return dt.slice(0, 16); // '2024-01-15T14:30:00Z' -> '2024-01-15T14:30'
    };

    const handleSelect = (session: ISession) => {
        setSelectedSession(session);
        setMode('edit');
        setFormData({
            movie: session.movie,
            hall: session.hall,
            start_time: formatDateTime(session.start_time),
            end_time: formatDateTime(session.end_time),
        });
        setShowPrices(false);
    };
    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (mode === 'create') {
            await dispatch(sessionActions.createSession(formData));
        } else if (selectedSession) {
            await dispatch(sessionActions.updateSession({ id: selectedSession.id, payload: formData }));
        }
        handleReset();
        dispatch(sessionActions.getAllSessions());
    };

    const handleDelete = async (id: number) => {
        await dispatch(sessionActions.deleteSession(id));
    };

    const handleReset = () => {
        setSelectedSession(null);
        setMode('create');
        setFormData({ movie: undefined, hall: undefined, start_time: null, end_time: null, is_active: true });
        setShowPrices(false);
    };

    // --- Price handlers ---
    const handleOpenPrices = async (session: ISession) => {
        setSelectedSession(session);
        setShowPrices(true);
        await dispatch(sessionActions.getPrices(session.id));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPriceFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? Number(value) : value,
        }));
    };

    const handlePriceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSession) return;

        if (editingPrice) {
            await dispatch(sessionActions.updatePrice({
                sessionId: selectedSession.id,
                id: editingPrice.id,
                payload: priceFormData,
            }));
            setEditingPrice(null);
        } else {
            await dispatch(sessionActions.createPrice({
                sessionId: selectedSession.id,
                payload: { ...priceFormData, session: selectedSession.id },
            }));
        }
        setPriceFormData({ seat_type: 'regular', price: 0 });
        dispatch(sessionActions.getPrices(selectedSession.id));
    };

    const handleEditPrice = (price: ISession_price) => {
        setEditingPrice(price);
        setPriceFormData({ seat_type: price.seat_type, price: price.price });
    };

    const handleDeletePrice = async (id: number) => {
        if (!selectedSession) return;
        await dispatch(sessionActions.deletePrice({ sessionId: selectedSession.id, id }));
        dispatch(sessionActions.getPrices(selectedSession.id));
    };

    const getMovieName = (id: number) => movies.find(m => m.id === id)?.name ?? id;
    const getHallName = (id: number) => halls.find(h => h.id === id)?.title ?? id;

    return (
        <div>
            <h2>Управління сесіями</h2>

            {/* Форма сесії */}
            <form onSubmit={handleSubmit}>
                <h3>{mode === 'create' ? 'Додати сесію' : `Редагувати сесію #${selectedSession?.id}`}</h3>

                <div>
                    <label>Фільм</label>
                    <SearchSelect
                        items={movies}
                        value={formData.movie}
                        getLabel={m => m.name}
                        getId={m => m.id}
                        placeholder="Пошук фільму..."
                        onSelect={id => setFormData(prev => ({...prev, movie: id}))}
                    />
                </div>
                <div>
                    <label>Зал</label>
                    <SearchSelect
                        items={halls}
                        value={formData.hall}
                        getLabel={h => h.title}
                        getId={h => h.id}
                        placeholder="Пошук залу..."
                        onSelect={id => setFormData(prev => ({...prev, hall: id}))}
                    />
                </div>
                <div>
                    <label>Початок</label>
                    <input name="start_time" type="datetime-local" value={formData.start_time || ''}
                           onChange={handleChange} required/>
                </div>
                <div>
                    <label>Кінець</label>
                    <input name="end_time" type="datetime-local" value={formData.end_time || ''} onChange={handleChange}
                           required/>
                </div>

                {error && <p style={{color: 'red'}}>{error}</p>}
                <button type="submit">{mode === 'create' ? 'Створити' : 'Зберегти'}</button>
                {mode === 'edit' && <button type="button" onClick={handleReset}>Скасувати</button>}
            </form>

            {/* Редактор цін */}
            {showPrices && selectedSession && (
                <div>
                    <h3>Ціни для сесії #{selectedSession.id} — {getMovieName(selectedSession.movie)}</h3>

                    <form onSubmit={handlePriceSubmit}>
                    <select name="seat_type" value={priceFormData.seat_type} onChange={handlePriceChange}>
                            {SEAT_TYPES.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <input
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Ціна"
                            value={priceFormData.price || ''}
                            onChange={handlePriceChange}
                            required
                        />
                        <button type="submit">{editingPrice ? 'Зберегти' : 'Додати ціну'}</button>
                        {editingPrice && (
                            <button type="button" onClick={() => { setEditingPrice(null); setPriceFormData({ seat_type: 'regular', price: 0 }); }}>
                                Скасувати
                            </button>
                        )}
                    </form>

                    <table>
                        <thead>
                        <tr>
                            <th>Тип місця</th>
                            <th>Ціна</th>
                            <th>Дії</th>
                        </tr>
                        </thead>
                        <tbody>
                        {prices.map(price => (
                            <tr key={price.id}>
                                <td>{price.seat_type}</td>
                                <td>{price.price} грн</td>
                                <td>
                                    <button onClick={() => handleEditPrice(price)}>Редагувати</button>
                                    <button onClick={() => handleDeletePrice(price.id)}>Видалити</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Пошук */}
            <input
                placeholder="Пошук за назвою фільму..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ marginTop: 20 }}
            />

            {/* Список сесій */}
            <h3>Список сесій</h3>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Фільм</th>
                    <th>Зал</th>
                    <th>Початок</th>
                    <th>Кінець</th>
                    <th>Активна</th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                {filteredSessions.map(session => (
                    <tr key={session.id}>
                        <td>{session.id}</td>
                        <td>{getMovieName(session.movie)}</td>
                        <td>{getHallName(session.hall)}</td>
                        <td>{session.start_time ? new Date(session.start_time).toLocaleString('uk-UA') : '—'}</td>
                        <td>{session.end_time ? new Date(session.end_time).toLocaleString('uk-UA') : '—'}</td>
                        <td>{session.is_active ? '✅' : '❌'}</td>
                        <td>
                            <button onClick={() => handleSelect(session)}>Редагувати</button>
                            <button onClick={() => handleOpenPrices(session)}>Ціни</button>
                            <button onClick={() => handleDelete(session.id)}>Видалити</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default SessionControlComponent;