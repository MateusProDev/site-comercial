import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { db } from '../../firebase/firebase'; // Certifique-se de que o caminho está correto
import { doc, getDoc } from 'firebase/firestore';

const Header = () => {
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    // Busca a logo atual no Firestore
    const fetchHeaderData = async () => {
      const headerRef = doc(db, 'content', 'header');
      const headerDoc = await getDoc(headerRef);

      if (headerDoc.exists()) {
        const url = headerDoc.data().logoUrl;
        console.log("URL da Logo: ", url); // Exibe a URL no console para depuração
        setLogoUrl(url); // Pega a URL da logo do Firestore
      } else {
        console.log('Nenhuma logo encontrada!');
      }
    };

    fetchHeaderData();
  }, []);

  return (
    <header>
      <div className="logo">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" />
        ) : (
          <p>Logo não disponível</p>
        )}
      </div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">Sobre</Link></li>
          <li><Link to="/admin/login">Admin</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
