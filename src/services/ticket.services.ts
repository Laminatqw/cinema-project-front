import axios from "axios";
import {baseUrl, urls} from "../constants/urls";
import {ITickets} from "../models/ITickets";

let axiosInstance = axios.create({
    baseURL:baseUrl
})

export const ticketServices = {
    getTicket: async (): Promise<ITickets[]> => {
        let response = await axiosInstance.get<ITickets[]>(urls.tickets.base);
        return response.data;
    },
    createTicket: async (payload: Partial<ITickets>): Promise<ITickets> => {
        let response = await axiosInstance.post<ITickets>(urls.tickets.base, payload);
        return response.data;
    },
    getQrCode: async (ticketToken: string): Promise<Blob> => {
        const { data } = await axiosInstance.get(urls.tickets.qRCode(ticketToken), { responseType: 'blob' });

        return data;
    }
}