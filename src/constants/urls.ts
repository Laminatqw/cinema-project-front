
export const baseUrl = 'http://localhost:8888/api';

export const urls = {
    users: {
        base:'/users',
        info: ()=> urls.users.base + '/info',
        me: ()=> urls.users.base + '/me',
        logout: ()=> urls.users.base + '/logout',
    },
    auth:{
        base:'/auth',
        requestPasswordRecovery:()=> urls.auth.base + '/recovery',
        changePassword:(token:string)=> urls.auth.requestPasswordRecovery + '/' + token,
        refreshToken:() => urls.auth.base + '/refresh',
        activateAccount:(token:string)=> urls.auth.base + '/activate/' + token
    },
    movies:{
        base:'/movies',
        byId:(id:number)=> urls.movies.base + '/' + id,
        addPicture:(id:number)=> urls.movies.byId(id) + '/poster',
        genres:()=> urls.movies.base + '/genres',
        genresById:(id:number) => urls.movies.genres + '/' +  id,
    },
    halls:{
        base:'/halls',
        byId:(id:number)=> urls.halls.base + '/' + id,
        seats:(id:number) => urls.halls.byId(id) + '/seats',
        seatsUpdate:(id:number) => urls.halls.seats(id) + '/update',
        seatById:(id:number)=>  urls.halls.base + '/seats/' + id
    },
    sessions:{
        base:'/sessions',
        byId:(id:number)=> urls.sessions.base + '/' + id,
        price:(sessionID:number) => urls.sessions.base + '/' +sessionID + '/prices',
        priceById:(sessionID:number, id:number) => urls.sessions.base + '/' + sessionID + '/prices/' + id,
        seats:(sessionID:number) => urls.sessions.byId(sessionID) + '/seats',

    },
    tickets:{
        base:'/tickets',
        qRCode:(ticketId:string)=> urls.tickets.base + '/' + ticketId + '/qr',
    }

}

