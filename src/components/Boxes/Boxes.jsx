import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { doc, onSnapshot } from 'firebase/firestore'; // Importando onSnapshot para ouvir em tempo real
import './Boxes.css'; // Importando os estilos para a página de boxes

const Boxes = () => {
  const [box1, setBox1] = useState({ title: "", content: "", imageUrl: "" });
  const [box2, setBox2] = useState({ title: "", content: "", imageUrl: "" });
  const [box3, setBox3] = useState({ title: "", content: "", imageUrl: "" });

  // Carregar dados em tempo real do Firestore
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

    // Retornar a função de unsubscribe para limpar o ouvinte quando o componente for desmontado
    return () => unsubscribe();
  }, []); // Executa uma vez quando o componente for montado

  return (
    <section className="boxes">
      {/* Box 1 */}
      <div className="box">
        {box1.imageUrl && <img src={box1.imageUrl} alt={box1.title} />}
        <h3>{box1.title || 'Produto 1'}</h3>
        <p>{box1.content || 'Descrição do produto'}</p>
      </div>

      {/* Box 2 */}
      <div className="box">
        {box2.imageUrl && <img src={box2.imageUrl} alt={box2.title} />}
        <h3>{box2.title || 'Produto 2'}</h3>
        <p>{box2.content || 'Descrição do produto'}</p>
      </div>

      {/* Box 3 */}
      <div className="box">
        {box3.imageUrl && <img src={box3.imageUrl} alt={box3.title} />}
        <h3>{box3.title || 'Produto 3'}</h3>
        <p>{box3.content || 'Descrição do produto'}</p>
      </div>
    </section>
  );
};

export default Boxes;
