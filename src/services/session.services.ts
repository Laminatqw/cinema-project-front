import axios from "axios";
import {baseUrl, urls} from "../constants/urls";
import {IMovie} from "../models/IMovie";
import {ISession} from "../models/ISession";
import {createSlice} from "@reduxjs/toolkit";

let axiosInstance = axios.create({
    baseURL:baseUrl
})

export const sessionServices = {
    getAll: async (): Promise<ISession[]> => {
        let response = await axiosInstance.get<{data:ISession[]}>(urls.sessions.base);
        return response.data.data;
    },
    getById: async (id: number): Promise<ISession> => {
        let response = await axiosInstance.get<ISession>(urls.sessions.byId(id));
        return response.data;
    },
    createSession: async (payload: Partial<ISession>): Promise<ISession> => {
        let response = await axiosInstance.post<ISession>(urls.sessions.base, payload);
        return response.data;
    },
    updateSession: async (id: number, payload: Partial<ISession>): Promise<ISession> => {
        let response = await axiosInstance.patch<ISession>(urls.sessions.byId(id), payload);
        return response.data;
    },
    deleteSession: async (id: number): Promise<ISession> => {
        let response = await axiosInstance.get<ISession>(urls.sessions.byId(id));
        return response.data;
    },
}


