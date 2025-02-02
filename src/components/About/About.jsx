// src/components/About/About.js
import React, { useState, useEffect } from 'react';
import { db } from "../../firebase/firebase"; // Certifique-se de que o caminho está correto
import { doc, getDoc } from "firebase/firestore"; // Função para obter dados do Firestore
import './About.css';

const About = () => {
  const [aboutText, setAboutText] = useState("");

  useEffect(() => {
    // Carregar dados "Sobre" do Firestore
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
  }, []); // O array vazio garante que o fetch seja executado uma vez na montagem

  return (
    <section className="about">
      <h2>Sobre Nós</h2>
      {/* Exibe o texto "Sobre" dinâmicamente */}
      <p>{aboutText || "Carregando..."}</p>
    </section>
  );
};

export default About;
