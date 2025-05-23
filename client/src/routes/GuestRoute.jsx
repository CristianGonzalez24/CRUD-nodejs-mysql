import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const GuestRoute = () => {
    const { isLogged, isLoading } = useAuth();
    const location = useLocation();
    const from = location.state?.from || '/';

    if (isLoading) return (
        <div className="loading-overlay" role="alert" aria-busy="true">
            <LoadingSpinner size={80} color="var(--primary-color)" />
        </div>
    );

    if (isLogged) {
        // return <Navigate to="/" replace />;
        return <Navigate to={from} replace />;
    }

    return <Outlet />;
};

export default GuestRoute;