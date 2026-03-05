
import {movieServices} from "./movie.services";
import {authServices} from "./auth.services";
import {userServices} from "./user.services";
import {hallServices} from "./hall.services";
import {sessionServices} from "./session.services";
import {ticketServices} from "./ticket.services";

export const api = {
    movie:movieServices,
    auth:authServices,
    user:userServices,
    hall:hallServices,
    session:sessionServices,
    ticket:ticketServices
}


