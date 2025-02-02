// src/components/Boxes/Boxes.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { doc, onSnapshot } from 'firebase/firestore'; // Importando o onSnapshot para ouvir em tempo real
import './Boxes.css';

const Boxes = () => {
  const [box1, setBox1] = useState({ title: "", content: "" });
  const [box2, setBox2] = useState({ title: "", content: "" });
  const [box3, setBox3] = useState({ title: "", content: "" });

  // Carregar dados em tempo real do Firestore
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

    // Retornar a função de unsubscribe para limpar o ouvinte quando o componente for desmontado
    return () => unsubscribe();
  }, []); // Executa uma vez quando o componente for montado

  return (
    <section className="boxes">
      <div className="box">
        <h3>{box1.title || 'Produto 1'}</h3>
        <p>{box1.content || 'Descrição do produto'}</p>
      </div>
      <div className="box">
        <h3>{box2.title || 'Produto 2'}</h3>
        <p>{box2.content || 'Descrição do produto'}</p>
      </div>
      <div className="box">
        <h3>{box3.title || 'Produto 3'}</h3>
        <p>{box3.content || 'Descrição do produto'}</p>
      </div>
    </section>
  );
};

export default Boxes;
