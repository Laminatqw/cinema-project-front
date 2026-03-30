export interface IMovieFilter {
    page?: number
    size?:number
    name?: string
    genre?: number[]
    rating__gte?: number
    rating__lte?: number
    length__gte?: number
    length__lte?: number
    year__exact?: number
    year__gte?: number
    year__lte?: number
    is_now_showing?: 'yes' | 'no'

}