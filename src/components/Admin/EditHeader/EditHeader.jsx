import React, { useState, useEffect } from "react";
import { db, storage } from "../../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./EditHeader.css";

const EditHeader = () => {
  const navigate = useNavigate();
  const [logoUrl, setLogoUrl] = useState("");
  const [newLogo, setNewLogo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHeaderData = async () => {
      const headerRef = doc(db, "content", "header");
      const headerDoc = await getDoc(headerRef);

      if (headerDoc.exists()) {
        setLogoUrl(headerDoc.data().logoUrl);
      } else {
        console.log("Logo não encontrada!");
      }
    };

    fetchHeaderData();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setNewLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = logoUrl;
      if (newLogo) {
        const storageRef = ref(storage, `logos/${newLogo.name}`);
        await uploadBytes(storageRef, newLogo);
        imageUrl = await getDownloadURL(storageRef);
      }

      const headerRef = doc(db, "content", "header");
      await setDoc(headerRef, {
        logoUrl: imageUrl,
      });

      alert("Logo atualizada com sucesso!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Erro ao atualizar a logo:", error);
      setError("Erro ao salvar as alterações.");
    }
  };

  return (
    <div className="edit-header">
      <h2>Editar Logo</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="preview">
          {logoUrl && <img src={logoUrl} alt="Logo Atual" className="logo-preview" />}
        </div>
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default EditHeader;
