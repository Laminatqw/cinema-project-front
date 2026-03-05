export type SeatType = 'regular'|'vip'|'disabled'

export interface IHallSeat{
    id:number
    hall:number
    row:number
    number:number
    seat_type: SeatType
}