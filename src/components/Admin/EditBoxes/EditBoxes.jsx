import React, { useState, useEffect } from "react";
import { db } from "../../../firebase/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditBoxes = () => {
  const navigate = useNavigate();
  
  const [box1, setBox1] = useState({ title: "", content: "", imageUrl: "" });
  const [box2, setBox2] = useState({ title: "", content: "", imageUrl: "" });
  const [box3, setBox3] = useState({ title: "", content: "", imageUrl: "" });
  const [image1, setImage1] = useState(null); // Imagem Box 1
  const [image2, setImage2] = useState(null); // Imagem Box 2
  const [image3, setImage3] = useState(null); // Imagem Box 3
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Função para carregar os dados em tempo real
  useEffect(() => {
    const boxesRef = doc(db, "content", "boxes");

    const unsubscribe = onSnapshot(boxesRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBox1(data.box1 || { title: "", content: "", imageUrl: "" });
        setBox2(data.box2 || { title: "", content: "", imageUrl: "" });
        setBox3(data.box3 || { title: "", content: "", imageUrl: "" });
      } else {
        console.log("Boxes não encontrados!");
      }
    });

    return () => unsubscribe();
  }, []);

  // Função para upload de imagem para o Cloudinary
  const handleImageChange = async (e, box) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "qc7tkpck"); // Seu upload preset do Cloudinary
    formData.append("cloud_name", "doeiv6m4h"); // Seu Cloud Name

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/doeiv6m4h/image/upload`,
        formData
      );
      const imageUrl = response.data.secure_url;

      if (box === 1) setBox1({ ...box1, imageUrl });
      if (box === 2) setBox2({ ...box2, imageUrl });
      if (box === 3) setBox3({ ...box3, imageUrl });

      alert("Imagem carregada com sucesso!");
    } catch (error) {
      console.error("Erro ao carregar imagem:", error);
      alert("Erro ao carregar imagem!");
    } finally {
      setLoading(false);
    }
  };

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
          <label>Imagem Box 1</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 1)}
          />
          {box1.imageUrl && <img src={box1.imageUrl} alt="Imagem Box 1" className="box-image-preview" />}
          
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
          <label>Imagem Box 2</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 2)}
          />
          {box2.imageUrl && <img src={box2.imageUrl} alt="Imagem Box 2" className="box-image-preview" />}
          
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
          <label>Imagem Box 3</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 3)}
          />
          {box3.imageUrl && <img src={box3.imageUrl} alt="Imagem Box 3" className="box-image-preview" />}
          
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

        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
};

export default EditBoxes;
