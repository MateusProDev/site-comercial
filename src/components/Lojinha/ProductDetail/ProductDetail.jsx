import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaShareAlt } from "react-icons/fa";
import { db, auth } from "../../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { useCart } from "../../../context/CartContext/CartContext";
import "./ProductDetail.css";

const RegisterModal = ({ onClose, onRegister, rating, comment }) => {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !whatsapp) {
      setError("Por favor, preencha nome e WhatsApp.");
      return;
    }

    try {
      const userDoc = await addDoc(collection(db, "users"), {
        name,
        whatsapp,
        timestamp: new Date().toISOString(),
      });
      setSuccess("Cadastro realizado com sucesso!");
      setTimeout(() => {
        setSuccess("");
        onRegister({ id: userDoc.id, name, whatsapp }, rating, comment); // Passa o usuário e os dados do comentário
        onClose();
      }, 2000);
    } catch (err) {
      setError("Erro ao cadastrar. Tente novamente.");
      console.error(err);
    }
  };

  return (
    <div className="register-modal-overlay">
      <div className="register-modal">
        <h2>Cadastre-se para Comentar</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="tel"
            placeholder="WhatsApp (ex: 5585991470709)"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
          <button type="submit">Cadastrar e Comentar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { categoryKey, productKey } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { addToCart } = useCart();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const firestoreCategoryKey = categoryKey.replace(/-/g, " ");
        const firestoreProductKey = productKey.replace(/-/g, " ");
        const productDetailRef = doc(db, "lojinha", `product-details-${firestoreCategoryKey}-${firestoreProductKey}`);
        const productDoc = await getDoc(productDetailRef);

        if (productDoc.exists()) {
          const data = productDoc.data();
          setProduct(data);
          if (data.variants && data.variants.length > 0) {
            setSelectedVariant(data.variants[0]);
          }
        } else {
          const productsRef = doc(db, "lojinha", "produtos");
          const productsDoc = await getDoc(productsRef);
          if (productsDoc.exists()) {
            const categories = productsDoc.data().categories || {};
            const productData = categories[firestoreCategoryKey]?.products[firestoreProductKey];
            if (productData) {
              setProduct({ name: firestoreProductKey, ...productData });
              if (productData.variants && productData.variants.length > 0) {
                setSelectedVariant(productData.variants[0]);
              }
            } else {
              setError("Produto não encontrado.");
            }
          } else {
            setError("Documento 'produtos' não encontrado.");
          }
        }
      } catch (error) {
        setError("Erro ao carregar os detalhes do produto.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [categoryKey, productKey]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product) {
      const itemToAdd = {
        ...product,
        preco: product.price || 0,
        nome: product.name,
        variant: selectedVariant,
      };
      addToCart(itemToAdd);
      setSuccess("Produto adicionado ao carrinho!");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError("Produto não disponível para adicionar ao carrinho.");
    }
  };

  const handleRatingSubmit = async () => {
    if (!rating || !comment) {
      setError("Por favor, selecione uma pontuação e adicione um comentário.");
      return;
    }

    if (!auth.currentUser) {
      // Sempre abre o modal para usuários não autenticados
      setRegisterModalOpen(true);
      return;
    }

    // Apenas usuários autenticados chegam aqui
    const userId = auth.currentUser.uid;
    const userName = auth.currentUser.displayName || "Usuário Autenticado";

    const newRating = {
      userId,
      userName,
      stars: rating,
      comment,
      timestamp: new Date().toISOString(),
    };

    try {
      const firestoreCategoryKey = categoryKey.replace(/-/g, " ");
      const firestoreProductKey = productKey.replace(/-/g, " ");
      const productDetailRef = doc(db, "lojinha", `product-details-${firestoreCategoryKey}-${firestoreProductKey}`);
      const productDoc = await getDoc(productDetailRef);
      const currentRatings = productDoc.exists() && productDoc.data().ratings ? productDoc.data().ratings : [];
      const updatedRatings = [...currentRatings, newRating];

      await updateDoc(productDetailRef, { ratings: updatedRatings }, { merge: true });
      setProduct((prev) => ({ ...prev, ratings: updatedRatings }));
      setRating(0);
      setComment("");
      setSuccess("Avaliação enviada com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Erro ao enviar avaliação.");
      console.error(error);
    }
  };

  const handleShareLink = () => {
    const link = `${window.location.origin}/produto/${categoryKey}/${productKey}`;
    if (navigator.share) {
      navigator
        .share({
          title: product?.name || "Produto",
          text: `Confira este produto: ${product?.name || "Produto"}`,
          url: link,
        })
        .then(() => console.log("Compartilhamento bem-sucedido"))
        .catch((error) => console.error("Erro ao compartilhar:", error));
    } else {
      navigator.clipboard
        .writeText(link)
        .then(() => alert("Link copiado para a área de transferência!"))
        .catch((error) => console.error("Erro ao copiar o link:", error));
    }
  };

  const handleImageChange = (direction) => {
    const images = [product?.imageUrl, ...(product?.additionalImages || [])];
    if (direction === "next") {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  const handleRegister = async (newUser, rating, comment) => {
    const userId = newUser.id;
    const userName = newUser.name;

    const newRating = {
      userId,
      userName,
      stars: rating,
      comment,
      timestamp: new Date().toISOString(),
    };

    try {
      const firestoreCategoryKey = categoryKey.replace(/-/g, " ");
      const firestoreProductKey = productKey.replace(/-/g, " ");
      const productDetailRef = doc(db, "lojinha", `product-details-${firestoreCategoryKey}-${firestoreProductKey}`);
      const productDoc = await getDoc(productDetailRef);
      const currentRatings = productDoc.exists() && productDoc.data().ratings ? productDoc.data().ratings : [];
      const updatedRatings = [...currentRatings, newRating];

      await updateDoc(productDetailRef, { ratings: updatedRatings }, { merge: true });
      setProduct((prev) => ({ ...prev, ratings: updatedRatings }));
      setRating(0);
      setComment("");
      setSuccess("Avaliação enviada com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Erro ao enviar avaliação.");
      console.error(error);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  const allImages = [product?.imageUrl, ...(product?.additionalImages || [])];

  return (
    <div className="product-detail">
      <h1>{product?.name || "Produto"}</h1>
      {success && <p className="success">{success}</p>}
      <div className="product-detail-content">
        <div className="image-gallery">
          <img src={allImages[currentImageIndex]} alt={product?.name || "Produto"} className="main-image" />
          <div className="image-controls">
            <button onClick={() => handleImageChange("prev")}>◄</button>
            <button onClick={() => handleImageChange("next")}>►</button>
          </div>
          <div className="thumbnail-gallery">
            {allImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product?.name || "Produto"} ${idx}`}
                className={`thumbnail ${idx === currentImageIndex ? "active" : ""}`}
                onClick={() => setCurrentImageIndex(idx)}
              />
            ))}
          </div>
        </div>
        <div className="details">
          <p>{product?.description || "Sem descrição disponível"}</p>
          <div className="price-info">
            <span className="anchor-price">R${(product?.anchorPrice || 0).toFixed(2)}</span>
            <span className="current-price">R${(product?.price || 0).toFixed(2)}</span>
            {product?.discountPercentage > 0 && (
              <span className="discount">{product.discountPercentage}% OFF</span>
            )}
          </div>
          {product?.variants && product.variants.length > 0 && (
            <div className="variants-section">
              <h3>Escolha uma variante:</h3>
              <div className="variant-options">
                {product.variants.map((variant, index) => (
                  <label key={index} className="variant-label">
                    <input
                      type="radio"
                      name="variant"
                      checked={
                        selectedVariant &&
                        selectedVariant.color === variant.color &&
                        selectedVariant.size === variant.size
                      }
                      onChange={() => handleVariantChange(variant)}
                    />
                    <span>Cor: {variant.color}, Tamanho: {variant.size}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <button className="add-to-cart" onClick={handleAddToCart}>
            Adicionar ao Carrinho
          </button>
          <button className="share-btn" onClick={handleShareLink} title="Compartilhar">
            <FaShareAlt />
          </button>
        </div>
      </div>

      <div className="ratings-section">
        <h2>Avaliações</h2>
        {product?.ratings && product.ratings.length > 0 ? (
          product.ratings.map((r, idx) => (
            <div key={idx} className="rating">
              <div className="stars">{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</div>
              <p>{r.comment}</p>
              <small>{new Date(r.timestamp).toLocaleString()} - {r.userName}</small>
            </div>
          ))
        ) : (
          <p>Sem avaliações ainda.</p>
        )}

        <div className="rating-form">
          <h3>Deixe sua Avaliação</h3>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= rating ? "filled" : ""}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            placeholder="Escreva seu comentário..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={handleRatingSubmit}>Enviar Avaliação</button>
        </div>
      </div>

      {isRegisterModalOpen && (
        <RegisterModal
          onClose={() => setRegisterModalOpen(false)}
          onRegister={handleRegister}
          rating={rating}
          comment={comment}
        />
      )}
    </div>
  );
};

export default ProductDetail;