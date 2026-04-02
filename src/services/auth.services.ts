import axios from "axios";
import {baseUrl, urls} from "../constants/urls";
import {TokenObtainPair} from "../models/TokenObtainPair";
import {retriveLocalStorageData} from "../helpers/helper";
import {TokenRefresh} from "../models/TokenRefresh";
import {IPasswordChange} from "../models/IPasswordChange";
import {axiosInstance} from "../helpers/axiosInstance";


export const authServices = {
    authenticate: async (credentials: TokenObtainPair): Promise<TokenRefresh> => {

        const { data } = await axiosInstance.post<TokenRefresh>(urls.auth.base, credentials);

        localStorage.setItem('tokenPair', JSON.stringify(data));

        return data;
    },
    refresh: async (): Promise<string> => {

        const refreshToken = retriveLocalStorageData<TokenRefresh>('tokenPair').refresh;
        const response = await axiosInstance.post<TokenRefresh>(urls.auth.refreshToken(), {refresh: refreshToken});
        localStorage.setItem('tokenPair', JSON.stringify(response.data));
        return response.data.access
    },
    requestPasswordRecover: async (email: string): Promise<void> => {
        await axiosInstance.post(urls.auth.requestPasswordRecovery(), { email });

    },
    recoveryChangePassword: async (token: string,payload: IPasswordChange): Promise<string> => {

        const response = await axiosInstance.post(urls.auth.changePassword(token), payload);
        console.log(token)
        return response.data
    },
    activateAccount: async (token: string):Promise<string> =>{
       const response = await axiosInstance.patch(urls.auth.activateAccount(token))
        return response.data
    }

}

