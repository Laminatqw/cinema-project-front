import axios from "axios";
import {baseUrl, urls} from "../constants/urls";
import {IUser} from "../models/IUser";
import {TokenRefresh} from "../models/TokenRefresh";
import {IMovie} from "../models/IMovie";
import {IRegisterModel} from "../models/IRegisterModel";
import {retriveLocalStorageData} from "../helpers/helper";
import {axiosInstance} from "../helpers/axiosInstance";

export const userServices = {

    getMyUserInfo:async ():Promise<IUser>=>{
        let response = await axiosInstance.get<IUser>(urls.users.info())
        return response.data
    },
    register: async (payload: IRegisterModel):Promise<void>=>{
        let response = await axiosInstance.post<IRegisterModel>(urls.users.me(), payload)
    },
    logout:async ():Promise<string>=>{
        const tokenPair = retriveLocalStorageData<TokenRefresh>('tokenPair')
        let response = await axiosInstance.post<string>(urls.users.logout(), {refresh:tokenPair.refresh})
        localStorage.removeItem('tokenPair');
        return response.data
    },
    updateUserInfo: async (payload: Partial<IUser>): Promise<IUser> => {
        let response = await axiosInstance.patch<IUser>(urls.users.info(), payload);
        return response.data;
    },
}