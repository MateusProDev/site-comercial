import React, { useState, useEffect } from "react";
import { db, storage } from "../../../firebase/firebase"; // Certifique-se de que o caminho está correto
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const EditHeader = () => {
  const navigate = useNavigate();
  const [logoUrl, setLogoUrl] = useState("");
  const [newLogo, setNewLogo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewLogo(e.target.files[0]);
    }
  };

  const handleUploadSuccess = async (file) => {
    try {
      setUploading(true);
      setError("");

      // Criando uma referência única para o arquivo no Firebase Storage
      const storageRef = ref(storage, `logos/${newLogo.name}`);

      // Upload da imagem para o Firebase Storage
      await uploadBytes(storageRef, file);

      // Pega a URL pública da imagem após o upload
      const url = await getDownloadURL(storageRef);

      // Atualiza o Firestore com a nova URL
      const headerRef = doc(db, "content", "header");
      await setDoc(headerRef, { logoUrl: url });

      setLogoUrl(url); // Atualiza o estado para exibir a nova logo
      alert("Logo atualizada com sucesso!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Erro ao atualizar a logo:", error);
      setError("Erro ao salvar a nova logo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newLogo) {
      setError("Selecione uma imagem para continuar.");
      return;
    }
    handleUploadSuccess(newLogo);
  };

  return (
    <div className="edit-header">
      <h2>Editar Logo</h2>
      {error && <p className="error">{error}</p>}
      {logoUrl && <img src={logoUrl} alt="Logo Atual" className="logo-preview" />}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Selecione a nova logo:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <button type="submit" disabled={uploading}>
          {uploading ? "Carregando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
};

export default EditHeader;
