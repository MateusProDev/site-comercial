import React, { useState, useEffect } from "react";
import { db } from "../../../firebase/firebase"; // Importa o banco de dados Firestore
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Métodos do Firestore
import "./EditHome.css";

const EditHome = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      const docRef = doc(db, "content", "UVjfIc9Cv8yaZ2XubVuG");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setContent(docSnap.data().home);
      } else {
        setMessage("Erro ao carregar o conteúdo.");
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "content", "UVjfIc9Cv8yaZ2XubVuG");
      await updateDoc(docRef, {
        home: content,
        updatedAt: new Date(),
      });
      setMessage("Conteúdo atualizado com sucesso!");
    } catch (err) {
      setMessage("Erro ao atualizar o conteúdo.");
    }
  };

  return (
    <div className="edit-home">
      <h2>Editar Conteúdo da Página Inicial</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            cols="50"
            required
          ></textarea>
          <button type="submit">Salvar Alterações</button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default EditHome;
