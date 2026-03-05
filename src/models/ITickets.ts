export type Status_type = 'reserved'|'paid'|'used'

export interface ITickets{
    id: number
    uuid: string
    user: number
    session: number
    seat: number
    status: Status_type
}