import { FC, useState } from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {movieActions} from "../../redux/slices/movieSlice";
const MovieFilters: FC = () => {
    const dispatch = useAppDispatch();
    const filters = useAppSelector(state => state.movieStore.filters);

    const [name, setName] = useState(filters.name || '');
    const [ratingGte, setRatingGte] = useState(filters.rating__gte || '');
    const [ratingLte, setRatingLte] = useState(filters.rating__lte || '');
    const [isNowShowing, setIsNowShowing] = useState<'yes' | 'no' | ''>(filters.is_now_showing || '');

    const handleApply = () => {
        dispatch(movieActions.setNameFilter(name || undefined));
        dispatch(movieActions.setRatingGte(ratingGte ? Number(ratingGte) : undefined));
        dispatch(movieActions.setRatingLte(ratingLte ? Number(ratingLte) : undefined));
        dispatch(movieActions.setNowShowing(isNowShowing || undefined));

        dispatch(movieActions.getAllMovies({
            ...filters,
            name,
            rating__gte: ratingGte ? Number(ratingGte) : undefined,
            rating__lte: ratingLte ? Number(ratingLte) : undefined,
            is_now_showing: isNowShowing || undefined,
            page: 1
        }));
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <input type="number" placeholder="Rating min" value={ratingGte} onChange={e => setRatingGte(e.target.value)} />
            <input type="number" placeholder="Rating max" value={ratingLte} onChange={e => setRatingLte(e.target.value)} />
            <select value={isNowShowing} onChange={e => setIsNowShowing(e.target.value as 'yes' | 'no' | '')}>
                <option value="">All</option>
                <option value="yes">Now Showing</option>
                <option value="no">Not Showing</option>
            </select>
            <button onClick={handleApply}>Apply Filters</button>
        </div>
    );
};

export default MovieFilters;