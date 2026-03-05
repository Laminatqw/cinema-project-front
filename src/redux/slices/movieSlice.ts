import {IMovie} from "../../models/IMovie";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {IGenre} from "../../models/IGenre";
import {movieServices} from "../../services/movie.services";
import {AxiosError} from "axios";


type MovieSliceType = {
    movies:IMovie[],
    isLoaded:boolean,
    genres:IGenre[],
    error:string,
    movie: IMovie|null;
    genre:IGenre|null
}
const initialState: MovieSliceType = {
    movies: [],
    isLoaded: false,
    genres: [],
    error:'',
    movie: null,
    genre: null
}


let getAllMovies = createAsyncThunk<IMovie[]>(
    'movieSlice/getAllMovies', async (_, thunkAPI)=>{
        try {
            let movies = await movieServices.getAll();
            return thunkAPI.fulfillWithValue(movies)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch movies')
        }
    }
)

let getMovieById = createAsyncThunk<IMovie, number>(
    'movieSlice/getMovieById', async (id, thunkAPI)=>{
        try {
            let movie = await movieServices.getById(id);
            return thunkAPI.fulfillWithValue(movie)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch movie')
        }
    }
)

let createMovie = createAsyncThunk<IMovie, IMovie>(
    'movieSlice/createMovie', async (payload, thunkAPI)=>{
        try {
            let movie = await movieServices.createMovie(payload);
            return thunkAPI.fulfillWithValue(movie)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch movie')
        }
    }
)

let updateMovie = createAsyncThunk<IMovie, {id: number, payload: Partial<IMovie>}>(
    'movieSlice/updateMovie', async ({id, payload}, thunkAPI)=>{
        try {
            let movie = await movieServices.updateMovie(id, payload);
            return thunkAPI.fulfillWithValue(movie)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch movie')
        }
    }
)

let deleteMovie = createAsyncThunk<IMovie, number>(
    'movieSlice/deleteMovie', async (id, thunkAPI)=>{
        try {
            let movie = await movieServices.deleteMovie(id);
            return thunkAPI.fulfillWithValue(movie)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch movie')
        }
    }
)

let loadPicture = createAsyncThunk<IMovie, {id:number, file:File}>(
    'movieSlice/loadPicture', async ({id, file}, thunkAPI)=>{
        try {
            let movie = await movieServices.loadPicture(id, file);
            return thunkAPI.fulfillWithValue(movie)
        }catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to load picture')
        }
    }
)

let getAllGenres = createAsyncThunk<IGenre[]>(
    'movieSlice/getAllGenres', async (_, thunkAPI)=>{
        try {
            let genres = await movieServices.getAllGenres();
            return thunkAPI.fulfillWithValue(genres)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch movies')
        }
    }
)

let getGenreById = createAsyncThunk<IGenre, number>(
    'movieSlice/getGenreById', async (id, thunkAPI)=>{
        try {
            let genre = await movieServices.getGenreById(id);
            return thunkAPI.fulfillWithValue(genre)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch movie')
        }
    }
)

let createGenre = createAsyncThunk<IGenre, IGenre>(
    'movieSlice/createGenre', async (payload, thunkAPI)=>{
        try {
            let genre = await movieServices.genreCreate(payload);
            return thunkAPI.fulfillWithValue(genre)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch movie')
        }
    }
)

let updateGenre = createAsyncThunk<IGenre, {id: number, payload: Partial<IGenre>}>(
    'movieSlice/updateGenre', async ({id, payload}, thunkAPI)=>{
        try {
            let genre = await movieServices.genreUpdate(id, payload);
            return thunkAPI.fulfillWithValue(genre)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch movie')
        }
    }
)

let deleteGenre = createAsyncThunk<IGenre, number>(
    'movieSlice/deleteGenre', async (id, thunkAPI)=>{
        try {
            let movie = await movieServices.genreDelete(id);
            return thunkAPI.fulfillWithValue(movie)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch movie')
        }
    }
)

export const movieSlice = createSlice({
    name:'movieSlice',
    initialState:initialState,
    reducers:{
        clearError: (state) => {
            state.error = ''
        }
    },
    extraReducers:builder => {
        builder
            .addCase(
                getAllMovies.fulfilled,(state, action)=>{
                    state.movies = action.payload
                    state.isLoaded = true;
                }
            )
            .addCase(
                getMovieById.fulfilled,(state, action)=>{
                    state.movie = action.payload
                    state.isLoaded = true
            }
            )
            .addCase(
                createMovie.fulfilled,(state, action)=>{
                    state.movie = action.payload
                    state.isLoaded = true
                }
            )
            .addCase(
                updateMovie.fulfilled,(state, action)=>{
                    state.movies = state.movies.map(movie =>
                        movie.id === action.payload.id ? action.payload : movie
                    )
                    state.movie = action.payload
                    state.isLoaded = true
                }
            )
            .addCase(
                deleteMovie.fulfilled,(state, action)=>{
                    state.movie = action.payload
                    state.isLoaded = true
                }
            )
            .addCase(
                loadPicture.fulfilled,(state, action)=>{
                    state.movies = state.movies.map(movie =>
                        movie.id === action.payload.id ? action.payload : movie
                    )
                    state.movie = action.payload
                    state.isLoaded = true
                }
            )
            .addCase(
                getAllGenres.fulfilled,(state, action)=>{
                    state.genres = action.payload
                    state.isLoaded = true;
                }
            )
            .addCase(
                createGenre.fulfilled,(state, action)=>{
                    state.genre = action.payload
                    state.isLoaded = true
                }
            )
            .addCase(
                updateGenre.fulfilled,(state, action)=>{
                    state.genres = state.genres.map(movie =>
                        movie.id === action.payload.id ? action.payload : movie
                    )
                    state.genre = action.payload
                    state.isLoaded = true
                }
            )
            .addCase(
                deleteGenre.fulfilled,(state, action)=>{
                    state.genre = action.payload
                    state.isLoaded = true
                }
            )
    }
})

export const movieActions = {
    ...movieSlice.actions,
    getAllMovies,getMovieById, createMovie, updateMovie, deleteMovie,
    loadPicture,getAllGenres,getGenreById,createGenre,updateGenre,deleteGenre
}