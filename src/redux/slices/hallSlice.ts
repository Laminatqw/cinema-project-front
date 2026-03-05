import {IHall} from "../../models/IHall";
import {IHallSeat} from "../../models/IHallSeat";
import {createAsyncThunk, createSlice, isFulfilled, isPending, isRejected, PayloadAction} from "@reduxjs/toolkit";
import {hallServices} from "../../services/hall.services";
import {AxiosError} from "axios";


type HallSliceType = {
    halls:IHall[],
    isLoaded:boolean,
    seats:IHallSeat[],
    error:string,
    hall:IHall|null,
    seat:IHallSeat|null,
}

const initialState:HallSliceType = {
    halls:[],
    isLoaded:false,
    seats:[],
    error:'',
    hall:null,
    seat:null,
}


let getAllHalls = createAsyncThunk<IHall[]>(
    'hallSlice/getAllHalls', async (_, thunkAPI)=>{
        try {
            let halls = await hallServices.getAll();
            return thunkAPI.fulfillWithValue(halls)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch halls')
        }
    }
)
let getHallById = createAsyncThunk<IHall, number>(
    'hallSlice/getHallById', async (id, thunkAPI)=>{
        try {
            let hall = await hallServices.getById(id);
            return thunkAPI.fulfillWithValue(hall)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch hall')
        }
    }
)

let createHall = createAsyncThunk<IHall, IHall>(
    'hallSlice/createHall', async (payload, thunkAPI)=>{
        try {
            let hall = await hallServices.createHall(payload);
            return thunkAPI.fulfillWithValue(hall)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch hall')
        }
    }
)

let updateHall = createAsyncThunk<IHall, {id: number, payload: Partial<IHall>}>(
    'hallSlice/updateHall', async ({id, payload}, thunkAPI)=>{
        try {
            let hall = await hallServices.updateHall(id, payload);
            return thunkAPI.fulfillWithValue(hall)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch hall')
        }
    }
)

let deleteHall = createAsyncThunk<IHall, number>(
    'hallSlice/deleteHall', async (id, thunkAPI)=>{
        try {
            let hall = await hallServices.deleteHall(id);
            return thunkAPI.fulfillWithValue(hall)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch hall')
        }
    }
)

let getAllSeats = createAsyncThunk<IHallSeat[], number>(
    'hallSlice/getAllSeats', async (id, thunkAPI)=>{
        try {
            let halls = await hallServices.getAllSeats(id);
            return thunkAPI.fulfillWithValue(halls)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch halls')
        }
    }
)
let getHallSeatById = createAsyncThunk<IHallSeat, number>(
    'hallSlice/getSeatById', async (id, thunkAPI)=>{
        try {
            let seat = await hallServices.getSeatById(id);
            return thunkAPI.fulfillWithValue(seat)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch hall')
        }
    }
)

let createSeats = createAsyncThunk<IHallSeat[], { id: number; seats: Partial<IHallSeat>|Partial<IHallSeat>[];
} >(
    'hallSlice/createSeat', async ({id, seats}, thunkAPI)=>{
        try {
            let seat = await hallServices.createSeats(id, seats);
            return thunkAPI.fulfillWithValue(seat)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch hall')
        }
    }
)

let updateSeat = createAsyncThunk<IHallSeat, {id: number, payload: Partial<IHallSeat>}>(
    'hallSlice/updateSeat', async ({id, payload}, thunkAPI)=>{
        try {
            let hall = await hallServices.updateSeat(id, payload);
            return thunkAPI.fulfillWithValue(hall)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch hall')
        }
    }
)

let deleteSeat = createAsyncThunk<IHallSeat, number>(
    'hallSlice/deleteSeat', async (id, thunkAPI)=>{
        try {
            let hall = await hallServices.deleteSeat(id);
            return thunkAPI.fulfillWithValue(hall)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch hall')
        }
    }
)



export const hallSlice = createSlice({
    name: 'hallSlice',
    initialState,
    reducers: {
        clearError: (state) => { state.error = ''; },
        clearHall: (state) => { state.hall = null; },
        clearSeat: (state) => { state.seat = null; },
    },
    extraReducers: (builder) => {

        // ---- Halls ----
        builder
            .addCase(getAllHalls.fulfilled, (state, action: PayloadAction<IHall[]>) => {
                state.halls = action.payload;
            })
            .addCase(getHallById.fulfilled, (state, action: PayloadAction<IHall>) => {
                state.hall = action.payload;
            })
            .addCase(createHall.fulfilled, (state, action: PayloadAction<IHall>) => {
                state.halls.push(action.payload);
            })
            .addCase(updateHall.fulfilled, (state, action: PayloadAction<IHall>) => {
                state.hall = action.payload;
                const idx = state.halls.findIndex(h => h.id === action.payload.id);
                if (idx !== -1) state.halls[idx] = action.payload;
            })
            .addCase(deleteHall.fulfilled, (state, action: PayloadAction<IHall>) => {
                state.hall = null;
                state.halls = state.halls.filter(h => h.id !== action.payload.id);
            })

        // ---- Seats ----
        builder
            .addCase(getAllSeats.fulfilled, (state, action: PayloadAction<IHallSeat[]>) => {
                state.seats = action.payload;
            })
            .addCase(getHallSeatById.fulfilled, (state, action: PayloadAction<IHallSeat>) => {
                state.seat = action.payload;
            })
            .addCase(createSeats.fulfilled, (state, action: PayloadAction<IHallSeat[]>) => {
                state.seats.push(...action.payload);
            })
            .addCase(updateSeat.fulfilled, (state, action: PayloadAction<IHallSeat>) => {
                state.seat = action.payload;
                const idx = state.seats.findIndex(s => s.id === action.payload.id);
                if (idx !== -1) state.seats[idx] = action.payload;
            })
            .addCase(deleteSeat.fulfilled, (state, action: PayloadAction<IHallSeat>) => {
                state.seat = null;
                state.seats = state.seats.filter(s => s.id !== action.payload.id);
            })

        // ---- Matchers ----
        builder
            .addMatcher(
                isPending(
                    getAllHalls, getHallById, createHall, updateHall, deleteHall,
                    getAllSeats, getHallSeatById, createSeats, updateSeat, deleteSeat
                ),
                (state) => {
                    state.isLoaded = true;
                    state.error = '';
                }
            )
            .addMatcher(
                isFulfilled(
                    getAllHalls, getHallById, createHall, updateHall, deleteHall,
                    getAllSeats, getHallSeatById, createSeats, updateSeat, deleteSeat
                ),
                (state) => {
                    state.isLoaded = false;
                }
            )
            .addMatcher(
                isRejected(
                    getAllHalls, getHallById, createHall, updateHall, deleteHall,
                    getAllSeats, getHallSeatById, createSeats, updateSeat, deleteSeat
                ),
                (state, action) => {
                    state.isLoaded = false;
                    state.error = action.payload as string ?? 'Unknown error';
                }
            )
    },
});

export const hallActions = {
    ...hallSlice.actions,
    getAllHalls, getHallById, createHall, updateHall, deleteHall,
    getAllSeats, getHallSeatById, createSeats, updateSeat, deleteSeat
}
