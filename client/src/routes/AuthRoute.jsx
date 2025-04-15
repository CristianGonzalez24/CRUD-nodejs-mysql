import { Navigate, Outlet } from "react-router";
import { useDoctors } from "../hooks/useDoctors";

const AuthRoute = () => {
    const { isLoggedIn, isAdmin } = useDoctors();

    if (!isLoggedIn && !isAdmin) {
        return <Navigate to="/login" replace />;
    }  

    return <Outlet />;
};

export default AuthRoute;
