import {Navigate,useLocation} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
export default function ProtectedRoute({children}){const {isAuthenticated,loading,ready}=useAuth();const location=useLocation();if(loading||!ready)return <div className="grid min-h-screen place-items-center bg-bg text-muted">Loading...</div>;return isAuthenticated?children:<Navigate to="/login" state={{from:location}} replace/>}
