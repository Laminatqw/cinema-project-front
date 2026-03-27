import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { ticketActions } from "../../redux/slices/tickerSlice";

const STATUS_LABELS: Record<string, string> = {
    reserved: '🟡 Заброньований',
    paid: '🟢 Оплачений',
    canceled: '🔴 Скасований',
    used: '⚫ Використаний',
};

const TicketsComponent = () => {
    const dispatch = useAppDispatch();
    const { tickets, isLoaded } = useAppSelector(state => state.ticketStore);

    useEffect(() => {
        dispatch(ticketActions.getTicket());
    }, []);

    if (!isLoaded && tickets.length === 0) return <p>Завантаження...</p>;

    return (
        <div>
            <h2>Мої квитки</h2>
            {tickets.length === 0 ? (
                <p>У вас ще немає квитків</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Номер</th>
                            <th>Сесія</th>
                            <th>Місце</th>
                            <th>Статус</th>
                            <th>Деталі</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(ticket => (
                            <tr key={ticket.id}>
                                <td>200{ticket.id}</td>
                                <td>{ticket.session}</td>
                                <td>{ticket.seat}</td>
                                <td>{STATUS_LABELS[ticket.status] ?? ticket.status}</td>
                                <td><Link to={`/account/tickets/${ticket.id}`}>Детальніше</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TicketsComponent;