import { useSelector } from "react-redux";
import { Navigate,Outlet } from "react-router-dom";

function ProtectedRoute(){
const isAuthenticated = useSelector((state)=>state.auth.isAuthenticated);
if(isAuthenticated){
    return <Outlet />
}
else{
  return <Navigate to="/login"/>
}
}
export default ProtectedRoute;