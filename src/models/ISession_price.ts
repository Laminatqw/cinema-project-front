import {SeatType} from "./IHallSeat";

export interface ISession_price{
    id:number
    session: number
    seat_type: SeatType
    price: number
}
