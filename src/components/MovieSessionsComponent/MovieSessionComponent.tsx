import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { sessionActions } from "../../redux/slices/sessionSlice";
import { hallActions } from "../../redux/slices/hallSlice";
import { Link } from "react-router-dom";
import './styles.css'
import PaginationComponent from "../PaginationComponent/PaginationComponent";
import {movieActions} from "../../redux/slices/movieSlice";
interface IProps {
    movieId: number;
}

const MovieSessionsComponent = ({ movieId }: IProps) => {
    const dispatch = useAppDispatch();
    const { sessions,filters, total_pages } = useAppSelector(state => state.sessionStore);
    const { halls } = useAppSelector(state => state.hallStore);

    useEffect(() => {
        dispatch(sessionActions.getSessionsByMovie({
            movieId:movieId!,
            page: filters.page ?? 1,
            size: filters.size ?? 10
        }));
        dispatch(hallActions.getAllHalls());
    }, [movieId, filters.page, filters.size]);

    const handlePageChange = (page: number) => {
        dispatch(sessionActions.setPage(page));
    };
    const handlePageSizeChange = (size: number) => {
        dispatch(sessionActions.setPageSize(size));
    };

    const upcomingSessions = sessions.filter(s => s.status === 'upcoming' || s.status === 'active');
    const getHallName = (id: number) => halls.find(h => h.id === id)?.title ?? id;
    const getHallType = (id: number) => halls.find(h => h.id === id)?.hall_type ?? id;

    if (upcomingSessions.length === 0) return <p className={'movie-sessions__empty'}>Немає доступних сесій</p>;

    return (
        <div className={'movie-sessions'}>
            <h3 className={'movie-sessions__title'}>Доступні сеанси</h3>
            <div className={'movie-sessions__grid'}>
                {upcomingSessions.map(session => (

                    <div className={'movie-sessions__card'} key={session.id}>
                        <p className={'movie-sessions__meta'}>Зал: <span>{getHallName(session.hall)}</span></p>
                        <p className={'movie-sessions__meta'}>Тип: <span>{String(getHallType(session.hall)).toUpperCase()}</span></p>
                        <p className={'movie-sessions__meta'}>
                            Початок: <span>{session.start_time ? new Date(session.start_time).toLocaleString('uk-UA') : '—'}</span>
                        </p>
                        <p className={'movie-sessions__meta'}>
                            Кінець: <span>{session.end_time ? new Date(session.end_time).toLocaleString('uk-UA') : '—'}</span>
                        </p>
                        <Link className={'movie-sessions__link'} to={`/sessions/${session.id}/seats`}>
                            <button className={'movie-sessions__btn'}>Обрати місця</button>
                        </Link>
                    </div>

                ))}

            </div>
            <div className={'movie-sessions__pagination'}>
                <PaginationComponent currentPage={filters.page || 1}
                                     totalPages={total_pages || 1}
                                     onPageChange={handlePageChange}
                                     pageSize={filters.size ||10}
                                     onPageSizeChange={handlePageSizeChange}
                                     storageKey="movieSessions-pagination"
                />
            </div>
        </div>
    );
};

export default MovieSessionsComponent;