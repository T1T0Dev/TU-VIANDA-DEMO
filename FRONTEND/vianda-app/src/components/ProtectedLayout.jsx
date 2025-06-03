// src/components/ProtectedLayout.jsx
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default ProtectedLayout;
