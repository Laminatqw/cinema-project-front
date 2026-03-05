export interface ISession{
    id: number
    movie: number
    hall: number
    start_time:string|null
    end_time:string|null
    is_active:boolean
}