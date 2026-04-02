import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { ticketActions } from "../../redux/slices/tickerSlice";
import { ticketServices } from "../../services/ticket.services";
import './styles.css'
const STATUS_LABELS: Record<string, string> = {
    reserved: '🟡 Заброньований',
    paid: '🟢 Оплачений',
    canceled: '🔴 Скасований',
    used: '⚫ Використаний',
};

const TicketDetailComponent = () => {
    const {id} = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const {ticketDetail, error} = useAppSelector(state => state.ticketStore);
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
    if (error) return (
        <div>
            <h2>Помилка</h2>
            <p>Квиток не знайдено або у вас немає доступу до нього.</p>
        </div>
    );

    if (!ticketDetail) return <p>Завантаження...</p>;
    return (
        <div className="ticket-detail">
            <div className="ticket-detail__card">

                {/* Header */}
                <div className="ticket-detail__header">
                    <h2 className="ticket-detail__number">Квиток №200{ticketDetail.id}</h2>
                    <span className={`ticket-detail__status ticket-detail__status--${ticketDetail.status}`}>
                    {STATUS_LABELS[ticketDetail.status] ?? ticketDetail.status}
                </span>
                </div>

                {/* Info */}
                <div className="ticket-detail__body">
                    <div className="ticket-detail__section">
                        <div className="ticket-detail__row">
                            <span className="ticket-detail__label">🎬 Фільм</span>
                            <span className="ticket-detail__value">{ticketDetail.movie}</span>
                        </div>
                        <div className="ticket-detail__row">
                            <span className="ticket-detail__label">🕐 Початок</span>
                            <span className="ticket-detail__value">
                            {new Date(ticketDetail.start_time).toLocaleString('uk-UA')}
                        </span>
                        </div>
                        <div className="ticket-detail__row">
                            <span className="ticket-detail__label">🏛️ Зал</span>
                            <span className="ticket-detail__value">{ticketDetail.hall}</span>
                        </div>
                        <div className="ticket-detail__row">
                            <span className="ticket-detail__label">💺 Місце</span>
                            <span className="ticket-detail__value">
                            Ряд {ticketDetail.row}, Місце {ticketDetail.number}
                        </span>
                        </div>
                        <div className="ticket-detail__row">
                            <span className="ticket-detail__label">🎫 Тип</span>
                            <span className="ticket-detail__value">{ticketDetail.seat_type}</span>
                        </div>
                    </div>

                    {/* QR */}
                    {qrUrl && (
                        <div className="ticket-detail__qr">
                            <p className="ticket-detail__qr-label">QR код</p>
                            <img
                                className="ticket-detail__qr-img"
                                src={qrUrl}
                                alt="QR код квитка"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TicketDetailComponent;