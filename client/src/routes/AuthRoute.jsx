import { Navigate, Outlet } from "react-router";
import { useAuth } from '../hooks/useAuth';

const AuthRoute = () => {
    const { isLogged, isAdmin } = useAuth();

    if (!isLogged && !isAdmin) {
        return <Navigate to="/login" replace />;
    }  

    return <Outlet />;
};

export default AuthRoute;
