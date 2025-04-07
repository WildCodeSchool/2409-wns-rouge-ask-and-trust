import Loader from "@/components/ui/Loader";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// HOC higher order components
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading } = useAuth();

    // If the authentication state is still loading, show the loader
    if (isLoading) {
        return <Loader />
    }

    // If there is no user (not authenticated), redirect to the authentication page
    if (!user) {
        return <Navigate to="/auth" replace></Navigate>
    }

    // If user is authenticated, render the children components
    return <>{children}</>
}

export default ProtectedRoute;