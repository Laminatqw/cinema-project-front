import {TokenRefresh} from "../../models/TokenRefresh";
import {createAsyncThunk, createSlice, isPending, isRejected} from "@reduxjs/toolkit";
import {TokenObtainPair} from "../../models/TokenObtainPair";
import {userServices} from "../../services/user.services";
import {authServices} from "../../services/auth.services";
import {AxiosError} from "axios";

interface AuthState {
    token: TokenRefresh | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

export const authenticateUser = createAsyncThunk<TokenRefresh, TokenObtainPair>(
    'authSlice/authenticate', async (payload, thunkAPI) =>{
        try{
            let loginInfo = await authServices.authenticate(payload);
            return thunkAPI.fulfillWithValue(loginInfo)

        }catch (e){
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to login')
        }
    }
)

export const refreshToken= createAsyncThunk(
    'authSlice/refresh', async (_, thunkAPI)=>{
        try {
            let refreshInfo = await authServices.refresh();
            return thunkAPI.fulfillWithValue(refreshInfo)
        }catch (e){
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Error')
        }
    }
)

export const authSlice = createSlice({
    name:'authSlice',
    initialState:initialState,
    reducers:{
        clearError: state => {
            state.error = null;
        },
    },
    extraReducers:builder => {
        builder
            .addCase(
                authenticateUser.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.token = action.payload;
                    state.isAuthenticated = true;
                })
            .addCase(
                refreshToken.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.isAuthenticated = true;
                })
            .addMatcher(isRejected(
                authenticateUser, refreshToken), (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload as string;
            })
            .addMatcher(isPending(authenticateUser, refreshToken), (state) => {
                state.isLoading = true;
                state.error = '';
            })
    }
}
)

export const authActions = {
    ...authSlice.actions,
    authenticateUser,
    refreshToken,
}

