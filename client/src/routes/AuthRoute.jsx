import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const AuthRoute = () => {
    const { isLogged, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="loading-overlay" role="alert" aria-busy="true">
                <LoadingSpinner size={80} color="var(--primary-color)" />
            </div>
        );
    }

    if (!isLogged) {
        const isProtectedPath = !["/", "/auth/login", "/auth/register"].includes(location.pathname);
        const state = isProtectedPath ? { from: location.pathname } : undefined;

        return <Navigate to="/auth/login" state={state} replace/>;
    }

    return <Outlet />;
};

export default AuthRoute;