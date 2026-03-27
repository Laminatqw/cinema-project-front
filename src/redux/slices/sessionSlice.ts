import {ISession} from "../../models/ISession";
import {createAsyncThunk, createSlice, isFulfilled, isPending, isRejected, PayloadAction} from "@reduxjs/toolkit";
import {sessionServices} from "../../services/session.services";
import {AxiosError} from "axios";
import {ISession_price} from "../../models/ISession_price";
import {ISessionSeat} from "../../models/ISessionSeat";


type SessionSliceType = {
    sessions: ISession[],
    isLoaded: boolean,
    session: ISession | null,
    prices: ISession_price[],
    sessionSeats: ISessionSeat[],
    error: string
}

const initialState: SessionSliceType = {
    sessions: [],
    isLoaded: false,
    session: null,
    prices: [],
    sessionSeats:[],
    error: ''
}


let getAllSessions = createAsyncThunk<ISession[]>(
    'sessionSlice/getAllSessions', async (_, thunkAPI) =>{
        try {
            let sessions = await sessionServices.getAll();
            return thunkAPI.fulfillWithValue(sessions)
        } catch (e){
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch halls')
        }
    }
)
let getSessionById = createAsyncThunk<ISession, number>(
    'sessionSlice/getSessionById', async (id, thunkAPI)=>{
        try {
            let session = await sessionServices.getById(id);
            return thunkAPI.fulfillWithValue(session)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch hall')
        }
    }
)

let createSession = createAsyncThunk<ISession, Partial<ISession>>(
    'sessionSlice/createSession', async (payload, thunkAPI) => {
        try {
            let session = await sessionServices.createSession(payload);
            return thunkAPI.fulfillWithValue(session)
        } catch (e) {

            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch hall')

        }
    }
)

let updateSession = createAsyncThunk<ISession, {id: number, payload: Partial<ISession>}>(
    'sessionSlice/updateSession', async ({id, payload}, thunkAPI)=>{
        try {
            let session = await sessionServices.updateSession(id, payload);
            return thunkAPI.fulfillWithValue(session)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch hall')
        }
    }
)

let deleteSession = createAsyncThunk<number, number>(
    'sessionSlice/deleteSession', async (id, thunkAPI) => {
        try {
            await sessionServices.deleteSession(id);
            return thunkAPI.fulfillWithValue(id);
        } catch (e) {
            let error = e as AxiosError<{detail: string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to delete session');
        }
    }
)
let getSessionSeats = createAsyncThunk<ISessionSeat[], number>(
    'sessionSlice/getSessionSeats', async (sessionId, thunkAPI) => {
        try {
            let seats = await sessionServices.getSessionSeats(sessionId);
            return thunkAPI.fulfillWithValue(seats);
        } catch (e) {
            let error = e as AxiosError<{detail: string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch session seats');
        }
    }
)

let getSessionsByMovie = createAsyncThunk<ISession[], number>(
    'sessionSlice/getSessionsByMovie', async (movieId, thunkAPI) => {
        try {
            let sessions = await sessionServices.getAllByMovie(movieId);
            return thunkAPI.fulfillWithValue(sessions);
        } catch (e) {
            let error = e as AxiosError<{detail: string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch sessions');
        }
    }
)

//price

let getPrices = createAsyncThunk<ISession_price[], number>(
    'sessionSlice/getPrices', async (sessionId, thunkAPI) => {
        try {
            let prices = await sessionServices.getPrices(sessionId);
            return thunkAPI.fulfillWithValue(prices)
        } catch (e) {
            let error = e as AxiosError<{detail: string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch prices')
        }
    }
)

let createPrice = createAsyncThunk<ISession_price, {sessionId: number, payload: Partial<ISession_price>}>(
    'sessionSlice/createPrice', async ({sessionId, payload}, thunkAPI) => {
        try {
            let price = await sessionServices.createPrice(sessionId, payload);
            return thunkAPI.fulfillWithValue(price)
        } catch (e) {
            let error = e as AxiosError<{detail: string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to create price')
        }
    }
)

let updatePrice = createAsyncThunk<ISession_price, {sessionId: number, id: number, payload: Partial<ISession_price>}>(
    'sessionSlice/updatePrice', async ({sessionId, id, payload}, thunkAPI) => {
        try {
            let price = await sessionServices.updatePrice(sessionId, id, payload);
            return thunkAPI.fulfillWithValue(price)
        } catch (e) {
            let error = e as AxiosError<{detail: string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to update price')
        }
    }
)

let deletePrice = createAsyncThunk<ISession_price, {sessionId: number, id: number}>(
    'sessionSlice/deletePrice', async ({sessionId, id}, thunkAPI) => {
        try {
            let price = await sessionServices.deletePrice(sessionId, id);
            return thunkAPI.fulfillWithValue(price)
        } catch (e) {
            let error = e as AxiosError<{detail: string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to delete price')
        }
    }
)


export const sessionSlice = createSlice({
    name: 'sessionSlice',
    initialState,
    reducers: {
        clearError: (state) => { state.error = ''; },
        clearSession: (state) => { state.session = null; },
        clearPrices: (state) => { state.prices = []; },
    },
    extraReducers: (builder) => {

        builder
            .addCase(getAllSessions.fulfilled, (state, action) => {
                state.sessions = action.payload;
            })
            .addCase(getSessionById.fulfilled, (state, action) => {
                state.session = action.payload;
            })
            .addCase(createSession.fulfilled, (state, action) => {
                state.sessions.push(action.payload);
            })
            .addCase(updateSession.fulfilled, (state, action) => {
                state.session = action.payload;
                const idx = state.sessions.findIndex(s => s.id === action.payload.id);
                if (idx !== -1) state.sessions[idx] = action.payload;
            })
            .addCase(deleteSession.fulfilled, (state, action) => {
                state.session = null;
                state.sessions = state.sessions.filter(s => s.id !== action.payload);
            })
            .addCase(getSessionsByMovie.fulfilled, (state, action) => {
                state.sessions = action.payload;
            })
            .addCase(getPrices.fulfilled, (state, action) => {
                state.prices = action.payload;
            })
            .addCase(createPrice.fulfilled, (state, action) => {
                state.prices.push(action.payload);
            })
            .addCase(updatePrice.fulfilled, (state, action) => {
                const idx = state.prices.findIndex(p => p.id === action.payload.id);
                if (idx !== -1) state.prices[idx] = action.payload;
            })
            .addCase(deletePrice.fulfilled, (state, action) => {
                state.prices = state.prices.filter(p => p.id !== action.payload.id);
            })
            .addCase(getSessionSeats.fulfilled, (state, action) => {
                state.sessionSeats = action.payload;
            })

        builder
            .addMatcher(
                isPending(getAllSessions, getSessionById, createSession, updateSession, deleteSession, getSessionSeats, getSessionsByMovie,
                    getPrices, createPrice, updatePrice, deletePrice),
                (state) => {
                    state.isLoaded = true;
                    state.error = '';
                }
            )
            .addMatcher(
                isFulfilled(getAllSessions, getSessionById, createSession, updateSession, deleteSession, getSessionSeats,getSessionsByMovie,
                    getPrices, createPrice, updatePrice, deletePrice),
                (state) => {
                    state.isLoaded = false;
                }
            )
            .addMatcher(
                isRejected(getAllSessions, getSessionById, createSession, updateSession, deleteSession, getSessionSeats,getSessionsByMovie,
                    getPrices, createPrice, updatePrice, deletePrice),
                (state, action) => {
                    state.isLoaded = false;
                    state.error = action.payload as string ?? 'Unknown error';
                }
            )
    },
});

export const sessionActions = {
    ...sessionSlice.actions,
    getAllSessions, getSessionById, createSession, updateSession, deleteSession, getSessionSeats, getSessionsByMovie,
    getPrices, createPrice, updatePrice, deletePrice
}




