import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useCart } from "../../../context/CartContext/CartContext"; // Importe o hook
import "./ProductDetail.css";

const ProductDetail = () => {
  const { categoryIndex, productIndex } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart(); // Use o contexto

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productsRef = doc(db, "lojinha", "products");
        const productsDoc = await getDoc(productsRef);

        if (productsDoc.exists()) {
          const categories = productsDoc.data().categories || [];
          const selectedProduct = categories[categoryIndex]?.products[productIndex];

          if (selectedProduct) {
            setProduct(selectedProduct);
          } else {
            setError("Produto não encontrado.");
          }
        } else {
          setError("Dados não encontrados.");
        }
      } catch (error) {
        setError("Erro ao carregar os detalhes do produto.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [categoryIndex, productIndex]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, preco: product.price, nome: product.name }); // Normaliza os campos
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-detail">
      <h1>{product.name}</h1>
      <div className="product-detail-content">
        <img src={product.imageUrl} alt={product.name} />
        <div className="details">
          <p>{product.description}</p>
          <div className="price-info">
            <span className="anchor-price">R${product.anchorPrice.toFixed(2)}</span>
            <span className="current-price">R${product.price.toFixed(2)}</span>
            {product.discountPercentage > 0 && (
              <span className="discount">{product.discountPercentage}% OFF</span>
            )}
          </div>
          <button className="add-to-cart" onClick={handleAddToCart}>
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;