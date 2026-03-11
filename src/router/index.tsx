import {createBrowserRouter} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage/HomePage";
import MoviesFiltPage from "../pages/MoviePage/MoviesFiltPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import ActivationPage from "../pages/ActivationPage/ActivationPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import AdminPage from "../pages/AdminPage/AdminPage";
import UserAccountComponent from "../components/UserAccountComponent/UserAccountComponent";
import MovieDetailPage from "../pages/MovieDetailPage/MovieDetailPage";
import MoviesPage from "../pages/MoviePage/MoviesPage";


export const router = createBrowserRouter([
    {
        path: '/',
        element:<MainLayout/>,
        errorElement:<h1>404 error</h1>,
        children:[
            {index:true, element:<HomePage/>},
            {path:'movies', element:<MoviesPage/>},
            {path:'movies/:id', element:<MovieDetailPage/>},
            {path:'filter', element:<MoviesFiltPage/>},
            {path:'register', element:<RegisterPage/>},
            {path:'login', element:<LoginPage/>},
            {path:'activate/:token', element:<ActivationPage/>},
            {path:'admin', element:<AdminPage/>},
            {path:'account', element:<UserAccountComponent/>}
        ]
    }
])