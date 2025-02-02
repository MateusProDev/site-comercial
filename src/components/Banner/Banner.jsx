import React, { useState, useEffect } from 'react';
import { db } from "../../firebase/firebase";
import { doc, getDoc } from 'firebase/firestore';
import './Banner.css';

const Banner = () => {
  const [bannerText, setBannerText] = useState("");
  const [bannerDescription, setBannerDescription] = useState(""); // Variável para a descrição
  const [bannerImageUrl, setBannerImageUrl] = useState("");

  useEffect(() => {
    const fetchBannerData = async () => {
      const bannerRef = doc(db, "content", "banner");
      const bannerDoc = await getDoc(bannerRef);

      if (bannerDoc.exists()) {
        setBannerText(bannerDoc.data().text);
        setBannerDescription(bannerDoc.data().description); // Receber a descrição
        setBannerImageUrl(bannerDoc.data().imageUrl);
      } else {
        console.log("Banner não encontrado!");
      }
    };

    fetchBannerData();
  }, []);

  return (
    <section className="banner">
      <h1>{bannerText || "Bem-vindo ao nosso site!"}</h1>
      <p>{bannerDescription || "Encontre os melhores produtos aqui"}</p> {/* Exibir descrição */}
      {bannerImageUrl && <img src={bannerImageUrl} alt="Banner" />}
    </section>
  );
};

export default Banner;
