import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {useParams} from "react-router-dom";
import {movieActions} from "../../redux/slices/movieSlice";

const MovieDetailComponent = () => {

    let {id} = useParams();

    let dispatch = useAppDispatch()

    let movie = useAppSelector(state => state.movieStore.movie)

    useEffect(() => {
        if (id) {
            dispatch(movieActions.getMovieById(+id))
        }
    }, [id]);

    if (!movie) return <p>Завантаження...</p>;

    return (
        <div>
            <h1>{movie.name}</h1>
            {movie.picture && <img src={movie.picture}/>}

        </div>
    );
};

export default MovieDetailComponent;