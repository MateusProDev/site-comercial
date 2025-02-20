import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import AboutPage from "./pages/AboutPage/AboutPage";
import AdminLogin from "./components/Admin/AdminLogin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard/AdminDashboard";
import EditBanner from "./components/Admin/EditBanner/EditBanner";
import EditBoxes from "./components/Admin/EditBoxes/EditBoxes";
import EditAbout from "./components/Admin/EditAbout/EditAbout";
import EditFooter from "./components/Admin/EditFooter/EditFooter";
import EditHeader from "./components/Admin/EditHeader/EditHeader";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/edit-header" element={<EditHeader />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/edit-banner" element={<EditBanner />} />
        <Route path="/admin/edit-boxes" element={<EditBoxes />} />
        <Route path="/admin/edit-about" element={<EditAbout />} />
        <Route path="/admin/edit-footer" element={<EditFooter />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
