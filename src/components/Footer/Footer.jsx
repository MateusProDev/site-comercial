// src/components/Footer/Footer.js
import React, { useState, useEffect } from 'react';
import { db } from "../../firebase/firebase"; // Certifique-se de que o caminho está correto
import { doc, getDoc } from "firebase/firestore";
import './Footer.css';

const Footer = () => {
  const [footerText, setFooterText] = useState("");

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
  }, []); // O array vazio garante que a função seja executada apenas uma vez

  return (
    <footer>
      <p>{footerText || "Carregando..."}</p> {/* Exibe "Carregando..." até que o conteúdo seja obtido */}
    </footer>
  );
};

export default Footer;
