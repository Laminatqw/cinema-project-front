import { SeatType } from "./IHallSeat";

export interface ISessionSeat {
    id: number
    row: number
    number: number
    seat_type: SeatType
    is_taken: boolean
}