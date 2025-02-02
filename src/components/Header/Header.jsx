// src/components/Header/Header.js
import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="logo">
        <img src="/assets/logo.png" alt="Logo" />
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
