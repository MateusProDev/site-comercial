// src/pages/Home/Home.js
import React from 'react';
import Header from '../../components/Header/Header';
import Banner from '../../components/Banner/Banner';
import Boxes from '../../components/Boxes/Boxes';
import Footer from '../../components/Footer/Footer';
import './Home.css';

const Home = () => {
  return (
    <div>
      <Header />
      <Banner />
      <Boxes />
      <Footer />
    </div>
  );
};

export default Home;
