import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {

};

const ProtectedRoute = () => {
    const isAuth = useAuth();
    return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;