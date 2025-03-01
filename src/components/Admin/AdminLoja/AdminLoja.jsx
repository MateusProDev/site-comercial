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

  const goToEditDestaques = () => {
    // Placeholder: ainda não existe no App.jsx
    navigate("/admin/edit-destaques"); 
    // Se quiser desativar até criar: alert("Rota de editar destaques ainda não implementada.");
  };

  const goToEditProdutos = () => {
    navigate("/admin/edit-products"); // Rota correta ajustada
  };

  const goToEditCategorias = () => {
    // Placeholder: ainda não existe no App.jsx
    navigate("/admin/edit-categorias");
    // Se quiser desativar até criar: alert("Rota de editar categorias ainda não implementada.");
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