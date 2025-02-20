// src/components/Footer/Footer.js
import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase"; // Verifique o caminho
import { doc, getDoc } from "firebase/firestore";
import "./Footer.css";

const Footer = () => {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const footerRef = doc(db, "content", "footer");
        const footerDoc = await getDoc(footerRef);
        if (footerDoc.exists()) {
          console.log("Dados do rodapé:", footerDoc.data());
          setFooterData(footerDoc.data());
        } else {
          console.log("Rodapé não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar rodapé:", error);
      }
    };

    fetchFooterData();
  }, []);

  if (!footerData) return <p>Carregando...</p>;

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo da Empresa */}
        {footerData.logo ? (
          <div className="footer-logo">
            <img src={footerData.logo} alt="Logo da Empresa" />
          </div>
        ) : (
          <p className="fallback">Logo não configurada.</p>
        )}

        {/* Texto Principal */}
        <div className="footer-text">
          <p>{footerData.text}</p>
        </div>

        {/* Redes Sociais */}
        <div className="footer-social">
          {footerData.social &&
            Object.keys(footerData.social).map((key) => {
              const network = footerData.social[key];
              if (network.logo && network.link) {
                return (
                  <a
                    key={key}
                    href={network.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={network.logo}
                      alt={network.title || key}
                      className="social-icon"
                    />
                  </a>
                );
              } else {
                return null;
              }
            })}
        </div>

        {/* Menu de Navegação */}
        <div className="footer-menu">
          {footerData.menu &&
            Object.keys(footerData.menu).map((key) => {
              const link = footerData.menu[key];
              return link ? (
                <a key={key} href={link}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </a>
              ) : null;
            })}
        </div>

        {/* Informações de Contato */}
        <div className="footer-contact">
          {footerData.contact && (
            <>
              {footerData.contact.phone && (
                <p>Telefone: {footerData.contact.phone}</p>
              )}
              {footerData.contact.email && (
                <p>Email: {footerData.contact.email}</p>
              )}
            </>
          )}
        </div>

        {/* Direitos Autorais */}
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Sua Empresa. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
