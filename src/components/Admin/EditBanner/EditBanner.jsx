import React, { useState, useEffect } from "react";
import { db } from "../../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import './EditBanner.css';  // Adicione o CSS para a página de edição

const EditBanner = () => {
  const navigate = useNavigate();
  const [bannerText, setBannerText] = useState("");
  const [bannerDescription, setBannerDescription] = useState(""); // Nova variável para descrição
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBannerData = async () => {
      const bannerRef = doc(db, "content", "banner");
      const bannerDoc = await getDoc(bannerRef);

      if (bannerDoc.exists()) {
        setBannerText(bannerDoc.data().text);
        setBannerDescription(bannerDoc.data().description); // Recuperar a descrição do Firestore
        setBannerImageUrl(bannerDoc.data().imageUrl);
      } else {
        console.log("Banner não encontrado!");
      }
    };

    fetchBannerData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const bannerRef = doc(db, "content", "banner");
      await setDoc(bannerRef, {
        text: bannerText,
        description: bannerDescription, // Enviar a descrição para o Firestore
        imageUrl: bannerImageUrl
      });
      alert("Banner atualizado com sucesso!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Erro ao atualizar o banner:", error);
      setError("Erro ao salvar as alterações.");
    }
  };

  return (
    <div className="edit-banner">
      <h2>Editar Banner</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Texto do Banner</label>
          <input
            type="text"
            value={bannerText}
            onChange={(e) => setBannerText(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descrição do Banner</label> {/* Novo campo para Descrição */}
          <textarea
            value={bannerDescription}
            onChange={(e) => setBannerDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>URL da Imagem</label>
          <input
            type="text"
            value={bannerImageUrl}
            onChange={(e) => setBannerImageUrl(e.target.value)}
            required
          />
        </div>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default EditBanner;
