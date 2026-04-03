import {createBrowserRouter} from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout";
import HomePage from "../pages/HomePage/HomePage";
import MoviesFiltPage from "../pages/MovieFilterPage/MoviesFiltPage";
import ActivationPage from "../pages/ActivationPage/ActivationPage";
import AdminPage from "../pages/AdminPage/AdminPage";
import MovieDetailPage from "../pages/MovieDetailPage/MovieDetailPage";
import MoviesPage from "../pages/MoviePage/MoviesPage";
import HallControlComponent from "../components/CreateComponent/HallControlComponent/HallControlComponent";
import MovieControlComponent from "../components/CreateComponent/MovieControlComponent/MovieControlComponent";
import AdminLayout from "../layouts/AdminLayout/adminLayout";
import GenreControlComponent from "../components/CreateComponent/GenreControlComponent/GenreControlComponent";
import SessionControlComponent from "../components/CreateComponent/SessionControlComponent/SessionControlComponent";
import SessionSeatsPage from "../pages/SessionSeatsPage/SessionSeatsPage";
import TicketDetailComponent from "../components/TicketDetailComponent/TicketDetailComponent";
import AccountPage from "../pages/AccountPage/AccountPage";
import ProtectedRouteComponent from "../components/ProtectedRouteComponent/ProtectedRouteComponent";
import AuthPage from "../pages/AuthPage/AuthPage";
import PasswordChangeComponent from "../components/PasswordChangeComponent/PasswordChangeComponent";
import PasswordRecoveryComponent from "../components/PasswordRecoveryComponent/PasswordRecoveryComponent";

export const router = createBrowserRouter([
    {
        path: '/',
        element:<MainLayout/>,
        errorElement:<h1>404 error</h1>,
        children:[
            {index:true, element:<HomePage/>},
            {path:'movies', element:<MoviesPage/>},
            {path:'movies/:id', element:<MovieDetailPage/>},
            {path:'sessions/:sessionId/seats', element:<SessionSeatsPage/>},
            {path:'filter', element:<MoviesFiltPage/>},
            {path:'register', element:<AuthPage/>},
            {path:'login', element:<AuthPage/>},
            {path:'activate/:token', element:<ActivationPage/>},
            {path:'account', element:<ProtectedRouteComponent requireAuth><AccountPage/></ProtectedRouteComponent>},
            {path:'account/tickets/:id', element:<TicketDetailComponent/>},
            {path:'/auth', element:<AuthPage/>},
            { path: 'recovery', element: <PasswordRecoveryComponent /> },
            { path: 'recovery/:token', element: <PasswordChangeComponent /> },

            {
                path: 'admin',
                element:  <ProtectedRouteComponent requireAuth requireStaff><AdminLayout /></ProtectedRouteComponent>,
                children: [
                    {index: true, element: <AdminPage/>},
                    {path: 'movies', element: <MovieControlComponent/>},
                    {path: 'halls', element: <HallControlComponent/>},
                    {path: 'genres', element: <GenreControlComponent/>},
                    {path: 'sessions', element: <SessionControlComponent/>}
                ]
            }

        ]
    }
])