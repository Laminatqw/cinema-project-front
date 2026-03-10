import {createBrowserRouter} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage/HomePage";
import MoviePage from "../pages/MoviePage/MoviePage";
import MoviesFiltPage from "../pages/MoviePage/MoviesFiltPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import ActivationPage from "../pages/ActivationPage/ActivationPage";


export const router = createBrowserRouter([
    {
        path: '/',
        element:<MainLayout/>,
        errorElement:<h1>404 error</h1>,
        children:[
            {index:true, element:<HomePage/>},
            {path:'movies', element:<MoviePage/>},
            {path:'filter', element:<MoviesFiltPage/>},
            {path:'register', element:<RegisterPage/>},
            {path:'/activate/:token', element:<ActivationPage/>}
        ]
    }
])