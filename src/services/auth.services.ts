import axios from "axios";
import {baseUrl, urls} from "../constants/urls";
import {TokenObtainPair} from "../models/TokenObtainPair";
import {retriveLocalStorageData} from "../helpers/helper";
import {TokenRefresh} from "../models/TokenRefresh";
import {IPasswordChange} from "../models/IPasswordChange";

let axiosInstance = axios.create({
    baseURL:baseUrl
})
const PUBLIC_URLS = [
    urls.auth.base,
    urls.auth.refreshToken(),
    urls.auth.requestPasswordRecovery(),
    // activate перевіряємо через startsWith, бо містить динамічний токен
];
axiosInstance.interceptors.request.use(requestObject => {
    const url = requestObject.url ?? '';

    const isPublic = PUBLIC_URLS.includes(url) ||
        url.includes('/activate/') ||
        url.includes('/recovery/');

    if (localStorage.getItem('tokenPair') && !isPublic) {
        requestObject.headers.set('Authorization', 'Bearer ' + retriveLocalStorageData<TokenRefresh>('tokenPair').access);
    }

    return requestObject;
});

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
    changePassword: async (token: string,payload: IPasswordChange): Promise<string> => {

        const response = await axiosInstance.post(urls.auth.changePassword(token), payload);
        return response.data
    },
    activateAccount: async (token: string):Promise<string> =>{
       const response = await axiosInstance.patch(urls.auth.activateAccount(token))
        return response.data
    }

}

