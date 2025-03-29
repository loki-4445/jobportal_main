import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { Outlet } from "react-router-dom";

function RootLayout({ isLoggedIn, setIsLoggedIn, userType }) {
  return (
    <div className="root-layout-container" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userType={userType} />
      
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default RootLayout;