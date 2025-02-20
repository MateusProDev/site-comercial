import React, { useState, useEffect } from "react";
import { db } from "../../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const EditAbout = () => {
  const navigate = useNavigate();
  const [aboutText, setAboutText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const aboutRef = doc(db, "content", "about");
        const aboutDoc = await getDoc(aboutRef);

        if (aboutDoc.exists()) {
          setAboutText(aboutDoc.data().text);
        } else {
          console.log("Documento 'about' não encontrado!");
          setAboutText(""); // Mantém o campo vazio para permitir edição
        }
      } catch (error) {
        console.error("Erro ao buscar dados do Firestore:", error);
        setError("Erro ao carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const aboutRef = doc(db, "content", "about");
      await setDoc(aboutRef, { text: aboutText }, { merge: true });
      alert("Texto atualizado com sucesso!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      setError("Erro ao salvar as alterações.");
    }
  };

  return (
    <div className="edit-about">
      <h2>Editar Sobre</h2>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Carregando...</p>
      ) : (
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
      )}
    </div>
  );
};

export default EditAbout;
