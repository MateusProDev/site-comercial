// src/pages/Home/Home.js
import React from 'react';
import Header from '../../components/Header/Header';
import Banner from '../../components/Banner/Banner';
import Boxes from '../../components/Boxes/Boxes';
import Footer from '../../components/Footer/Footer';
import WhatsAppButton from '../../components/WhatsAppButton/WhatsAppButton';

// Importando CSS
import './Home.css';
 // Componente Home que contém Header, Banner, Boxes, Footer e o botão do WhatsApp.

const Home = () => {
  return (
    <div>
      <Header />
      <Banner />
      <Boxes />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Home;
