import React, { useState, useEffect } from "react";
import { db } from "../../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './EditBanner.css';  // Adicione o CSS para a página de edição

const EditBanner = () => {
  const navigate = useNavigate();
  const [bannerText, setBannerText] = useState("");
  const [bannerDescription, setBannerDescription] = useState(""); // Nova variável para descrição
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [newBannerImageUrl, setNewBannerImageUrl] = useState(""); // URL da nova imagem
  const [image, setImage] = useState(null); // Armazena a imagem selecionada
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(""); // Mensagem de sucesso

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

  // Função de upload para o Cloudinary
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Por favor, selecione uma imagem!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(""); // Limpar a mensagem de sucesso ao iniciar o processo

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "qc7tkpck"); // Seu upload preset do Cloudinary
    formData.append("cloud_name", "doeiv6m4h"); // Seu Cloud Name

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/doeiv6m4h/image/upload`, // Usando seu Cloud Name
        formData
      );

      const imageUrl = response.data.secure_url;
      setNewBannerImageUrl(imageUrl); // Atualiza a URL da imagem no estado
      alert("Imagem enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      alert("Erro ao enviar imagem!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newBannerImageUrl && !bannerImageUrl) {
      setError("Por favor, carregue uma imagem.");
      return;
    }

    try {
      const bannerRef = doc(db, "content", "banner");
      await setDoc(bannerRef, {
        text: bannerText,
        description: bannerDescription,
        imageUrl: newBannerImageUrl || bannerImageUrl // Usa a nova imagem ou mantém a antiga
      });

      setSuccess("Banner atualizado com sucesso!");
      setTimeout(() => navigate("/admin/dashboard"), 2000); // Redireciona após 2 segundos
    } catch (error) {
      console.error("Erro ao atualizar o banner:", error);
      setError("Erro ao salvar as alterações.");
    }
  };

  return (
    <div className="edit-banner">
      <h2>Editar Banner</h2>

      {/* Exibe a mensagem de erro, se houver */}
      {error && <p className="error">{error}</p>}

      {/* Exibe a mensagem de sucesso, se houver */}
      {success && <p className="success">{success}</p>}

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
          <label>Descrição do Banner</label>
          <textarea
            value={bannerDescription}
            onChange={(e) => setBannerDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Imagem do Banner</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <button type="button" onClick={handleUpload} disabled={loading}>
            {loading ? "Enviando..." : "Enviar Imagem"}
          </button>
        </div>

        {/* Exibe a pré-visualização da imagem, se houver */}
        {newBannerImageUrl && (
          <div>
            <h4>Pré-visualização:</h4>
            <img src={newBannerImageUrl} alt="Pré-visualização" className="banner-preview" />
          </div>
        )}

        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Banner"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBanner;
