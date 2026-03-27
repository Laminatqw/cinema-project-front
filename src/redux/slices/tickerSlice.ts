import {ITickets} from "../../models/ITickets";
import {createAsyncThunk, createSlice, isFulfilled, isPending, isRejected} from "@reduxjs/toolkit";
import {ticketServices} from "../../services/ticket.services";
import {AxiosError} from "axios";
import { ITicketDetail } from "../../models/ITicketDetail";



type TickerSliceType = {
    tickets : ITickets[],
    ticket : ITickets|null,
    ticketDetail : ITicketDetail|null,
    isLoaded: boolean,
    error: string
}

const initialState: TickerSliceType = {
    tickets: [],
    ticket: null,
    ticketDetail: null,
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

let createTicket = createAsyncThunk<ITickets | {created: number}, Partial<ITickets> | Partial<ITickets>[]>(
    'ticketSlice/createTicket', async (payload, thunkAPI) => {
        try {
            let result = await ticketServices.createTicket(payload);
            return thunkAPI.fulfillWithValue(result);
        } catch (e) {
            let error = e as AxiosError<{detail: string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to create ticket');
        }
    }
)
let getTicketById = createAsyncThunk<ITicketDetail, number>(
    'ticketSlice/getTicketById', async (id, thunkAPI) => {
        try {
            let ticket = await ticketServices.getTicketById(id);
            return thunkAPI.fulfillWithValue(ticket);
        } catch (e) {
            let error = e as AxiosError<{detail: string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch ticket');
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
                state.isLoaded = false;
            })
            .addCase(getTicketById.fulfilled, (state, action) => {
                state.ticketDetail = action.payload;
            })

        builder
            .addMatcher(
                isPending(getTicket, createTicket, getTicketById),
                (state) => {
                    state.isLoaded = true;
                    state.error = '';
                }
            )
            .addMatcher(
                isFulfilled(getTicket, createTicket, getTicketById),
                (state) => {
                    state.isLoaded = false;
                }
            )
            .addMatcher(
                isRejected(getTicket, createTicket, getTicketById),
                (state, action) => {
                    state.isLoaded = false;
                    state.error = action.payload as string;
                }
            )
    },
});

export const ticketActions = {
    ...ticketSlice.actions,
    getTicket, createTicket, getTicketById
}
