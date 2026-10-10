import {Navigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
export default function AdminRoute({children}){const{user,isAuthenticated,ready}=useAuth();if(!ready)return <div className="grid min-h-screen place-items-center bg-bg text-muted">Loading...</div>;if(!isAuthenticated)return <Navigate to="/login" replace/>;return user?.role==="admin"?children:<Navigate to="/dashboard" replace/>}
