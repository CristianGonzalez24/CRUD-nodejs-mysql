import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from '../hooks/useAuth.js';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const ProtectedRoute = () => {
    const { isAdmin, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) return (
        <div className="loading-overlay" role="alert" aria-busy="true">
            <LoadingSpinner size={80} color="var(--primary-color)" />
        </div>
    );

    if (!isAdmin) return (
        <Navigate to="/doctors" state={{ from: location.pathname }} replace/>
    );

    return <Outlet />;
};

export default ProtectedRoute;