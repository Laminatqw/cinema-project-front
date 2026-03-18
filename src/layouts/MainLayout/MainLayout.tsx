import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import {Outlet} from "react-router-dom";
import {useEffect} from "react";
import {userActions} from "../../redux/slices/userSlice";
import {useAppDispatch} from "../../redux/store";

const MainLayout = () => {



    return (
        <div>
            <HeaderComponent/>
            <Outlet/>
        </div>
    );
};

export default MainLayout;