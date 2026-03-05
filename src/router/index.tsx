import {createBrowserRouter} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage/HomePage";
import MoviePage from "../pages/MoviePage/MoviePage";


export const router = createBrowserRouter([
    {
        path: '/',
        element:<MainLayout/>,
        errorElement:<h1>404 error</h1>,
        children:[
            {index:true, element:<HomePage/>},
            {path:'movies', element:<MoviePage/>}
        ]
    }
])