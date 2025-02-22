// src/components/Footer/Footer.js
import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
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

        {/* Mapa (abaixo do menu) */}
        {footerData.contact?.address && (
          <div className="footer-map">
            <iframe
              title="Localização da Empresa"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                footerData.contact.address
              )}&output=embed`}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        )}

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
              {footerData.contact.address && (
                <p>Endereço: {footerData.contact.address}</p>
              )}
            </>
          )}
        </div>

        {/* Direitos Autorais */}
        <div className="footer-bottom">
          <p>
            &copy; {footerData.year || new Date().getFullYear()}{" "}
            {footerData.companyName || "Sua Empresa"}. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
