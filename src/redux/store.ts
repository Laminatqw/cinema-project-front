import {configureStore} from "@reduxjs/toolkit";
import {userSlice} from "./slices/userSlice";
import {useDispatch, useSelector} from "react-redux";
import {authSlice} from "./slices/authSlice";
import {hallSlice} from "./slices/hallSlice";
import {ticketSlice} from "./slices/tickerSlice";
import {movieSlice} from "./slices/movieSlice";
import {sessionSlice} from "./slices/sessionSlice";

export const store = configureStore({
    reducer: {
        userStore: userSlice.reducer,
        authStore: authSlice.reducer,
        hallStore: hallSlice.reducer,
        ticketStore: ticketSlice.reducer,
        movieStore: movieSlice.reducer,
        sessionStore: sessionSlice.reducer,
    }
});

export const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>();
export const useAppSelector = useSelector.withTypes<ReturnType<typeof store.getState>>();