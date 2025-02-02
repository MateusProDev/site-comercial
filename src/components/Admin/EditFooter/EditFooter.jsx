import React, { useState, useEffect } from "react";
import { db } from "../../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const EditFooter = () => {
  const navigate = useNavigate();
  const [footerText, setFooterText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFooterData = async () => {
      const footerRef = doc(db, "content", "footer");
      const footerDoc = await getDoc(footerRef);

      if (footerDoc.exists()) {
        setFooterText(footerDoc.data().text);
      } else {
        console.log("Rodapé não encontrado!");
      }
    };

    fetchFooterData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Atualiza o conteúdo no Firestore
      const footerRef = doc(db, "content", "footer");
      await setDoc(footerRef, {
        text: footerText
      });
      alert("Texto do Rodapé atualizado com sucesso!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Erro ao atualizar o texto do rodapé:", error);
      setError("Erro ao salvar as alterações.");
    }
  };

  return (
    <div className="edit-footer">
      <h2>Editar Rodapé</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Texto do Rodapé</label>
          <textarea
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            required
          />
        </div>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default EditFooter;
