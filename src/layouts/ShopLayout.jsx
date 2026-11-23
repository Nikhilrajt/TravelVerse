
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function ShopLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-canvas text-stone-800">
            <Navbar />
            <div className="flex-1"><Outlet /></div>
            <footer className="border-t border-stone-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-center sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left">
                    <p className="font-serif text-lg font-semibold text-brand">
                        TravelVerse
                    </p>
                    <p className="text-xs text-stone-500 sm:text-sm">
                        Thoughtful essentials for the journey. © 2026 TravelVerse.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default ShopLayout;
