import React from "react";
import AboutCarousel from "../../components/About/AboutCarousel";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-page">
      <Header />
      {/* Seu conteúdo existente */}

      <AboutCarousel />
      <Footer />
    </div>
  );
};

export default AboutPage;