import {IUser} from "../../models/IUser";
import {createAsyncThunk, createSlice, isPending, isRejected} from "@reduxjs/toolkit";
import {userServices} from "../../services/user.services";
import {AxiosError} from "axios";

type UserSliceType = {
    users: IUser[];
    isLoaded: boolean,
    error: string;
    user: IUser | null;
    isInitialized: boolean
}
const initialState: UserSliceType = {
    users: [],
    isLoaded: true,
    error: '',
    user: null,
    isInitialized:false

};

let getUserInfo = createAsyncThunk<
    IUser, //повертає
    void, //аргумент
    {rejectValue: string} //тип помилки
    >(
    'userSlice/getMyInfo', async (_, thunkAPI)=>{
    try {
        let userInfo = await userServices.getMyUserInfo();
        return thunkAPI.fulfillWithValue(userInfo)
    } catch (e) {
        let error = e as AxiosError<{detail:string}>;
        return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to fetch user')
    }
})

let updateUserInfo = createAsyncThunk<IUser, Partial<IUser>, {rejectValue:string}>(
    'userSlice/updateMyInfo', async (payload, thunkAPI)=> {
        try {
            let userInfo = await userServices.updateUserInfo(payload);
            return thunkAPI.fulfillWithValue(userInfo)
        } catch (e) {
            let error = e as AxiosError<{detail:string}>;
            return thunkAPI.rejectWithValue(error?.response?.data.detail || 'Failed to Update')
        }
    })
export const logoutUser = createAsyncThunk(
    'userSlice/logout',
    async (_, { rejectWithValue }) => {
        try {
            await userServices.logout()
        } catch (e) {
            return rejectWithValue('Logout failed')
        }
    }
)

export const userSlice = createSlice({
    name:'userSlice',
    initialState:initialState,
    reducers:{
        clearError: (state) => {
            state.error = ''
        }
    },
    extraReducers:builder => {
        builder
            .addCase(
                updateUserInfo.fulfilled,(state,action)=>{
                    state.user = action.payload;
                    state.isLoaded = true;
                }
            )
            .addCase(
                logoutUser.fulfilled,(state, action)=>{
                    state.user = null
                    state.users = []
                    state.error = ''
                    state.isLoaded = true
                }
            )
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoaded = true;
                state.isInitialized = true;  // додати
            })
            .addCase(getUserInfo.rejected, (state) => {
                state.isLoaded = true;
                state.isInitialized = true;  // додати — навіть якщо помилка
            })
            .addMatcher(isRejected(getUserInfo, updateUserInfo, logoutUser),(state, action)=>{
                state.error = action.payload as string
                state.isLoaded = true
            })

            .addMatcher(isPending(getUserInfo, updateUserInfo, logoutUser),(state)=>{
                state.isLoaded = false
                state.error = ''
            })

    }
})

export const userActions = {
    ...userSlice.actions,
    getUserInfo,
    updateUserInfo,
    logoutUser,
}

