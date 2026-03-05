import {ISession} from "../../models/ISession";
import {createAsyncThunk, createSlice, isFulfilled, isPending, isRejected, PayloadAction} from "@reduxjs/toolkit";
import {sessionServices} from "../../services/session.services";
import {AxiosError} from "axios";


type SessionSliceType = {
    sessions: ISession[],
    isLoaded:boolean,
    session:ISession|null,
    error:string
}

const initialState:SessionSliceType = {
    sessions:[],
    isLoaded:false,
    session:null,
    error:''
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

let createSession = createAsyncThunk<ISession, ISession>(
    'sessionSlice/createSession', async (payload, thunkAPI)=>{
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

let deleteSession = createAsyncThunk<ISession, number>(
    'sessionSlice/deleteSession', async (id, thunkAPI)=>{
        try {
            let session = await sessionServices.deleteSession(id);
            return thunkAPI.fulfillWithValue(session)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch hall')
        }
    }
)

export const sessionSlice = createSlice({
    name: 'sessionSlice',
    initialState,
    reducers: {
        clearError: (state) => { state.error = ''; },
        clearSession: (state) => { state.session = null; },
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
                state.sessions = state.sessions.filter(s => s.id !== action.payload.id);
            })

        builder
            .addMatcher(
                isPending(getAllSessions, getSessionById, createSession, updateSession, deleteSession),
                (state) => {
                    state.isLoaded = true;
                    state.error = '';
                }
            )
            .addMatcher(
                isFulfilled(getAllSessions, getSessionById, createSession, updateSession, deleteSession),
                (state) => {
                    state.isLoaded = false;
                }
            )
            .addMatcher(
                isRejected(getAllSessions, getSessionById, createSession, updateSession, deleteSession),
                (state, action) => {
                    state.isLoaded = false;
                    state.error = action.payload as string ?? 'Unknown error';
                }
            )
    },
});

export const sessionActions = {
    ...sessionSlice.actions,
    getAllSessions, getSessionById, createSession, updateSession, deleteSession
}




