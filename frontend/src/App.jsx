import { Outlet } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import "./styles/dashboard.css";

export default function App() {
  return (
    <>
      <Header />
      <main style={{ padding: "2rem" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
