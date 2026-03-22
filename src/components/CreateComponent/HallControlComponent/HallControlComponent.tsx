import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { hallActions } from "../../../redux/slices/hallSlice";
import { IHall } from "../../../models/IHall";
import { IHallSeat, SeatType } from "../../../models/IHallSeat";
import "./hallStyle.css"

const HALL_TYPES = ['standard', 'imax', '3d'];

const SEAT_COLORS: Record<SeatType, string> = {
    regular: '#4a90e2',
    vip: '#e2a84a',
    disabled: '#7ed321',
};

const HallControlComponent = () => {
    const dispatch = useAppDispatch();
    const { halls, seats, error } = useAppSelector(state => state.hallStore);

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
        dispatch(hallActions.getAllHalls());
    }, []);

    // генерація сітки
    const generateGrid = () => {
        const newGrid: SeatType[][] = Array.from({ length: rows }, () =>
            Array.from({ length: seatsPerRow }, () => 'regular')
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
                if (seat_type === null) return; // пропускаємо видалені
                seatsPayload.push({
                    hall: selectedHall.id,
                    row: rowIdx + 1,
                    number: seatIdx + 1,
                    seat_type,
                });
            });
        });
        console.log(seatsPayload)
        await dispatch(hallActions.createSeats({ id: selectedHall.id, seats: seatsPayload }));
        setSeatsCreated(true);
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
            await dispatch(hallActions.updateSeats({ id: selectedHall.id, seats: toUpdate }));
        }

        if (toCreate.length > 0) {
            await dispatch(hallActions.createSeats({ id: selectedHall.id, seats: toCreate }));
        }

        setSeatsCreated(true);
    };


    // --- Hall handlers ---
    const handleHallChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
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
            await dispatch(hallActions.updateHall({ id: selectedHall.id, payload: hallFormData }));
        }
        handleHallReset();
        dispatch(hallActions.getAllHalls());
    };

    const handleHallSelect = (hall: IHall) => {
        setSelectedHall(hall);
        setHallMode('edit');
        setHallFormData({ title: hall.title, total_seats: hall.total_seats, hall_type: hall.hall_type });
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

            const restoredGrid: (SeatType | null)[][] = Array.from({ length: maxRow }, (_, rowIdx) =>
                Array.from({ length: maxNumber }, (_, seatIdx) => {
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
        setHallFormData({ title: '', total_seats: undefined, hall_type: 'standard' });
    };

    const filteredHalls = halls.filter(h =>
        h.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h2>Управління залами</h2>

            {/* Форма залу */}
            <form onSubmit={handleHallSubmit}>
                <h3>{hallMode === 'create' ? 'Додати зал' : `Редагувати: ${selectedHall?.title}`}</h3>
                <div>
                    <label>Назва</label>
                    <input name="title" placeholder="Назва залу" value={hallFormData.title || ''} onChange={handleHallChange} required />
                </div>
                <div>
                    <label>Кількість місць</label>
                    <input name="total_seats" type="number" placeholder="Кількість місць" value={hallFormData.total_seats || ''} onChange={handleHallChange} required />
                </div>
                <div>
                    <label>Тип залу</label>
                    <select name="hall_type" value={hallFormData.hall_type || 'standard'} onChange={handleHallChange}>
                        {HALL_TYPES.map(type => (
                            <option key={type} value={type}>{type.toUpperCase()}</option>
                        ))}
                    </select>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">{hallMode === 'create' ? 'Створити' : 'Зберегти'}</button>
                {hallMode === 'edit' && <button type="button" onClick={handleHallReset}>Скасувати</button>}
            </form>

            {/* Редактор місць */}
            {showSeatEditor && selectedHall && (
                <div>
                    <h3>Редактор місць — {selectedHall.title}</h3>
                    <div>
                        <label>Рядів: </label>
                        <input type="number" min={1} value={rows} onChange={e => setRows(Number(e.target.value))} />
                        <label> Місць в ряду: </label>
                        <input type="number" min={1} value={seatsPerRow} onChange={e => setSeatsPerRow(Number(e.target.value))} />
                        <button type="button" onClick={generateGrid}>Згенерувати сітку</button>
                    </div>

                    {/* Легенда */}
                    {grid.length > 0 && (
                        <div style={{ margin: '10px 0' }}>
                            {(Object.entries(SEAT_COLORS) as [SeatType, string][]).map(([type, color]) => (
                                <span key={type} style={{ marginRight: '15px' }}>
                                    <span style={{ display: 'inline-block', width: 16, height: 16, background: color, marginRight: 4, verticalAlign: 'middle' }} />
                                    {type}
                                </span>
                            ))}
                            <small> (клікни на місце щоб змінити тип)</small>
                        </div>
                    )}
                <div className={'tableDiv'}>
                    {/* Сітка */}
                    <div style={{ overflowX: 'auto' }}>
                        {grid.map((row, rowIdx) => (
                            <div key={rowIdx} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                                <span style={{ width: 30, fontSize: 12 }}>R{rowIdx + 1}</span>
                                {row.map((seatType, seatIdx) => (
                                    <div
                                        key={seatIdx}
                                        onClick={() => toggleSeatType(rowIdx, seatIdx)}
                                        onContextMenu={(e) => toggleSeatExistence(rowIdx, seatIdx, e)}
                                        style={{
                                            width: 28, height: 28, margin: 2,
                                            background: grid[rowIdx][seatIdx] === null ? '#ccc' : SEAT_COLORS[grid[rowIdx][seatIdx]!],
                                            borderRadius: 4,
                                            cursor: 'pointer',
                                            opacity: grid[rowIdx][seatIdx] === null ? 0.3 : 1,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 10, color: '#fff', fontWeight: 'bold',
                                        }}
                                    >
                                        {grid[rowIdx][seatIdx] !== null ? seatIdx + 1 : ''}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <h1>Надпис-Інструкція</h1>

                </div>
                    {grid.length > 0 && (
                        <>
                            <button type="button" onClick={handleSaveSeats} disabled={seatsCreated}>
                                {seatsCreated ? '✅ Місця оновлено/збережено' : 'Створити місця'}
                            </button>
                            {seats.length > 0 && (
                                <button type="button" onClick={handleUpdateSeats}>
                                    Оновити місця
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Пошук */}
            <input
                placeholder="Пошук залу..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ marginTop: 20 }}
            />

            {/* Список залів */}
            <h3>Список залів</h3>
            <table>
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
                        <td>
                            <button onClick={() => handleHallSelect(hall)}>Редагувати</button>
                            <button onClick={() => handleOpenSeatEditor(hall)}>Місця</button>
                            <button onClick={() => handleHallDelete(hall.id)}>Видалити</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default HallControlComponent;