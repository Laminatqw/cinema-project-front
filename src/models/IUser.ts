export interface IUser{
    id: number
    email: string
    is_active: boolean
    is_staff: boolean
    is_superuser:true
    profile?: IProfile
    created_at: string
}
export interface IProfile{
    id: number
    name: string
    surname?: string
    age: number | null
    user: number
}