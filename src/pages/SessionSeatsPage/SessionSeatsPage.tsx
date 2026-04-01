import React, { useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import SeatPickerComponent from "../../components/SeatPickerComponent/SeatPickerComponent";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { sessionActions } from "../../redux/slices/sessionSlice";
import './styles.css';

const SessionSeatsPage = () => {
    const { sessionId } = useParams();
    const dispatch = useAppDispatch();
    const { session, error } = useAppSelector(state => state.sessionStore);

    useEffect(() => {
        if (sessionId) {
            dispatch(sessionActions.getSessionById(+sessionId));
        }
    }, [dispatch, sessionId]);



    if (!session) return <p className={'session-seats-page__state'}>Завантаження сеансу...</p>;

    if (error) return (
        <div className={'session-seats-page session-seats-page__state-wrap'}>
            <h2 className={'session-seats-page__title'}>Помилка</h2>
            <p className={'session-seats-page__error'}>
                Сесії не знайдено, або у вас немає доступу до неї
            </p>
        </div>
    );

    return (
        <div className={'session-seats-page'}>
            <div className={'session-seats-page__inner'}>
            <Link className={'session-seats-page__back-link'} to={`/movies/${session.movie}`}>← Назад до фільму</Link>
            <h2 className={'session-seats-page__title'}>Вибір місць</h2>
            <p className={'session-seats-page__meta'}>
                Початок: {session.start_time ? new Date(session.start_time).toLocaleString('uk-UA') : '—'}
            </p>
            <div className={'session-seats-page__picker-wrap'}>
                <SeatPickerComponent session={session} />
            </div>
            </div>
        </div>
    );
};

export default SessionSeatsPage;
