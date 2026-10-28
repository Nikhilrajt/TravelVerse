import Register from "./pages/Register";
import Login from "./pages/Login";
import ProductList from "./components/ProductList";
import { Routes, Route, Navigate } from "react-router-dom";
import ProductLoader from "./components/ProductLoader";

function App() {
    return (
        <>
        <ProductLoader />
        <Routes>
            <Route path="/" element={<Navigate to="/register" replace />}/>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/productlist" element={<ProductList />}/>
        </Routes>
        
        </>
    );
}

export default App;