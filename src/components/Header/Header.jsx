import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { db } from '../../firebase/firebase'; // Certifique-se de que o caminho está correto
import { doc, getDoc } from 'firebase/firestore';
import { FiMenu, FiX } from 'react-icons/fi'; // Ícones para o menu hambúrguer

const Header = () => {
  const [logoUrl, setLogoUrl] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

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
      
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      <nav className={menuOpen ? "nav-open" : ""}>
        <ul>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/about" onClick={() => setMenuOpen(false)}>Sobre</Link></li>
          <li><Link to="/admin/login" onClick={() => setMenuOpen(false)}>Admin</Link></li>
          <li><Link to="/loja/login" onClick={() => setMenuOpen(false)}>Admin Loja</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
