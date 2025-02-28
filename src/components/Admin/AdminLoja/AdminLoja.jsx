import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase/firebaseConfig";
import "./AdminLoja.css";

const AdminLoja = () => {
  const navigate = useNavigate();

  const goToEditLojinhaHeader = () => {
    navigate("/loja/admin/edit-lojinhaHeader");
  };

  const goToBannerAdmin = () => {
    navigate("/admin/banner-admin");
  };

  const goToEditDestaques = () => {
    navigate("/admin/edit-destaques");
  };

  const goToEditProdutos = () => {
    navigate("/admin/edit-produtos");
  };

  const goToEditCategorias = () => {
    navigate("/admin/edit-categorias");
  };

  const goToHome = () => {
    navigate("/lojinha");
  };  

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/loja/login");
  };

  return (
    <div className="admin-loja-dashboard">
      <h2>Painel da Loja</h2>
      
      <div className="admin-loja-actions">
        <button onClick={goToEditLojinhaHeader}>Editar Cabeçalho</button>
        <button onClick={goToBannerAdmin}>Editar Banner</button>
        <button onClick={goToEditDestaques}>Editar Destaques</button>
        <button onClick={goToEditProdutos}>Editar Produtos</button>
        <button onClick={goToEditCategorias}>Editar Categorias</button>
        <button onClick={goToHome}>Voltar para a Home</button>
      </div>

      <div className="logout-section">
        <button onClick={handleLogout}>Sair</button>
      </div>
    </div>
  );
};

export default AdminLoja;
