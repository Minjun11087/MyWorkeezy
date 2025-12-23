import {Navigate} from "react-router-dom";
import {useAuthContext} from "../../auth/AuthContext";

export default function PrivateRoute({children}) {
    const {isAuthenticated, loading} = useAuthContext();

    if (loading) return null;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    return children;
}