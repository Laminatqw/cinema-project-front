import {createBrowserRouter} from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout";
import HomePage from "../pages/HomePage/HomePage";
import MoviesFiltPage from "../pages/MoviePage/MoviesFiltPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import ActivationPage from "../pages/ActivationPage/ActivationPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import AdminPage from "../pages/AdminPage/AdminPage";
import UserAccountComponent from "../components/UserAccountComponent/UserAccountComponent";
import MovieDetailPage from "../pages/MovieDetailPage/MovieDetailPage";
import MoviesPage from "../pages/MoviePage/MoviesPage";
import HallControlComponent from "../components/CreateComponent/HallControlComponent/HallControlComponent";
import MovieControlComponent from "../components/CreateComponent/MovieControlComponent/MovieControlComponent";
import AdminLayout from "../layouts/AdminLayout/adminLayout";
import GenreControlComponent from "../components/CreateComponent/GenreControlComponent/GenreControlComponent";
import SessionControlComponent from "../components/CreateComponent/SessionControlComponent/SessionControlComponent";
import SessionSeatsPage from "../pages/SessionSeatsPage/SessionSeatsPage";


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
            {path:'register', element:<RegisterPage/>},
            {path:'login', element:<LoginPage/>},
            {path:'activate/:token', element:<ActivationPage/>},
            {path:'admin', element:<AdminPage/>},
            {path:'account', element:<UserAccountComponent/>},

            {
                path: 'admin',
                element: <AdminLayout/>,
                children: [
                    {index: true, element: <AdminPage/>}, // головна адмін панелі
                    {path: 'movies', element: <MovieControlComponent/>},
                    {path: 'halls', element: <HallControlComponent/>},
                    {path: 'genres', element: <GenreControlComponent/>},
                    {path: 'sessions', element: <SessionControlComponent/>}
                ]
            }

        ]
    }
])