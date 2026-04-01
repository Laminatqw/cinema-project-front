import React, { useEffect, useState } from 'react';
import { ISession } from "../../models/ISession";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { ISessionSeat } from "../../models/ISessionSeat";
import { sessionActions } from "../../redux/slices/sessionSlice";
import { ticketActions } from "../../redux/slices/tickerSlice";
import './styles.css';

const SEAT_COLORS: Record<string, string> = {
    regular: '#4a90e2',
    vip: '#e2a84a',
    disabled: '#7ed321',
};

interface IProps {
    session: ISession;
}

const SeatPickerComponent = ({ session }: IProps) => {
    const dispatch = useAppDispatch();
    const { sessionSeats, prices } = useAppSelector(state => state.sessionStore);
    const user = useAppSelector(state => state.userStore.user);

    const [selectedSeats, setSelectedSeats] = useState<ISessionSeat[]>([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (session.status === 'finished') return;
        dispatch(sessionActions.getSessionSeats(session.id));
        dispatch(sessionActions.getPrices(session.id));
        setSelectedSeats([]);
        setSuccess(false);
        setError(null);
    }, [session.id]);
    if (session.status === 'finished') return <p className={'seat-picker__state'}>Ця сесія вже завершена.</p>;


    const maxRow = sessionSeats.length > 0 ? Math.max(...sessionSeats.map(s => s.row)) : 0;
    const maxNumber = sessionSeats.length > 0 ? Math.max(...sessionSeats.map(s => s.number)) : 0;

    const grid: (ISessionSeat | null)[][] = Array.from({ length: maxRow }, (_, rowIdx) =>
        Array.from({ length: maxNumber }, (_, seatIdx) =>
            sessionSeats.find(s => s.row === rowIdx + 1 && s.number === seatIdx + 1) ?? null
        )
    );

    const getPrice = (seat: ISessionSeat) => {
        const priceObj = prices.find(p => p.seat_type === seat.seat_type);
        return priceObj ? Number(priceObj.price) : 0;
    };

    const getPriceLabel = (seat: ISessionSeat) => {
        const price = getPrice(seat);
        return price > 0 ? `${price} грн` : '—';
    };

    const totalPrice = selectedSeats.reduce((sum, seat) => sum + getPrice(seat), 0);

    const handleSeatClick = (seat: ISessionSeat) => {
        if (seat.is_taken) return;
        setSelectedSeats(prev =>
            prev.find(s => s.id === seat.id)
                ? prev.filter(s => s.id !== seat.id)
                : [...prev, seat]
        );
    };

    const handleBuy = async () => {
        if (selectedSeats.length === 0 || !user) return;
        setError(null);

        const payload = selectedSeats.map(seat => ({
            session: session.id,
            seat: seat.id,
        }));

        const result = await dispatch(ticketActions.createTicket(payload as any));

        if (ticketActions.createTicket.fulfilled.match(result)) {
            setSuccess(true);
            setSelectedSeats([]);
            dispatch(sessionActions.getSessionSeats(session.id));
        } else {
            setError(result.payload as string || 'Помилка при купівлі квитків');
        }
    };

    if (sessionSeats.length === 0) return <p className={'seat-picker__state'}>Завантаження місць...</p>;

    return (
        <div className={'seat-picker'}>
            {/* Легенда */}
            <div className={'seat-picker__legend'}>
                {Object.entries(SEAT_COLORS).map(([type, color]) => (
                    <span className={'seat-picker__legend-item'} key={type}>
                        <span className={'seat-picker__legend-dot'} style={{ background: color }} />
                        {type}
                    </span>
                ))}
                <span className={'seat-picker__legend-item'}>
                    <span className={'seat-picker__legend-dot'} style={{ background: '#9ca3af' }} />
                    зайняте
                </span>
                <span className={'seat-picker__legend-item'}>
                    <span className={'seat-picker__legend-dot'} style={{ background: '#ff6b6b' }} />
                    обрано
                </span>
            </div>

            {/* Сітка */}
            <div className={'seat-picker__grid-wrap'}>
                <div className={'seat-picker__hall'}>
                    <div className={'seat-picker__screen'}>Екран</div>
                    <div className={'seat-picker__rows'}>
                        {grid.map((row, rowIdx) => (
                            <div key={rowIdx} className={'seat-picker__row'}>
                                <span className={'seat-picker__row-label'}>R{rowIdx + 1}</span>
                                {row.map((seat, seatIdx) => {
                                    if (!seat) return <div key={seatIdx} className={'seat-picker__seat seat-picker__seat--empty'} />;
                                    const isSelected = !!selectedSeats.find(s => s.id === seat.id);
                                    const isTaken = seat.is_taken;
                                    return (
                                        <div
                                            key={seatIdx}
                                            onClick={() => handleSeatClick(seat)}
                                            title={`Ряд ${seat.row}, Місце ${seat.number} — ${seat.seat_type} — ${getPriceLabel(seat)}`}
                                            className={`seat-picker__seat ${isTaken ? 'is-taken' : ''} ${isSelected ? 'is-selected' : ''}`}
                                            style={{
                                                background: isTaken ? '#9ca3af' : isSelected ? '#ff6b6b' : SEAT_COLORS[seat.seat_type],
                                            }}
                                        >
                                            {seat.number}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Вибрані місця */}
            {selectedSeats.length > 0 && (
                <div className={'seat-picker__summary'}>
                    <h4 className={'seat-picker__summary-title'}>Обрані місця:</h4>
                    {selectedSeats.map(seat => (
                        <p className={'seat-picker__summary-item'} key={seat.id}>
                            Ряд {seat.row}, Місце {seat.number} — {seat.seat_type} — {getPriceLabel(seat)}
                        </p>
                    ))}
                    <p className={'seat-picker__summary-total'}>Загальна сума: {totalPrice} грн</p>
                    {!user && <p className={'seat-picker__error'}>Для купівлі квитків потрібно увійти в акаунт</p>}
                    {user && (
                        <button className={'seat-picker__buy-btn'} onClick={handleBuy}>
                            Купити {selectedSeats.length} квиток(и)
                        </button>
                    )}
                </div>
            )}

            {success && <p className={'seat-picker__success'}>✅ Квитки успішно придбано!</p>}
            {error && <p className={'seat-picker__error'}>{error}</p>}
        </div>
    );
};

export default SeatPickerComponent;