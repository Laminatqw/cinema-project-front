export interface IRegisterModel {
    "email": string,
    "password": string,
    profile: {
        name: string,
        surname: string,
        age: number
    }
}