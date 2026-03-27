export type Status_type = 'reserved'|'paid'|'used'|'canceled';


export interface ITicketDetail {
    id: number
    uuid: string
    status: Status_type
    hall: string
    row: number
    number: number
    seat_type: string
    movie: string
    start_time: string
    qr_code_url: string
}