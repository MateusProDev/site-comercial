import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase/firebaseConfig";
import "./AdminLoja.css";

const AdminLoja = () => {
  const navigate = useNavigate();

  const goToEditLojinhaHeader = () => {
    navigate("/loja/admin/edit-lojinhaHeader"); // Rota correta
  };

  const goToBannerAdmin = () => {
    navigate("/admin/banner-admin"); // Rota correta
  };

  const goToEditProdutos = () => {
    navigate("/admin/edit-products"); // Rota correta ajustada
  };

  const goToHome = () => {
    navigate("/lojinha"); // Rota correta
  };  

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/loja/login"); // Rota correta
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="admin-loja-dashboard">
      <h2>Painel da Loja</h2>
      
      <div className="admin-loja-actions">
        <button onClick={goToEditLojinhaHeader}>Editar Cabeçalho</button>
        <button onClick={goToBannerAdmin}>Editar Banner</button>
        <button onClick={goToEditProdutos}>Editar Produtos</button>
        <button onClick={goToHome}>Voltar para a Home</button>
      </div>

      <div className="logout-section">
        <button onClick={handleLogout}>Sair</button>
      </div>
    </div>
  );
};

export default AdminLoja;