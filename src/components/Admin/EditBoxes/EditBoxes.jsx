import React, { useState, useEffect } from "react";
import { db } from "../../../firebase/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore"; // Importando onSnapshot
import { useNavigate } from "react-router-dom";

const EditBoxes = () => {
  const navigate = useNavigate();
  
  const [box1, setBox1] = useState({ title: "", content: "" });
  const [box2, setBox2] = useState({ title: "", content: "" });
  const [box3, setBox3] = useState({ title: "", content: "" });
  const [error, setError] = useState("");

  // Função para carregar os dados em tempo real
  useEffect(() => {
    const boxesRef = doc(db, "content", "boxes");

    const unsubscribe = onSnapshot(boxesRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBox1(data.box1 || { title: "", content: "" });
        setBox2(data.box2 || { title: "", content: "" });
        setBox3(data.box3 || { title: "", content: "" });
      } else {
        console.log("Boxes não encontrados!");
      }
    });

    return () => unsubscribe(); // Para remover o listener quando o componente for desmontado
  }, []); // Executa uma vez quando o componente for montado

  // Função para salvar os dados no Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const boxesRef = doc(db, "content", "boxes");
      await setDoc(boxesRef, {
        box1,
        box2,
        box3
      });
      alert("Boxes atualizados com sucesso!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Erro ao salvar os boxes:", error);
      setError("Erro ao salvar as alterações.");
    }
  };

  return (
    <div className="edit-boxes">
      <h2>Editar Boxes</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Título Box 1</label>
          <input
            type="text"
            value={box1.title}
            onChange={(e) => setBox1({ ...box1, title: e.target.value })}
            required
          />
          <label>Conteúdo Box 1</label>
          <textarea
            value={box1.content}
            onChange={(e) => setBox1({ ...box1, content: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Título Box 2</label>
          <input
            type="text"
            value={box2.title}
            onChange={(e) => setBox2({ ...box2, title: e.target.value })}
            required
          />
          <label>Conteúdo Box 2</label>
          <textarea
            value={box2.content}
            onChange={(e) => setBox2({ ...box2, content: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Título Box 3</label>
          <input
            type="text"
            value={box3.title}
            onChange={(e) => setBox3({ ...box3, title: e.target.value })}
            required
          />
          <label>Conteúdo Box 3</label>
          <textarea
            value={box3.content}
            onChange={(e) => setBox3({ ...box3, content: e.target.value })}
            required
          />
        </div>

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default EditBoxes;
