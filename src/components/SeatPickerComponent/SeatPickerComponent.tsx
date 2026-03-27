import React, {useEffect, useState} from 'react';
import {ISession} from "../../models/ISession";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {ISessionSeat} from "../../models/ISessionSeat";
import {sessionActions} from "../../redux/slices/sessionSlice";
import {ticketActions} from "../../redux/slices/tickerSlice";

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

    const [selectedSeat, setSelectedSeat] = useState<ISessionSeat | null>(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        dispatch(sessionActions.getSessionSeats(session.id));
        dispatch(sessionActions.getPrices(session.id));
        setSelectedSeat(null);
        setSuccess(false);
        setError(null);
    }, [session.id]);

    // будуємо сітку з місць
    const maxRow = sessionSeats.length > 0 ? Math.max(...sessionSeats.map(s => s.row)) : 0;
    const maxNumber = sessionSeats.length > 0 ? Math.max(...sessionSeats.map(s => s.number)) : 0;

    const grid: (ISessionSeat | null)[][] = Array.from({ length: maxRow }, (_, rowIdx) =>
        Array.from({ length: maxNumber }, (_, seatIdx) => {
            return sessionSeats.find(s => s.row === rowIdx + 1 && s.number === seatIdx + 1) ?? null;
        })
    );

    const getPrice = (seat: ISessionSeat) => {
        const priceObj = prices.find(p => p.seat_type === seat.seat_type);
        return priceObj ? `${priceObj.price} грн` : '—';
    };

    const handleBuy = async () => {
        if (!selectedSeat || !user) return;
        setError(null);

        const result = await dispatch(ticketActions.createTicket({
            user: user.id,
            session: session.id,
            seat: selectedSeat.id,
        } as any));

        if (ticketActions.createTicket.fulfilled.match(result)) {
            setSuccess(true);
            setSelectedSeat(null);
            dispatch(sessionActions.getSessionSeats(session.id));
        } else {
            setError(result.payload as string || 'Помилка при купівлі квитка');
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
            </div>

            {/* Сітка */}
            <div style={{ overflowX: 'auto' }}>
                {grid.map((row, rowIdx) => (
                    <div key={rowIdx} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ width: 30, fontSize: 12 }}>R{rowIdx + 1}</span>
                        {row.map((seat, seatIdx) => {
                            if (!seat) return (
                                <div key={seatIdx} style={{ width: 30, height: 30, margin: 2 }} />
                            );
                            const isSelected = selectedSeat?.id === seat.id;
                            const isTaken = seat.is_taken;
                            return (
                                <div
                                    key={seatIdx}
                                    onClick={() => !isTaken && setSelectedSeat(isSelected ? null : seat)}
                                    title={`Ряд ${seat.row}, Місце ${seat.number} — ${seat.seat_type} — ${getPrice(seat)}`}
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

            {/* Вибране місце */}
            {selectedSeat && (
                <div style={{ marginTop: 10 }}>
                    <p>Обрано: Ряд {selectedSeat.row}, Місце {selectedSeat.number} — {selectedSeat.seat_type} — {getPrice(selectedSeat)}</p>
                    {!user && <p style={{ color: 'red' }}>Для купівлі квитка потрібно увійти в акаунт</p>}
                    {user && <button onClick={handleBuy}>Купити квиток</button>}
                </div>
            )}

            {success && <p style={{ color: 'green' }}>✅ Квиток успішно придбано!</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};


export default SeatPickerComponent;