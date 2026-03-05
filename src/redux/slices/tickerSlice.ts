import {ITickets} from "../../models/ITickets";
import {createAsyncThunk, createSlice, isFulfilled, isPending, isRejected} from "@reduxjs/toolkit";
import {ticketServices} from "../../services/ticket.services";
import {AxiosError} from "axios";



type TickerSliceType = {
    tickets : ITickets[],
    ticket : ITickets|null,
    isLoaded: boolean,
    error: string
}

const initialState: TickerSliceType = {
    tickets: [],
    ticket: null,
    isLoaded:false,
    error: ''
}

let getTicket = createAsyncThunk<ITickets[]>(
    'ticketSlice/getTicket', async (_, thunkAPI)=>{
        try {
            let ticket = await ticketServices.getTicket();
            return thunkAPI.fulfillWithValue(ticket)
        } catch (e){
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch halls')
        }
    }
)

let createTicket = createAsyncThunk<ITickets, ITickets>(
    'ticketSlice/createTicket', async (payload, thunkAPI)=>{
        try {
            let session = await ticketServices.createTicket(payload);
            return thunkAPI.fulfillWithValue(session)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch hall')
        }
    }
)

export const ticketSlice = createSlice({
    name: 'ticketSlice',
    initialState,
    reducers: {
        clearError: (state) => { state.error = ''; },
        clearTicket: (state) => { state.ticket = null; },
    },
    extraReducers: (builder) => {

        builder
            .addCase(getTicket.fulfilled, (state, action) => {
                state.tickets = action.payload;
            })
            .addCase(createTicket.fulfilled, (state, action) => {
                state.tickets.push(action.payload);
                state.ticket = action.payload;
            })

        builder
            .addMatcher(
                isPending(getTicket, createTicket),
                (state) => {
                    state.isLoaded = true;
                    state.error = '';
                }
            )
            .addMatcher(
                isFulfilled(getTicket, createTicket),
                (state) => {
                    state.isLoaded = false;
                }
            )
            .addMatcher(
                isRejected(getTicket, createTicket),
                (state, action) => {
                    state.isLoaded = false;
                    state.error = action.payload as string;
                }
            )
    },
});

export const ticketActions = {
    ...ticketSlice.actions,
    getTicket, createTicket
}
