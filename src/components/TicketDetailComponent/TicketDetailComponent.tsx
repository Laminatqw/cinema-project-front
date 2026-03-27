import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { ticketActions } from "../../redux/slices/tickerSlice";
import { ticketServices } from "../../services/ticket.services";

const STATUS_LABELS: Record<string, string> = {
    reserved: '🟡 Заброньований',
    paid: '🟢 Оплачений',
    canceled: '🔴 Скасований',
    used: '⚫ Використаний',
};

const TicketDetailComponent = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { ticketDetail } = useAppSelector(state => state.ticketStore);
    const [qrUrl, setQrUrl] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            dispatch(ticketActions.getTicketById(Number(id)));
        }
    }, [id]);

    useEffect(() => {
        if (ticketDetail?.uuid) {
            ticketServices.getQrCode(ticketDetail.uuid).then(blob => {
                setQrUrl(URL.createObjectURL(blob));
            });
        }
        // очищаємо URL при unmount
        return () => {
            if (qrUrl) URL.revokeObjectURL(qrUrl);
        };
    }, [ticketDetail?.uuid]);

    if (!ticketDetail) return <p>Завантаження...</p>;
    return (
        <div>
        <h2>Квиток #{ticketDetail.id}</h2>
        <p>Фільм: {ticketDetail.movie}</p>
        <p>Початок: {new Date(ticketDetail.start_time).toLocaleString('uk-UA')}</p>
        <p>Зал: {ticketDetail.hall}</p>
        <p>Ряд: {ticketDetail.row}, Місце: {ticketDetail.number}</p>
        <p>Тип місця: {ticketDetail.seat_type}</p>
        <p>Статус: {STATUS_LABELS[ticketDetail.status] ?? ticketDetail.status}</p>
        <p>UUID: {ticketDetail.uuid}</p>

        {qrUrl && (
            <div>
                <h3>QR код</h3>
                <img src={qrUrl} alt="QR код квитка" style={{ width: 200, height: 200 }} />
            </div>
        )}
    </div>
    );
};

export default TicketDetailComponent;