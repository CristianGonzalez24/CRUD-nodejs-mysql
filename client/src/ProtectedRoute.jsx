import { Navigate, Outlet } from 'react-router';
import { useDoctors } from './hooks/useDoctors';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';

const ProtectedRoute = () => {   
    const { isAdmin, loading } = useDoctors();  

    // if (loading) return <LoadingSpinner />;
    if (!isAdmin) {
        return <Navigate to="/doctors" replace />;
    }  

    return <Outlet />;    
}

export default ProtectedRoute;