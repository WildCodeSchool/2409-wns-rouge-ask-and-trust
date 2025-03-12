import { Outlet } from "react-router-dom";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";

function App() {
  return (
    <>
      <Navigation />
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
