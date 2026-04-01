import axios from "axios";
import {baseUrl, urls} from "../constants/urls";
import {IHall} from "../models/IHall";
import {IHallSeat} from "../models/IHallSeat";
import {axiosInstance} from "../helpers/axiosInstance";
import {PageSizeModel} from "../models/filters/PageSizeModel";
import {PaginatedModel} from "../models/PaginatedModel";



export const hallServices = {
    getAll: async (filters?:PageSizeModel): Promise<PaginatedModel<IHall>> => {
        let response = await axiosInstance.get(urls.halls.base,
            {
                params:filters,
        });
        return response.data;
    },
    getById: async (id: number): Promise<IHall> => {
        let response = await axiosInstance.get<IHall>(urls.halls.byId(id));
        return response.data;
    },
    createHall: async (payload: Partial<IHall>): Promise<IHall> => {
        let response = await axiosInstance.post<IHall>(urls.halls.base, payload);
        return response.data;
    },
    updateHall: async (id: number, payload: Partial<IHall>): Promise<IHall> => {
        let response = await axiosInstance.patch<IHall>(urls.halls.byId(id), payload);
        return response.data;
    },
    deleteHall: async (id: number): Promise<IHall> => {
        let response = await axiosInstance.get<IHall>(urls.halls.byId(id));
        return response.data;
    },
    getAllSeats: async (hallId: number): Promise<IHallSeat[]> => {
        let response = await axiosInstance.get(urls.halls.seats(hallId), {
            params: { size: 1000 }
        });
        // перевіряємо формат відповіді
        return Array.isArray(response.data) ? response.data : response.data.data;
    },
    getSeatById: async (id: number): Promise<IHallSeat> => {
        let response = await axiosInstance.get<IHallSeat>(urls.halls.byId(id));
        return response.data;
    },
    createSeats: async (hallId: number, payload: Partial<IHallSeat> | Partial<IHallSeat>[]): Promise<{created: number}> => {
        let response = await axiosInstance.post(urls.halls.seats(hallId), payload);
        return response.data;
    },
    deleteSeat: async (seatId: number): Promise<IHallSeat> => {
        let response = await axiosInstance.delete<IHallSeat>(urls.halls.seatById(seatId));
        return response.data;
    },
    deleteAllSeats: async (hallId: number): Promise<{deleted: number}> => {
        let response = await axiosInstance.delete(urls.halls.seatsDeleteAll(hallId));
        return response.data;
    },
    updateSeats: async (hallId: number, payload: Partial<IHallSeat>[]): Promise<{updated: number}> => {
        let response = await axiosInstance.put(urls.halls.seatsUpdate(hallId), payload);
        return response.data;
    },

}
