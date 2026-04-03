import {baseUrl, urls} from "../constants/urls";
import {ITickets} from "../models/ITickets";
import { axiosInstance } from "../helpers/axiosInstance";
import { ITicketDetail } from "../models/ITicketDetail";


export const ticketServices = {
    getTicket: async (): Promise<ITicketDetail[]> => {
        let response = await axiosInstance.get<{data: ITicketDetail[]}>(urls.tickets.base);
        return response.data.data;
    },
    createTicket: async (payload: Partial<ITickets> | Partial<ITickets>[]): Promise<ITickets | {created: number}> => {
        try {
            let response = await axiosInstance.post(urls.tickets.base, payload);
            return response.data;
        } catch (e: any) {
            console.log(e.response.data);
            throw e;
        }
    },
    getTicketById: async (id: number): Promise<ITicketDetail> => {
        try{
            let response = await axiosInstance.get<ITicketDetail>(urls.tickets.byId(id));
            return response.data;
        } catch (e:any){
            console.log(e.response.data);
            throw e;
        }
    },
    getQrCode: async (ticketToken: string): Promise<Blob> => {
        const { data } = await axiosInstance.get(urls.tickets.qRCode(ticketToken), { responseType: 'blob' });
        return data;
    }
}