import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { sessionActions } from "../../redux/slices/sessionSlice";
import { hallActions } from "../../redux/slices/hallSlice";
import { Link } from "react-router-dom";

interface IProps {
    movieId: number;
}

const MovieSessionsComponent = ({ movieId }: IProps) => {
    const dispatch = useAppDispatch();
    const { sessions } = useAppSelector(state => state.sessionStore);
    const { halls } = useAppSelector(state => state.hallStore);

    useEffect(() => {
        dispatch(sessionActions.getSessionsByMovie(movieId));
        dispatch(hallActions.getAllHalls());
    }, [movieId]);

    const upcomingSessions = sessions.filter(s => s.status === 'upcoming' || s.status === 'active');
    const getHallName = (id: number) => halls.find(h => h.id === id)?.title ?? id;
    const getHallType = (id: number) => halls.find(h => h.id === id)?.hall_type ?? id;

    if (upcomingSessions.length === 0) return <p>Немає доступних сесій</p>;

    return (
        <div>
            <h3>Доступні сеанси</h3>
            {upcomingSessions.map(session => (
                <div key={session.id}>
                    <p>Зал: {getHallName(session.hall)}</p>
                    <p>Тип: {getHallType(session.hall)}</p>
                    <p>Початок: {session.start_time ? new Date(session.start_time).toLocaleString('uk-UA') : '—'}</p>
                    <p>Кінець: {session.end_time ? new Date(session.end_time).toLocaleString('uk-UA') : '—'}</p>
                    <Link to={`/sessions/${session.id}/seats`}>
                        <button>Обрати місця</button>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default MovieSessionsComponent;