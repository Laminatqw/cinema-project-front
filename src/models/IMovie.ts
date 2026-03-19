import {IGenre} from "./IGenre";

export interface IMovie{
    id: number
    name: string
    length:number
    picture: string|null
    trailer_link:string
    rating:number
    genres: number[]          // для запису
    genres_detail: IGenre[]
    year:number
    release_date: string|null
    end_date:string|null
    is_now_showing: boolean
}