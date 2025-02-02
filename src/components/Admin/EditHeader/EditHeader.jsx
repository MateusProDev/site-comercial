import React, { useState, useEffect } from "react";
import { db } from "../../../firebase/firebase"; // Certifique-se de que o caminho está correto
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import './EditHeader.css'; 

const EditHeader = () => {
  const navigate = useNavigate();
  const [logoUrl, setLogoUrl] = useState("");
  const [newLogoUrl, setNewLogoUrl] = useState(""); // URL da imagem
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(""); // Nova variável para mensagem de sucesso

  useEffect(() => {
    // Busca a logo atual no Firestore
    const fetchHeaderData = async () => {
      const headerRef = doc(db, "content", "header");
      const headerDoc = await getDoc(headerRef);

      if (headerDoc.exists()) {
        setLogoUrl(headerDoc.data().logoUrl);
      } else {
        console.log("Nenhuma logo encontrada!");
      }
    };

    fetchHeaderData();
  }, []);

  // Função de validação mais robusta para verificar se a URL é uma imagem válida
  const validateUrl = (url) => {
    const regex = /^(https?:\/\/)(.*\.(?:jpg|jpeg|png|gif))$/i;
    return regex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newLogoUrl) {
      setError("Informe a URL da imagem.");
      return;
    }

    if (!validateUrl(newLogoUrl)) {
      setError("A URL fornecida não é válida. Certifique-se de que é um link de imagem.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(""); // Limpar a mensagem de sucesso ao iniciar o processo

    try {
      // Atualiza o Firestore com a nova URL da logo
      const headerRef = doc(db, "content", "header");
      await setDoc(headerRef, { logoUrl: newLogoUrl });

      setLogoUrl(newLogoUrl); // Atualiza o estado para exibir a nova logo
      setSuccess("Logo atualizada com sucesso!"); // Mensagem de sucesso
      setNewLogoUrl(""); // Limpa o campo de input
      setTimeout(() => navigate("/admin/dashboard"), 2000); // Redireciona após 2 segundos
    } catch (error) {
      console.error("Erro ao atualizar a logo:", error);
      setError("Erro ao salvar a nova logo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-header">
      <h2>Editar Logo</h2>

      {/* Exibe a mensagem de erro, se houver */}
      {error && <p className="error">{error}</p>}

      {/* Exibe a imagem atual da logo */}
      {logoUrl && <img src={logoUrl} alt="Logo Atual" className="logo-preview" />}

      {/* Exibe a mensagem de sucesso, se houver */}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Informe a URL da nova logo:</label>
          <input
            type="text"
            placeholder="Cole a URL da imagem"
            value={newLogoUrl}
            onChange={(e) => setNewLogoUrl(e.target.value)}
          />
        </div>

        {/* Exibe a imagem de preview, caso a URL seja válida */}
        {newLogoUrl && validateUrl(newLogoUrl) && (
          <div>
            <h4>Pré-visualização:</h4>
            <img src={newLogoUrl} alt="Pré-visualização" className="logo-preview" />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </form>

      <div className="info-converter">
        <p>
          Para alterar a logo, você precisa fornecer a URL de uma imagem válida.
          Se você não tem uma URL, use um <a href="https://freeimage.host/">Conversor de Imagem para URL</a>.
        </p>
      </div>
    </div>
  );
};

export default EditHeader;
