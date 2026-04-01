import {urls} from "../constants/urls";
import {ISession} from "../models/ISession";
import {axiosInstance} from "../helpers/axiosInstance";
import {ISession_price} from "../models/ISession_price";
import {ISessionSeat} from "../models/ISessionSeat";
import {PageSizeModel} from "../models/filters/PageSizeModel";
import {PaginatedModel} from "../models/PaginatedModel";



    export const sessionServices = {
        getAll: async (filters?:PageSizeModel): Promise<PaginatedModel<ISession>> => {
            let response = await axiosInstance.get(urls.sessions.base,{
                params:filters,
            });
            return response.data;
        },
        getById: async (id: number): Promise<ISession> => {
            let response = await axiosInstance.get<ISession>(urls.sessions.byId(id));
            return response.data;
        },
        createSession: async (payload: Partial<ISession>): Promise<ISession> => {
            try {
                let response = await axiosInstance.post<ISession>(urls.sessions.base, payload);
                return response.data;
            } catch (e: any) {
                console.log(e.response.data); // деталі помилки від Django
                throw e;
            }
        },
        updateSession: async (id: number, payload: Partial<ISession>): Promise<ISession> => {
            let response = await axiosInstance.patch<ISession>(urls.sessions.byId(id), payload);
            return response.data;
        },
        deleteSession: async (id: number): Promise<number> => {
            await axiosInstance.delete(urls.sessions.byId(id));
            return id;
        },
        getSessionSeats: async (sessionId: number): Promise<ISessionSeat[]> => {
            let response = await axiosInstance.get(urls.sessions.seats(sessionId));
            return response.data;
        },
        getAllByMovie: async (movieId:number, filters?:PageSizeModel): Promise<PaginatedModel<ISession>> => {
            let response = await axiosInstance.get(urls.sessions.base, {
                params: {movie:movieId,
                        page: filters?.page,
                        size:filters?.size}
            });
            return response.data;
        },
        getAllByDate: async (filters: { date?: string, hall_type?: string, movie?: number[], page?: number, size?: number }): Promise<PaginatedModel<ISession>> => {
            let response = await axiosInstance.get(urls.sessions.base, { params: filters });
            return response.data;
        },

        //prices

        getPrices: async (sessionId: number): Promise<ISession_price[]> => {
            let response = await axiosInstance.get<{data: ISession_price[]}>(urls.sessions.price(sessionId));
            return response.data.data;
        },
        createPrice: async (sessionId: number, payload: Partial<ISession_price>): Promise<ISession_price> => {
            let response = await axiosInstance.post<ISession_price>(urls.sessions.price(sessionId), payload);
            return response.data;
        },
        updatePrice: async (sessionId: number, id: number, payload: Partial<ISession_price>): Promise<ISession_price> => {
            let response = await axiosInstance.patch<ISession_price>(urls.sessions.priceById(sessionId, id), payload);
            return response.data;
        },
        deletePrice: async (sessionId: number, id: number): Promise<ISession_price> => {
            let response = await axiosInstance.delete<ISession_price>(urls.sessions.priceById(sessionId, id));
            return response.data;
        },
    }


