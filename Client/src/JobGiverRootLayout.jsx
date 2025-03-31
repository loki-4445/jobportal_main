import GiverHeader from "./components/giverheader/GiverHeader";
import Footer from "./components/footer/Footer";
import { Outlet } from "react-router-dom";

function JobGiverRootLayout({ setUserType, userType }) {
  return (
    <div className="root-layout-container" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <GiverHeader setUserType={setUserType} userType={userType} />

      <main style={{ flex: 1 }}>
        <div style={{ marginBottom: "40px" }}>
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default JobGiverRootLayout;
