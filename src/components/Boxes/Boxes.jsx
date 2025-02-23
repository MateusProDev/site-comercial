import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import "./Boxes.css";

const Boxes = () => {
  const [sections, setSections] = useState([]); // Lista de seções com boxes

  // Busca as seções e boxes ao carregar o componente
  useEffect(() => {
    const boxesRef = doc(db, "content", "boxes");

    const unsubscribe = onSnapshot(boxesRef, (docSnap) => {
      if (docSnap.exists()) {
        setSections(docSnap.data().sections || []); // Atualiza o estado com as seções
      } else {
        console.log("Seções não encontradas!");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="boxes-container">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="section">
          <h2 className="section-title">{section.title}</h2>
          <div className="section-flex">
          <div className="boxes">
            {section.boxes.map((box, boxIndex) => (
              <div key={boxIndex} className="box">
                <img src={box.imageUrl} alt={box.title} />
                <h3>{box.title}</h3>
                <p>{box.content}</p>
              </div>
            ))}
          </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Boxes;