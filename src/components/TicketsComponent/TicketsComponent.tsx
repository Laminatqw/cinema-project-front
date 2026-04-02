import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { ticketActions } from "../../redux/slices/tickerSlice";
import './styles.css';

const STATUS_LABELS: Record<string, string> = {
    reserved: '🟡 Заброньований',
    paid: '🟢 Оплачений',
    canceled: '🔴 Скасований',
    used: '⚫ Використаний',
};

const TicketsComponent = () => {
    const dispatch = useAppDispatch();
    const { tickets, ticketDetail, isLoaded, error } = useAppSelector(state => state.ticketStore);

    useEffect(() => {
        dispatch(ticketActions.getTicket());
    }, []);

    const visibleTickets = tickets.filter(t => t.status !== 'used');

    if (!isLoaded && tickets.length === 0) return <p className={'tickets__state'}>Завантаження...</p>;

    return (
        <div className={'tickets'}>
            <h2 className={'tickets__title'}>Мої квитки</h2>
            {visibleTickets.length === 0 ? (
                <p className={'tickets__state'}>У вас ще немає квитків</p>
            ) : (
                <div className={'tickets__table-wrap'}>
                    <table className={'tickets__table'}>
                        <thead>
                        <tr>
                            <th>Номер</th>
                            <th>Зал</th>
                            <th>Місце</th>
                            <th>Час</th>
                        </tr>
                        </thead>
                        <tbody>
                        {visibleTickets.map(ticket => (
                            <tr key={ticket.id}>
                                <td>200{ticket.id}</td>
                                <td>{ticket.hall}</td>
                                <td>Ряд {ticket.row}, Місце {ticket.number}</td>
                                <td>{ticket.start_time ? new Date(ticket.start_time).toLocaleString('uk-UA') : '—'}</td>
                                <td>{STATUS_LABELS[ticket.status] ?? ticket.status}</td>
                                <td>
                                    <Link className={'tickets__details-link'} to={`/account/tickets/${ticket.id}`}>
                                        Детальніше
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TicketsComponent;