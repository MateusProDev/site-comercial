import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { db } from "../../firebase/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import Footer from "../../components/Footer/Footer";
import LojinhaHeader from "./LojinhaHeader/LojinhaHeader";
import BannerRotativo from "./BannerRotativo/BannerRotativo";
import { useCart } from "../../context/CartContext/CartContext";
import "./Lojinha.css";

const Lojinha = () => {
  const { cart, total, addToCart, removeFromCart } = useCart();
  const [isCartOpen, setCartOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({}); // Estado para controlar expansão por categoria
  const { categoria } = useParams();

  useEffect(() => {
    const productsRef = doc(db, "lojinha", "products");

    const unsubscribe = onSnapshot(productsRef, (docSnap) => {
      if (docSnap.exists()) {
        setCategories(docSnap.data().categories || []);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCartToggle = () => setCartOpen(!isCartOpen);

  const handleFinalizePurchase = () => {
    const message = cart.map((item) => `${item.nome} - R$${(item.preco || item.price).toFixed(2)}`).join("\n");
    const totalValue = total.toFixed(2);
    const whatsappMessage = `Desejo concluir meu pedido:\n\n${message}\n\nTotal: R$${totalValue}\n\nPreencha as informações:\n\nNome:\nEndereço:\nForma de pagamento:\nPix, Débito, Crédito`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=5585991470709&text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Filtrar produtos com base no termo de pesquisa
  const filteredCategories = categories.map((category) => ({
    ...category,
    products: category.products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.title.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((category) => 
    categoria 
      ? category.title.toLowerCase() === categoria.toLowerCase() 
      : category.products.length > 0 || category.title === "Destaque"
  );

  // Função para alternar a expansão de uma categoria
  const toggleCategoryExpansion = (categoryIndex) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryIndex]: !prev[categoryIndex],
    }));
  };

  return (
    <div className="lojinhaContainer">
      <LojinhaHeader logo="/logo.png" title="Bem-vindo à Lojinha" />

      <div className="boxCar" onClick={handleCartToggle}>
        <FiShoppingBag className="cartIcon" />
        {cart.length > 0 && <span className="cartCount">{cart.length}</span>}
      </div>
      <BannerRotativo />
      <div className="lojaFlex">
        <main className="mainContent">
          {/* Barra de Pesquisa */}
          <section className="search-bar">
            <input
              type="text"
              placeholder="Pesquisar produtos por nome ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </section>

          <section className="categories">
            <h2>Categorias</h2>
            <div className="categoryList">
              {categories.map((cat, index) => (
                <Link key={index} to={`/categoria/${cat.title.toLowerCase()}`}>
                  {cat.title}
                </Link>
              ))}
              <Link to="/lojinha">Destaque</Link>
            </div>
          </section>

          <section className="products">
            {filteredCategories.map((category, index) => {
              const isExpanded = expandedCategories[index];
              const visibleProducts = isExpanded ? category.products : category.products.slice(0, 4);

              return (
                <div key={index} className="category-section">
                  <h2>
                    {categoria ? category.title : (category.title === "Destaque" ? "Produtos em Destaque" : category.title)}
                  </h2>
                  {category.title === "Destaque" && !categoria ? (
                    <div className="highlightCarouselWrapper">
                      <div className="highlightCarousel">
                        {category.products.concat(category.products).map((product, productIndex) => (
                          <div key={`${productIndex}-${index}`} className="productItemDestaque">
                            <img src={product.imageUrl} alt={product.name} className="productImageDestaque" />
                            <p className="productName">{product.name}</p>
                            <p>R${product.price.toFixed(2)}</p>
                            {product.description && <p className="productDescription">{product.description}</p>}
                            <button onClick={() => addToCart({ ...product, preco: product.price, nome: product.name })}>
                              Adicionar ao Carrinho
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="productList">
                      {visibleProducts.length === 0 ? (
                        <p>Nenhum produto disponível nesta categoria.</p>
                      ) : (
                        visibleProducts.map((product, productIndex) => (
                          <div key={productIndex} className="productItem">
                            <img src={product.imageUrl} alt={product.name} className="productImage" />
                            <p>{product.name} - R${product.price.toFixed(2)}</p>
                            {product.description ? (
                              <p>{product.description}</p>
                            ) : (
                              <p className="noDescription">Descrição não disponível</p>
                            )}
                            <button onClick={() => addToCart({ ...product, preco: product.price, nome: product.name })}>
                              Adicionar ao Carrinho
                            </button>
                          </div>
                        ))
                      )}
                      {category.products.length > 4 && (
                        <button
                          className="see-more-btn"
                          onClick={() => toggleCategoryExpansion(index)}
                        >
                          {isExpanded ? "Ver menos" : "Ver mais"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          <section className={`carinho_compras ${isCartOpen ? "open" : ""}`}>
            <h2 id="titleCar">Sacola</h2>
            <div className="carrinhoItens">
              {cart.length === 0 ? (
                <p>Sua sacola está vazia</p>
              ) : (
                cart.map((item, index) => (
                  <div key={index} className="cartItem">
                    <span className="carTl">{item.nome} - R$${(item.preco || item.price).toFixed(2)}</span>
                    <button className="removeItem" onClick={() => removeFromCart(index)}>X</button>
                  </div>
                ))
              )}
            </div>
            <div className="totalCarrinho">
              <p><strong>Total:</strong> R${total.toFixed(2)}</p>
              <button className="btnCar" onClick={handleFinalizePurchase}>Finalizar Compra</button>
            </div>
            <div className="cartLoginAdmin">
              <Link to="/loja/login" className="adminLink">
                <FaUser /> Painel Administrativo
              </Link>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Lojinha;