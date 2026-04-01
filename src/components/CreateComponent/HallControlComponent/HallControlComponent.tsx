import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { hallActions } from "../../../redux/slices/hallSlice";
import { IHall } from "../../../models/IHall";
import { IHallSeat, SeatType } from "../../../models/IHallSeat";
import "./hallStyle.css"
import PaginationComponent from "../../PaginationComponent/PaginationComponent";

const HALL_TYPES = ['standard', 'imax', '3d'];

const SEAT_COLORS: Record<SeatType, string> = {
    regular: '#4a90e2',
    vip: '#e2a84a',
    disabled: '#7ed321',
};

const HallControlComponent = () => {
    const dispatch = useAppDispatch();
    const {halls, seats, error, filters, total_pages} = useAppSelector(state => state.hallStore);

    // --- Hall form ---
    const [hallFormData, setHallFormData] = useState<Partial<IHall>>({
        title: '', total_seats: undefined, hall_type: 'standard',
    });
    const [hallMode, setHallMode] = useState<'create' | 'edit'>('create');
    const [selectedHall, setSelectedHall] = useState<IHall | null>(null);
    const [search, setSearch] = useState('');

    // --- Seat grid ---
    const [showSeatEditor, setShowSeatEditor] = useState(false);
    const [rows, setRows] = useState(5);
    const [seatsPerRow, setSeatsPerRow] = useState(10);
    const [grid, setGrid] = useState<(SeatType | null)[][]>([]);
    const [seatsCreated, setSeatsCreated] = useState(false);

    useEffect(() => {
        dispatch(hallActions.getAllHalls(filters));
    }, [filters.page, filters.size]);

    // генерація сітки
    const generateGrid = () => {
        const newGrid: SeatType[][] = Array.from({length: rows}, () =>
            Array.from({length: seatsPerRow}, () => 'regular')
        );
        setGrid(newGrid);
        setSeatsCreated(false);
    };

    const toggleSeatType = (rowIdx: number, seatIdx: number) => {
        setGrid(prev => {
            const updated = prev.map(r => [...r]);
            const types: SeatType[] = ['regular', 'vip', 'disabled'];
            const current = updated[rowIdx][seatIdx];
            if (current === null) return updated;
            const next = types[(types.indexOf(current) + 1) % types.length];
            updated[rowIdx][seatIdx] = next;
            return updated;
        });
    };

    const toggleSeatExistence = (rowIdx: number, seatIdx: number, e: React.MouseEvent) => {
        e.preventDefault(); // блокуємо контекстне меню
        setGrid(prev => {
            const updated = prev.map(r => [...r]);
            updated[rowIdx][seatIdx] = updated[rowIdx][seatIdx] === null ? 'regular' : null;
            return updated;
        });
    };


    const handleSaveSeats = async () => {
        if (!selectedHall) return;
        const seatsPayload: Partial<IHallSeat>[] = [];
        grid.forEach((row, rowIdx) => {
            row.forEach((seat_type, seatIdx) => {
                if (seat_type === null) return;
                seatsPayload.push({
                    hall: selectedHall.id,
                    row: rowIdx + 1,
                    number: seatIdx + 1,
                    seat_type,
                });
            });
        });
        await dispatch(hallActions.createSeats({id: selectedHall.id, seats: seatsPayload}));
        await dispatch(hallActions.getAllSeats(selectedHall.id)); // додати — оновить seats в store
        setSeatsCreated(true);
    };
    const handleClearGrid = () => {
        setGrid([]);
        setSeatsCreated(false);
    };

    const handleDeleteAllSeats = async () => {
        if (!selectedHall) return;
        await dispatch(hallActions.deleteAllSeats(selectedHall.id));
        setGrid([]);
        setSeatsCreated(false);
    };
    const handleUpdateSeats = async () => {
        if (!selectedHall) return;

        const toUpdate: Partial<IHallSeat>[] = [];
        const toDelete: number[] = [];
        const toCreate: Partial<IHallSeat>[] = [];

        grid.forEach((row, rowIdx) => {
            row.forEach((seat_type, seatIdx) => {
                const existingSeat = seats.find(s => s.row === rowIdx + 1 && s.number === seatIdx + 1);

                if (seat_type === null && existingSeat) {
                    // видалити
                    toDelete.push(existingSeat.id);
                } else if (seat_type !== null && existingSeat && existingSeat.seat_type !== seat_type) {
                    // оновити
                    toUpdate.push({
                        id: existingSeat.id,
                        hall: selectedHall.id,
                        row: rowIdx + 1,
                        number: seatIdx + 1,
                        seat_type,
                    });
                } else if (seat_type !== null && !existingSeat) {
                    // нове місце — створити
                    toCreate.push({
                        hall: selectedHall.id,
                        row: rowIdx + 1,
                        number: seatIdx + 1,
                        seat_type,
                    });
                }
            });
        });


        for (const id of toDelete) {
            await dispatch(hallActions.deleteSeat(id));
        }

        if (toUpdate.length > 0) {
            await dispatch(hallActions.updateSeats({id: selectedHall.id, seats: toUpdate}));
        }

        if (toCreate.length > 0) {
            await dispatch(hallActions.createSeats({id: selectedHall.id, seats: toCreate}));
        }

        setSeatsCreated(true);
    };


    // --- Hall handlers ---
    const handleHallChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setHallFormData(prev => ({
            ...prev,
            [name]: name === 'total_seats' ? Number(value) : value,
        }));
    };

    const handleHallSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (hallMode === 'create') {
            const result = await dispatch(hallActions.createHall(hallFormData as IHall));
            if (hallActions.createHall.fulfilled.match(result)) {
                setSelectedHall(result.payload);
                setShowSeatEditor(true);
            }
        } else if (selectedHall) {
            await dispatch(hallActions.updateHall({id: selectedHall.id, payload: hallFormData}));
        }
        handleHallReset();
        dispatch(hallActions.getAllHalls());
    };

    const handleHallSelect = (hall: IHall) => {
        setSelectedHall(hall);
        setHallMode('edit');
        setHallFormData({title: hall.title, total_seats: hall.total_seats, hall_type: hall.hall_type});
        setShowSeatEditor(false);
        setGrid([]);
        setSeatsCreated(false);
    };

    const handleOpenSeatEditor = async (hall: IHall) => {
        setSelectedHall(hall);
        setShowSeatEditor(true);
        setSeatsCreated(false);

        // завантажуємо існуючі місця
        const result = await dispatch(hallActions.getAllSeats(hall.id));
        if (hallActions.getAllSeats.fulfilled.match(result) && result.payload.length > 0) {
            // відновлюємо сітку з існуючих місць
            const seats = result.payload;
            const maxRow = Math.max(...seats.map(s => s.row));
            const maxNumber = Math.max(...seats.map(s => s.number));

            const restoredGrid: (SeatType | null)[][] = Array.from({length: maxRow}, (_, rowIdx) =>
                Array.from({length: maxNumber}, (_, seatIdx) => {
                    const seat = seats.find(s => s.row === rowIdx + 1 && s.number === seatIdx + 1);
                    return seat ? seat.seat_type : null;
                })
            );
            setGrid(restoredGrid);
            setRows(maxRow);
            setSeatsPerRow(maxNumber);
        } else {
            setGrid([]);
        }
    };


    const handleHallDelete = async (id: number) => {
        await dispatch(hallActions.deleteHall(id));
    };

    const handleHallReset = () => {
        setHallMode('create');
        setHallFormData({title: '', total_seats: undefined, hall_type: 'standard'});
    };

    const filteredHalls = halls.filter(h =>
        h.title.toLowerCase().includes(search.toLowerCase())
    );

    const handlePageChange = (page: number) => {
        dispatch(hallActions.setPage(page));
    };
    const handlePageSizeChange = (size: number) => {
        dispatch(hallActions.setPageSize(size));
    };


    return (
        <div className="hall-control">
            <h2 className="hall-control__title">Управління залами</h2>

            {/* ===== FORM ===== */}
            <form className="hall-form" onSubmit={handleHallSubmit}>
                <h3 className="hall-form__title">
                    {hallMode === 'create' ? 'Додати зал' : `Редагувати: ${selectedHall?.title}`}
                </h3>

                <div className="hall-form__group">
                    <label>Назва</label>
                    <input
                        className="hall-form__input"
                        name="title"
                        value={hallFormData.title || ''}
                        onChange={handleHallChange}
                        required
                    />
                </div>

                <div className="hall-form__group">
                    <label>Кількість місць</label>
                    <input
                        className="hall-form__input"
                        name="total_seats"
                        type="number"
                        value={hallFormData.total_seats || ''}
                        onChange={handleHallChange}
                        required
                    />
                </div>

                <div className="hall-form__group">
                    <label>Тип залу</label>
                    <select
                        className="hall-form__select"
                        name="hall_type"
                        value={hallFormData.hall_type || 'standard'}
                        onChange={handleHallChange}
                    >
                        {HALL_TYPES.map(type => (
                            <option key={type} value={type}>{type.toUpperCase()}</option>
                        ))}
                    </select>
                </div>

                {error && <p className="hall-form__error">{error}</p>}

                <div className="hall-form__actions">
                    <button className="btn btn--primary" type="submit">
                        {hallMode === 'create' ? 'Створити' : 'Зберегти'}
                    </button>

                    {hallMode === 'edit' && (
                        <button className="btn btn--secondary" type="button" onClick={handleHallReset}>
                            Скасувати
                        </button>
                    )}
                </div>
            </form>

            {/* ===== SEAT EDITOR ===== */}
            {showSeatEditor && selectedHall && (
                <div className="seat-editor">
                    <h3 className="seat-editor__title">Редактор місць — {selectedHall.title}</h3>

                    <div className="seat-editor__controls">
                        <label>Рядів:</label>
                        <input type="number" min={1} value={rows} onChange={e => setRows(Number(e.target.value))}/>

                        <label>Місць:</label>
                        <input type="number" min={1} value={seatsPerRow}
                               onChange={e => setSeatsPerRow(Number(e.target.value))}/>

                        <button className="btn btn--primary" type="button" onClick={generateGrid}>
                            Згенерувати
                        </button>
                    </div>

                    {/* Legend */}
                    {grid.length > 0 && (
                        <div className="seat-legend">
                            {(Object.entries(SEAT_COLORS)).map(([type, color]) => (
                                <span key={type} className="seat-legend__item">
                                <span className="seat-legend__color" style={{background: color}}/>
                                    {type}
                            </span>
                            ))}
                            <small className="seat-legend__hint">клік — змінити тип, ПКМ — видалити</small>
                        </div>
                    )}

                    <div className="seat-layout">
                        <div className="seat-grid-wrapper">
                            {grid.map((row, rowIdx) => (
                                <div key={rowIdx} className="seat-row">
                                    <span className="seat-row__label">R{rowIdx + 1}</span>

                                    {row.map((seatType, seatIdx) => (
                                        <div
                                            key={seatIdx}
                                            onClick={() => toggleSeatType(rowIdx, seatIdx)}
                                            onContextMenu={(e) => toggleSeatExistence(rowIdx, seatIdx, e)}
                                            className={`seat 
                                            ${seatType === null ? 'seat--disabled' : ''}`}
                                            style={{
                                                background: seatType === null ? '#ccc' : SEAT_COLORS[seatType]
                                            }}
                                        >
                                            {seatType !== null ? seatIdx + 1 : ''}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div className="seat-layout__info">
                            <h4>Інструкція</h4>
                            <p>ЛКМ — змінити тип місця</p>
                            <p>ПКМ — видалити місце</p>
                            <p>Щоб змінити існуючу сітку(кількість місць, не їх вид) місць потрібно видалити місця в
                                певному залі, а потім створити заново, вже так як вам потрібно</p>
                            <p>Кнопка очистити просто позволяє очистити сітку(не видаляє вже створені місця)</p>
                        </div>
                    </div>

                    {grid.length > 0 && (
                        <div className="seat-editor__actions">
                            <button className="btn btn--primary" onClick={handleSaveSeats}>
                                {seatsCreated ? '✅ Збережено' : 'Створити місця'}
                            </button>

                            {seats.length > 0 && (
                                <button className="btn btn--edit" onClick={handleUpdateSeats}>
                                    Оновити
                                </button>
                            )}

                            <button className="btn btn--secondary" onClick={handleClearGrid}>
                                Очистити
                            </button>

                            <button className="btn btn--danger" onClick={handleDeleteAllSeats}>
                                Видалити всі
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ===== SEARCH ===== */}
            <input
                className="hall-search"
                placeholder="Пошук залу..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            {/* ===== TABLE ===== */}
            <h3 className="hall-list__title">Список залів</h3>

            <table className="hall-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Назва</th>
                    <th>Тип</th>
                    <th>Місць</th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                {filteredHalls.map(hall => (
                    <tr key={hall.id}>
                        <td>{hall.id}</td>
                        <td>{hall.title}</td>
                        <td>{hall.hall_type.toUpperCase()}</td>
                        <td>{hall.total_seats}</td>
                        <td className="hall-table__actions">
                            <button className="btn btn--edit" onClick={() => handleHallSelect(hall)}>Редагувати</button>
                            <button className="btn btn--primary" onClick={() => handleOpenSeatEditor(hall)}>Місця
                            </button>
                            <button className="btn btn--danger" onClick={() => handleHallDelete(hall.id)}>Видалити
                            </button>
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
                    storageKey="halls-pagination"
                />
            </div>
        </div>
    );
}

export default HallControlComponent;