import {IHall} from "../../models/IHall";
import {IHallSeat} from "../../models/IHallSeat";
import {createAsyncThunk, createSlice, isFulfilled, isPending, isRejected, PayloadAction} from "@reduxjs/toolkit";
import {hallServices} from "../../services/hall.services";
import {AxiosError} from "axios";
import {PageSizeModel} from "../../models/filters/PageSizeModel";
import {PaginatedPageModel} from "../../models/PaginatedPageModel";
import {PaginatedModel} from "../../models/PaginatedModel";


type HallSliceType = {
    halls:IHall[],
    isLoaded:boolean,
    seats:IHallSeat[],
    error:string,
    hall:IHall|null,
    seat:IHallSeat|null,
    total_pages:number|null,
    total_items:number|null,
    prev:PaginatedPageModel |null,
    next:PaginatedPageModel |null,
    filters:PageSizeModel
}

const initialState:HallSliceType = {
    halls:[],
    isLoaded:false,
    seats:[],
    error:'',
    hall:null,
    seat:null,
    total_pages:null,
    total_items:null,
    prev:null,
    next:null,
    filters:{
        page:1,
        size:10
    }
}


let getAllHalls = createAsyncThunk<PaginatedModel<IHall>, PageSizeModel|undefined>(
    'hallSlice/getAllHalls', async (filters, thunkAPI)=>{
        try {
            let halls = await hallServices.getAll(filters);
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
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to create hall')
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
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to update hall')
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
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to delete hall')
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
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch seats')
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
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch seat')
        }
    }
)

let createSeats = createAsyncThunk<{created: number}, { id: number; seats: Partial<IHallSeat>[] }>(
    'hallSlice/createSeat', async ({id, seats}, thunkAPI) => {
        try {
            let result = await hallServices.createSeats(id, seats);
            return thunkAPI.fulfillWithValue(result);
        } catch (e) {
            let error = e as AxiosError<{detail: string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to create seat(s)');
        }
    }
)

let updateSeats = createAsyncThunk<{updated: number}, {id: number, seats: Partial<IHallSeat>[]}>(
    'hallSlice/bulkUpdateSeats', async ({id, seats}, thunkAPI) => {
        try {
            let result = await hallServices.updateSeats(id, seats);
            return thunkAPI.fulfillWithValue(result);
        } catch (e) {
            let error = e as AxiosError<{detail: string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to update seats');
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
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to delete seat')
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
        setPage(state, action){
            state.filters.page = action.payload
        },
        setPageSize(state, action) {
            state.filters.size = action.payload;
            state.filters.page = 1;
        },
    },
    extraReducers: (builder) => {

        // ---- Halls ----
        builder
            .addCase(getAllHalls.fulfilled, (state, action) => {
                state.halls = action.payload?.data || []
                state.total_pages = action.payload.total_pages
                state.total_items = action.payload.total_items
                state.isLoaded = true
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
            .addCase(createSeats.fulfilled, (state) => {
                // нічого не робимо, або просто ігноруємо payload
                state.isLoaded = false;
            })
            .addCase(updateSeats.fulfilled, (state) => {
                state.isLoaded = false;
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
                    getAllSeats, getHallSeatById, createSeats, updateSeats, deleteSeat
                ),
                (state) => {
                    state.isLoaded = true;
                    state.error = '';
                }
            )
            .addMatcher(
                isFulfilled(
                    getAllHalls, getHallById, createHall, updateHall, deleteHall,
                    getAllSeats, getHallSeatById, createSeats, updateSeats, deleteSeat
                ),
                (state) => {
                    state.isLoaded = false;
                }
            )
            .addMatcher(
                isRejected(
                    getAllHalls, getHallById, createHall, updateHall, deleteHall,
                    getAllSeats, getHallSeatById, createSeats, updateSeats, deleteSeat
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
    getAllSeats, getHallSeatById, createSeats, updateSeats, deleteSeat
}
