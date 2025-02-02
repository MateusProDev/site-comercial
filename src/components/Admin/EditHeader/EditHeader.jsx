import React, { useState, useEffect } from "react";
import { db } from "../../../firebase/firebase"; // Certifique-se de que o caminho está correto
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const EditHeader = () => {
  const navigate = useNavigate();
  const [logoUrl, setLogoUrl] = useState("");
  const [newLogoUrl, setNewLogoUrl] = useState(""); // URL da imagem
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  // Função de validação simples para verificar se a URL é uma imagem
  const validateUrl = (url) => {
    const regex = /\.(jpg|jpeg|png|gif)$/i;
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

    try {
      // Atualiza o Firestore com a nova URL da logo
      const headerRef = doc(db, "content", "header");
      await setDoc(headerRef, { logoUrl: newLogoUrl });

      setLogoUrl(newLogoUrl); // Atualiza o estado para exibir a nova logo
      alert("Logo atualizada com sucesso!");
      navigate("/admin/dashboard");
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
      {error && <p className="error">{error}</p>}
      {logoUrl && <img src={logoUrl} alt="Logo Atual" className="logo-preview" />}

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
        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </form>

      <div className="info-converter">
        <p>
          Para alterar a logo, você precisa fornecer a URL de uma imagem válida.
          Se você não tem uma URL, use um <a href="https://postimages.org/">Conversor de Imagem para URL</a>.
        </p>
      </div>
    </div>
  );
};

export default EditHeader;
