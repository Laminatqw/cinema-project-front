import React, { useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import SeatPickerComponent from "../../components/SeatPickerComponent/SeatPickerComponent";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { sessionActions } from "../../redux/slices/sessionSlice";

const SessionSeatsPage = () => {
    const { sessionId } = useParams();
    const dispatch = useAppDispatch();
    const { session, error, isActive  } = useAppSelector(state => state.sessionStore);

    useEffect(() => {
        if (sessionId) {
            dispatch(sessionActions.getSessionById(+sessionId));
        }
    }, [dispatch, sessionId]);

    if (error) return (
        <div>
            <h2>Помилка</h2>
            <p>Сесії не знайдено, або у вас немає доступу до неї</p>
        </div>
    );

    if (!session) return <p>Завантаження сеансу...</p>;

    return (
        <div>
            <Link to={`/movies/${session.movie}`}>← Назад до фільму</Link>
            <h2>Вибір місць</h2>
            <p>
                Початок: {session.start_time ? new Date(session.start_time).toLocaleString('uk-UA') : '—'}
            </p>
            <SeatPickerComponent session={session} />
        </div>
    );
};

export default SessionSeatsPage;
