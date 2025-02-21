import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import './Boxes.css';

// Imagem padrão para os boxes
const defaultImage = "https://via.placeholder.com/400x300?text=Imagem+Padr%C3%A3o";

const Boxes = () => {
  const [box1, setBox1] = useState({ title: "", content: "", imageUrl: "" });
  const [box2, setBox2] = useState({ title: "", content: "", imageUrl: "" });
  const [box3, setBox3] = useState({ title: "", content: "", imageUrl: "" });

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

  return (
    <section className="boxes">
      {/* Box 1 */}
      <div className="box">
        <img src={box1.imageUrl || defaultImage} alt={box1.title || "Imagem padrão"} />
        <h3>{box1.title || 'Produto 1'}</h3>
        <p>{box1.content || 'Descrição do produto'}</p>
      </div>

      {/* Box 2 */}
      <div className="box">
        <img src={box2.imageUrl || defaultImage} alt={box2.title || "Imagem padrão"} />
        <h3>{box2.title || 'Produto 2'}</h3>
        <p>{box2.content || 'Descrição do produto'}</p>
      </div>

      {/* Box 3 */}
      <div className="box">
        <img src={box3.imageUrl || defaultImage} alt={box3.title || "Imagem padrão"} />
        <h3>{box3.title || 'Produto 3'}</h3>
        <p>{box3.content || 'Descrição do produto'}</p>
      </div>
    </section>
  );
};

export default Boxes;
