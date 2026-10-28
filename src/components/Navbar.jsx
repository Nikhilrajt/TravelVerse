import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logOut } from "../redux/slices/authSlice";

function Navbar(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    function handleLogout(){
        dispatch(logOut());
        navigate("/login")
    }
  return(
<>
    <nav>
     <Link to="/productlist">TravelVerse</Link>
     <Link to="/productlist">Products</Link>
     <Link to="/wishlist">Wishlist</Link>
     <Link to="/cart">Cart</Link>
     <Link to="/orders">Orders</Link>
    </nav>
    <button onClick={handleLogout}>Logout</button>
    </>
  )
}
export default Navbar;