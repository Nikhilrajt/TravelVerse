
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function ShopLayout() {
    return (
        <div className="min-h-screen bg-stone-50 text-stone-800">
            <Navbar />
            <Outlet />
        </div>
    );
}

export default ShopLayout;