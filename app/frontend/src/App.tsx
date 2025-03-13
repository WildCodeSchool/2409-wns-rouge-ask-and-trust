import Header from "./components/sections/Header";
import { Outlet } from "react-router-dom";
import Footer from "@/components/sections/Footer";

function App() {
    return (
        <>
            <Header />
            <main>
                <div>
                    <Outlet />
                </div>
            </main>
            <Footer />
        </>
    );
}

export default App;