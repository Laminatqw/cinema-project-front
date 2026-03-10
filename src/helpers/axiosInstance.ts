import axios from "axios";
import { baseUrl, urls } from "../constants/urls";
import { retriveLocalStorageData } from "../helpers/helper";
import { TokenRefresh } from "../models/TokenRefresh";

const PUBLIC_URLS = [
    urls.auth.base,
    urls.auth.refreshToken(),
    urls.auth.requestPasswordRecovery(),
];

export const axiosInstance = axios.create({
    baseURL: baseUrl
});

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