import axios from "axios";
import {baseUrl, urls} from "../constants/urls";
import {IHall} from "../models/IHall";
import {IHallSeat} from "../models/IHallSeat";

let axiosInstance = axios.create({
    baseURL:baseUrl
})

export const hallServices = {
    getAll: async (): Promise<IHall[]> => {
        let response = await axiosInstance.get<IHall[]>(urls.halls.base);
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
    getAllSeats: async (hallId:number): Promise<IHallSeat[]> => {
        let response = await axiosInstance.get<IHallSeat[]>(urls.halls.seats(hallId));
        return response.data;
    },
    getSeatById: async (id: number): Promise<IHallSeat> => {
        let response = await axiosInstance.get<IHallSeat>(urls.halls.byId(id));
        return response.data;
    },
    createSeats: async (hallId: number, payload: Partial<IHallSeat> | Partial<IHallSeat>[]): Promise<IHallSeat[]> => {
        let response = await axiosInstance.post<IHallSeat[]>(urls.halls.seats(hallId), payload);
        return response.data;
    },
    deleteSeat: async (seatId: number): Promise<IHallSeat> => {
        let response = await axiosInstance.get<IHallSeat>(urls.halls.seatById(seatId));
        return response.data;
    },
    updateSeat: async (seatId: number, payload: Partial<IHallSeat>): Promise<IHallSeat> => {
        let response = await axiosInstance.patch<IHallSeat>(urls.halls.seatById(seatId), payload);
        return response.data;
    }

}
