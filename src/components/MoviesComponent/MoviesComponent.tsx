import {IMovie} from "../../models/IMovie";
import React, {FC} from "react";
import {Link} from "react-router-dom";
import PaginationComponent from "../PaginationComponent/PaginationComponent";
import {movieActions} from "../../redux/slices/movieSlice";
import {useAppDispatch, useAppSelector} from "../../redux/store";


interface IProps{
    movies:IMovie[]
}

const Movies: FC<IProps> = ({movies}) =>{


    const dispatch = useAppDispatch()
    const {  isLoaded, total_pages, filters } = useAppSelector(state => state.movieStore);
    const handlePageChange = (page: number) => {
        dispatch(movieActions.setPage(page));
        dispatch(movieActions.getAllMovies({ ...filters, page }));
    };
    const handlePageSizeChange = (size: number) => {
        dispatch(movieActions.setPageSize(size));
        dispatch(movieActions.getAllMovies({ ...filters, size, page: 1 }));
    };

    return (
        <div>
            <ul>
                {
                    movies.map(movie => (<li key={movie.id}>
                        <Link to={'/movies/' + movie.id}>{movie.name}</Link>
                    </li>))

                }
            </ul>
            <PaginationComponent currentPage={filters.page || 1}
                                 totalPages={total_pages || 1}
                                 onPageChange={handlePageChange}
                                 pageSize={filters.size ||10}
                                 onPageSizeChange={handlePageSizeChange}/>
        </div>
    )

}

export default Movies;