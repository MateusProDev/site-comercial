import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./About.css";

const About = () => {
  const [aboutText, setAboutText] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const aboutRef = doc(db, "content", "about");
        const aboutDoc = await getDoc(aboutRef);

        if (aboutDoc.exists()) {
          setAboutText(aboutDoc.data().text);
        } else {
          console.log("Documento 'about' não encontrado!");
          setAboutText("Conteúdo não disponível.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do Firestore:", error);
        setAboutText("Erro ao carregar informações.");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <section className="about">
      <h2>Sobre Nós</h2>
      {loading ? <p>Carregando...</p> : <p>{aboutText}</p>}
    </section>
  );
};

export default About;
