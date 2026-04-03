import React, {JSX} from 'react';
import {useAppSelector} from "../../redux/store";
import {Navigate} from "react-router-dom";


interface IProps {
    children: JSX.Element
    requireAuth?: boolean
    requireStaff?: boolean
}

const ProtectedRouteComponent = ({ children, requireAuth = false, requireStaff = false }: IProps) => {
    const user = useAppSelector(state => state.userStore.user);
    const isInitialized = useAppSelector(state => state.userStore.isInitialized);

    if (!isInitialized) return null;

    if (requireAuth && !user) {
        return <Navigate to="/login" replace />;
    }

    if (requireStaff && !user?.is_staff) {
        return <Navigate to="/" replace />;
    }

    return children;
};


export default ProtectedRouteComponent;