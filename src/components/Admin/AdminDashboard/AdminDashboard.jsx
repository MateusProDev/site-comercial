import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase/firebase";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const goToEditHeader = () => {
  navigate("/admin/edit-header");
};
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/admin/login");
  };

  const goToHome = () => {
    navigate("/");
  };

  const goToEditBanner = () => {
    navigate("/admin/edit-banner");
  };

  const goToEditBoxes = () => {
    navigate("/admin/edit-boxes");
  };

  const goToEditAbout = () => {
    navigate("/admin/edit-about");
  };

  const goToEditFooter = () => {
    navigate("/admin/edit-footer");
  };

  return (
    <div className="admin-dashboard">
      <h2>Painel de Administração</h2>
      
      {/* Botões de Navegação */}
      <div className="admin-actions">
        <button onClick={goToEditHeader}>Editar Logo</button>
        <button onClick={goToEditBanner}>Editar Banner</button>
        <button onClick={goToEditBoxes}>Editar Boxes</button>
        <button onClick={goToEditAbout}>Editar Sobre</button>
        <button onClick={goToEditFooter}>Editar Rodapé</button>
        <button onClick={goToHome}>Voltar para a Home</button>
      </div>

      {/* Logout */}
      <div className="logout-section">
        <button onClick={handleLogout}>Sair</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
