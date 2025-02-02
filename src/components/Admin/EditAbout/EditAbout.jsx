// src/components/EditAbout/EditAbout.js
import React, { useState, useEffect } from "react";
import { db } from "../../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Funções Firestore
import { useNavigate } from "react-router-dom";

const EditAbout = () => {
  const navigate = useNavigate();
  const [aboutText, setAboutText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAboutData = async () => {
      const aboutRef = doc(db, "content", "about");
      const aboutDoc = await getDoc(aboutRef);

      if (aboutDoc.exists()) {
        setAboutText(aboutDoc.data().text);
      } else {
        console.log("Sobre não encontrado!");
      }
    };

    fetchAboutData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Atualiza o conteúdo no Firestore
      const aboutRef = doc(db, "content", "about");
      await setDoc(aboutRef, {
        text: aboutText
      });
      alert("Texto 'Sobre' atualizado com sucesso!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Erro ao atualizar o texto sobre:", error);
      setError("Erro ao salvar as alterações.");
    }
  };

  return (
    <div className="edit-about">
      <h2>Editar Sobre</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Texto Sobre a Empresa</label>
          <textarea
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            required
          />
        </div>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default EditAbout;
