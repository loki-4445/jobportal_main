import SeekerHeader from "./components/seekerheader/SeekerHeader";
import Footer from "./components/footer/Footer";
import { Outlet } from "react-router-dom";

function JobSeekerRootLayout({setUserType,userType}) {
  return (
    <div className="root-layout-container" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SeekerHeader setUserType={setUserType} userType={userType}/>
      
      <main style={{ flex: 1 }}>
      <div style={{ marginBottom: "40px" }}>
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default JobSeekerRootLayout;