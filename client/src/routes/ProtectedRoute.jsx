import { Navigate, Outlet } from "react-router";
import { useAuth } from '../hooks/useAuth.js';


const ProtectedRoute = () => {
    const { isAdmin } = useAuth();

    if (!isAdmin) {
        return <Navigate to="/doctors" replace />
    }

    return <Outlet />;
};

export default ProtectedRoute;
