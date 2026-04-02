import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { sessionActions } from "../../../redux/slices/sessionSlice";
import { movieActions } from "../../../redux/slices/movieSlice";
import { hallActions } from "../../../redux/slices/hallSlice";
import { ISession, SessionStatus } from "../../../models/ISession";
import { ISession_price } from "../../../models/ISession_price";
import { SeatType } from "../../../models/IHallSeat";
import SearchSelect from "../../SearchSelectComponent/SearchSelectComponent";
import PaginationComponent from "../../PaginationComponent/PaginationComponent";
import {movieServices} from "../../../services/movie.services";
import {hallServices} from "../../../services/hall.services";
import {IHall} from "../../../models/IHall";
import {IMovie} from "../../../models/IMovie";
import './styles.css'


const SEAT_TYPES: SeatType[] = ['regular', 'vip', 'disabled'];

const STATUS_LABELS: Record<SessionStatus, string> = {
    upcoming: '🔵 Майбутня',
    active: '🟢 Активна',
    finished: '🔴 Завершена',
    unknown: '⚪ Невідомо',
};

const SessionControlComponent = () => {
    const dispatch = useAppDispatch();
    const { sessions, prices, error, total_pages, filters } = useAppSelector(state => state.sessionStore);
    const { movies } = useAppSelector(state => state.movieStore);
    const { halls } = useAppSelector(state => state.hallStore);

    const [selectedSession, setSelectedSession] = useState<ISession | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<SessionStatus | 'all'>('all');
    const [formData, setFormData] = useState<Partial<ISession>>({
        movie: undefined,
        hall: undefined,
        start_time: null,
        end_time: null,
    });

    const [showPrices, setShowPrices] = useState(false);
    const [priceFormData, setPriceFormData] = useState<Partial<ISession_price>>({
        seat_type: 'regular',
        price: 0,
    });
    const [editingPrice, setEditingPrice] = useState<ISession_price | null>(null);

    useEffect(() => {
        dispatch(sessionActions.getAllSessions(filters));
        dispatch(movieActions.getAllMovies());
        dispatch(hallActions.getAllHalls());
    }, [filters.size,filters.page]);

    const filteredSessions = sessions.filter(s => {
        const movie = movies.find(m => m.id === s.movie);
        const matchesSearch = movie?.name.toLowerCase().includes(search.toLowerCase()) ?? true;
        const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

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
        return dt.slice(0, 16);
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
        setFormData({ movie: undefined, hall: undefined, start_time: null, end_time: null });
        setShowPrices(false);
    };

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

    const handlePriceSubmit = async (e: React.SubmitEvent) => {
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

    const handlePageChange = (page: number) => {
        dispatch(sessionActions.setPage(page));
    };
    const handlePageSizeChange = (size: number) => {
        dispatch(sessionActions.setPageSize(size));
    };



    return (
        <div className="session-control">
            <h2 className="session-control__title">Управління сесіями</h2>

            {/* ===== FORM ===== */}
            <form className="session-form" onSubmit={handleSubmit}>
                <h3 className="session-form__title">
                    {mode === 'create' ? 'Додати сесію' : `Редагувати сесію #${selectedSession?.id}`}
                </h3>

                <div className="session-form__grid">
                    <div className="session-form__group">
                        <label>Фільм</label>
                        <div className="session-form__select">
                            <SearchSelect<IMovie>
                                fetchItems={async (query) => {
                                    const res = await movieServices.getAll({ name: query, size: 20 });
                                    return res.data;
                                }}
                                fetchById={async (id) => movieServices.getById(id)}
                                value={formData.movie}
                                getLabel={m => m.name}
                                getId={m => m.id}
                                placeholder="Пошук фільму..."
                                onSelect={id => setFormData(prev => ({ ...prev, movie: id }))}
                            />
                        </div>
                    </div>

                    <div className="session-form__group">
                        <label>Зал</label>
                        <div className="session-form__select">
                            <SearchSelect<IHall>
                                fetchItems={async (query) => {
                                    const res = await hallServices.getAll({ size: 20 });
                                    return res.data.filter((h: IHall) => h.title.toLowerCase().includes(query.toLowerCase()));
                                }}
                                fetchById={async (id) => hallServices.getById(id)}
                                value={formData.hall}
                                getLabel={h => h.title}
                                getId={h => h.id}
                                placeholder="Пошук залу..."
                                onSelect={id => setFormData(prev => ({ ...prev, hall: id }))}
                            />
                        </div>
                    </div>

                    <div className="session-form__group">
                        <label>Початок</label>
                        <input
                            className="session-form__input"
                            name="start_time"
                            type="datetime-local"
                            value={formData.start_time || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="session-form__group">
                        <label>Кінець</label>
                        <input
                            className="session-form__input"
                            name="end_time"
                            type="datetime-local"
                            value={formData.end_time || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {error && <p className="session-form__error">{error}</p>}

                <div className="session-form__actions">
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

            {/* ===== PRICES ===== */}
            {showPrices && selectedSession && (
                <div className="price-editor">
                    <h3 className="price-editor__title">
                        Ціни — #{selectedSession.id}
                    </h3>

                    <form className="price-form" onSubmit={handlePriceSubmit}>
                        <select
                            className="price-form__select"
                            name="seat_type"
                            value={priceFormData.seat_type}
                            onChange={handlePriceChange}
                        >
                            {SEAT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>

                        <input
                            className="price-form__input"
                            name="price"
                            type="number"
                            value={priceFormData.price || ''}
                            onChange={handlePriceChange}
                            required
                        />

                        <button className="btn btn--primary" type="submit">
                            {editingPrice ? 'Зберегти' : 'Додати'}
                        </button>

                        {editingPrice && (
                            <button className="btn btn--secondary" type="button">
                                Скасувати
                            </button>
                        )}
                    </form>

                    <table className="price-table">
                        <thead>
                        <tr>
                            <th>Тип</th>
                            <th>Ціна</th>
                            <th>Дії</th>
                        </tr>
                        </thead>
                        <tbody>
                        {prices.map(price => (
                            <tr key={price.id}>
                                <td>{price.seat_type}</td>
                                <td>{price.price} грн</td>
                                <td className="price-table__actions">
                                    <button className="btn btn--edit">Редагувати</button>
                                    <button className="btn btn--danger">Видалити</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ===== FILTERS ===== */}
            <div className="session-filters">
                <input
                    className="session-search"
                    placeholder="Пошук..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <select
                    className="session-filter"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as SessionStatus | 'all')}
                >
                    <option value="all">Всі</option>
                    <option value="upcoming">Майбутні</option>
                    <option value="active">Активні</option>
                    <option value="finished">Завершені</option>
                </select>
            </div>

            {/* ===== TABLE ===== */}
            <h3 className="session-list__title">Список сесій</h3>

            <table className="session-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Фільм</th>
                    <th>Зал</th>
                    <th>Початок</th>
                    <th>Кінець</th>
                    <th>Статус</th>
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

                        <td className={`session-status session-status--${session.status}`}>
                            {STATUS_LABELS[session.status]}
                        </td>

                        <td className="session-table__actions">
                            <button className="btn btn--edit" onClick={() => handleSelect(session)}>Редагувати</button>
                            <button className="btn btn--primary" onClick={() => handleOpenPrices(session)}>Ціни</button>
                            <button className="btn btn--danger" onClick={() => handleDelete(session.id)}>Видалити</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="pagination-wrapper">
                <PaginationComponent
                    currentPage={filters.page || 1}
                    totalPages={total_pages || 1}
                    onPageChange={handlePageChange}
                    pageSize={filters.size || 10}
                    onPageSizeChange={handlePageSizeChange}
                    storageKey="sessions-pagination"
                />
            </div>
        </div>
    );
};

export default SessionControlComponent;