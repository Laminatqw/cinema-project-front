import { IMovie } from "../../models/IMovie";
import React, { FC } from "react";
import { Link } from "react-router-dom";
import PaginationComponent from "../PaginationComponent/PaginationComponent";
import { movieActions } from "../../redux/slices/movieSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import "./styles.css";

interface IProps {
    movies: IMovie[];
}

const Movies: FC<IProps> = ({ movies }) => {
    const dispatch = useAppDispatch();
    const { total_pages, filters } = useAppSelector(state => state.movieStore);

    const handlePageChange = (page: number) => {
        dispatch(movieActions.setPage(page));
        dispatch(movieActions.getAllMovies({ ...filters, page }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageSizeChange = (size: number) => {
        dispatch(movieActions.setPageSize(size));
        dispatch(movieActions.getAllMovies({ ...filters, size, page: 1 }));
    };

    return (
        <div className={"movies"}>
            <div className={"movies__grid"}>
                {movies.map(movie => (
                    <Link
                        key={movie.id}
                        to={"/movies/" + movie.id}
                        className={"movies__card"}
                    >
                        <div className={"movies__poster-wrap"}>
                            {movie.picture ? (
                                <img
                                    className={"movies__poster"}
                                    src={movie.picture}
                                    alt={movie.name}
                                />
                            ) : (
                                <div className={"movies__poster movies__poster--placeholder"}>
                                    <span>{movie.name}</span>
                                </div>
                            )}
                        </div>
                        <div className={"movies__info"}>
                            <h3 className={"movies__title"}>{movie.name}</h3>
                        </div>
                    </Link>
                ))}
            </div>

            <div className={"movies__pagination"}>
                <PaginationComponent
                    currentPage={filters.page || 1}
                    totalPages={total_pages || 1}
                    onPageChange={handlePageChange}
                    pageSize={filters.size || 10}
                    onPageSizeChange={handlePageSizeChange}
                    storageKey="movies-pagination"
                />
            </div>
        </div>
    );
};

export default Movies;