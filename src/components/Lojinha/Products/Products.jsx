import React, { useState, useEffect } from "react";
import { db } from "../../../firebase/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext/CartContext"; // Importe o hook
import "./Products.css";

const Products = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Use o contexto

  useEffect(() => {
    const productsRef = doc(db, "lojinha", "products");

    const unsubscribe = onSnapshot(productsRef, (docSnap) => {
      if (docSnap.exists()) {
        setCategories(docSnap.data().categories || []);
      } else {
        console.log("Categorias não encontradas!");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleProductClick = (categoryIndex, productIndex) => {
    navigate(`/produto/${categoryIndex}/${productIndex}`);
  };

  const handleAddToCart = (product) => {
    addToCart({ ...product, preco: product.price, nome: product.name }); // Normaliza os campos
  };

  return (
    <div className="products-container">
      {categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="category-section">
          <h2 className="category-title">{category.title}</h2>
          <div className="category-products">
            {category.products.map((product, productIndex) => (
              <div
                key={productIndex}
                className="product-box"
                onClick={() => handleProductClick(categoryIndex, productIndex)}
              >
                <div className="discount-tag">
                  {product.discountPercentage > 0 && `${product.discountPercentage}% OFF`}
                </div>
                <img src={product.imageUrl} alt={product.name} />
                <h3>{product.name}</h3>
                <div className="price-info">
                  <span className="anchor-price">R${product.anchorPrice.toFixed(2)}</span>
                  <span className="current-price">R${product.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Impede o clique de redirecionar
                    handleAddToCart(product);
                  }}
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;