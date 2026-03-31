import React, { useEffect, useState } from 'react';
import { ISession } from "../../models/ISession";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { ISessionSeat } from "../../models/ISessionSeat";
import { sessionActions } from "../../redux/slices/sessionSlice";
import { ticketActions } from "../../redux/slices/tickerSlice";

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
    if (session.status === 'finished') return <p>Ця сесія вже завершена.</p>;


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

    if (sessionSeats.length === 0) return <p>Завантаження місць...</p>;

    return (
        <div>
            {/* Легенда */}
            <div style={{ display: 'flex', gap: 15, marginBottom: 10 }}>
                {Object.entries(SEAT_COLORS).map(([type, color]) => (
                    <span key={type}>
                        <span style={{ display: 'inline-block', width: 14, height: 14, background: color, marginRight: 4, verticalAlign: 'middle', borderRadius: 3 }} />
                        {type}
                    </span>
                ))}
                <span>
                    <span style={{ display: 'inline-block', width: 14, height: 14, background: '#ccc', marginRight: 4, verticalAlign: 'middle', borderRadius: 3 }} />
                    зайняте
                </span>
                <span>
                    <span style={{ display: 'inline-block', width: 14, height: 14, background: '#ff6b6b', marginRight: 4, verticalAlign: 'middle', borderRadius: 3 }} />
                    обрано
                </span>
            </div>

            {/* Сітка */}
            <div style={{ overflowX: 'auto' }}>
                {grid.map((row, rowIdx) => (
                    <div key={rowIdx} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ width: 30, fontSize: 12 }}>R{rowIdx + 1}</span>
                        {row.map((seat, seatIdx) => {
                            if (!seat) return <div key={seatIdx} style={{ width: 30, height: 30, margin: 2 }} />;
                            const isSelected = !!selectedSeats.find(s => s.id === seat.id);
                            const isTaken = seat.is_taken;
                            return (
                                <div
                                    key={seatIdx}
                                    onClick={() => handleSeatClick(seat)}
                                    title={`Ряд ${seat.row}, Місце ${seat.number} — ${seat.seat_type} — ${getPriceLabel(seat)}`}
                                    style={{
                                        width: 30, height: 30, margin: 2,
                                        borderRadius: 4,
                                        cursor: isTaken ? 'not-allowed' : 'pointer',
                                        background: isTaken ? '#ccc' : isSelected ? '#ff6b6b' : SEAT_COLORS[seat.seat_type],
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 10, color: '#fff', fontWeight: 'bold',
                                        border: isSelected ? '2px solid #c0392b' : 'none',
                                        opacity: isTaken ? 0.5 : 1,
                                    }}
                                >
                                    {seat.number}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Вибрані місця */}
            {selectedSeats.length > 0 && (
                <div style={{ marginTop: 10 }}>
                    <h4>Обрані місця:</h4>
                    {selectedSeats.map(seat => (
                        <p key={seat.id}>
                            Ряд {seat.row}, Місце {seat.number} — {seat.seat_type} — {getPriceLabel(seat)}
                        </p>
                    ))}
                    <p><strong>Загальна сума: {totalPrice} грн</strong></p>
                    {!user && <p style={{ color: 'red' }}>Для купівлі квитків потрібно увійти в акаунт</p>}
                    {user && <button onClick={handleBuy}>Купити {selectedSeats.length} квиток(и)</button>}
                </div>
            )}

            {success && <p style={{ color: 'green' }}>✅ Квитки успішно придбано!</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default SeatPickerComponent;