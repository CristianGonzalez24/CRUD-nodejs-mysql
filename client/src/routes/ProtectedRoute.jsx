import { Navigate, Outlet } from "react-router";
import { useDoctors } from "../hooks/useDoctors";

const ProtectedRoute = () => {
    const { isAdmin } = useDoctors();

    if (!isAdmin) {
        return <Navigate to="/doctors" replace />
    }

    return <Outlet />;
};

export default ProtectedRoute;
