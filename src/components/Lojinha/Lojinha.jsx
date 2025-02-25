import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { db } from "../../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import Footer from "../../components/Footer/Footer";
import "./Lojinha.css";

const Lojinha = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [isCartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const { categoria } = useParams();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "produtos"), (querySnapshot) => {
      const produtosList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(produtosList);
    });

    return () => unsubscribe();
  }, []);

  const addToCart = (item) => {
    const updatedCart = [...cart, item];
    setCart(updatedCart);
    setTotal(updatedCart.reduce((sum, product) => sum + product.preco, 0));
  };

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    setTotal(updatedCart.reduce((sum, product) => sum + product.preco, 0));
  };

  const handleCartToggle = () => setCartOpen(!isCartOpen);

  const handleFinalizePurchase = () => {
    const message = cart
      .map((item) => `${item.nome} - R$${item.preco.toFixed(2)}`)
      .join("\n");
    const totalValue = total.toFixed(2);
    const whatsappMessage = `Desejo concluir meu pedido:\n\n${message}\n\nTotal: R$${totalValue}\n\nPreencha as informações:\n\nNome:\nEndereço:\nForma de pagamento:\nPix, Débito, Crédito`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=5585991470709&text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank");
  };

  const filteredProducts = categoria
    ? products.filter((product) => product.categoria.toLowerCase() === categoria.toLowerCase())
    : products.filter((product) => product.categoria === "Destaque");

  return (
    <div className="lojinhaContainer">
      <div className="boxCar" onClick={handleCartToggle}>
        <FiShoppingBag className="cartIcon" />
        {cart.length > 0 && <span className="cartCount">{cart.length}</span>}
      </div>

      <main className="mainContent">
        <h1>Bem-vindo à Lojinha</h1>
        <section className="categories">
          <h2>Categorias</h2>
          <div className="categoryList">
            <Link to="/categoria/eletronicos">Eletrônicos</Link>
            <Link to="/categoria/moda">Moda</Link>
            <Link to="/categoria/casa">Casa</Link>
            <Link to="/lojinha">Destaque</Link>
          </div>
        </section>

        <section className="products">
          <h2>{categoria ? `${categoria}` : "Produtos em Destaque"}</h2>
          {!categoria ? (
            <div className="highlightCarouselWrapper">
              <div className="highlightCarousel">
                {filteredProducts.concat(filteredProducts).map((product, index) => (
                  <div key={`${product.id}-${index}`} className="productItemDestaque">
                    <img src={product.imagem} alt={product.nome} className="productImageDestaque" />
                    <p className="productName">{product.nome}</p>
                    <p>R${product.preco.toFixed(2)}</p>
                    <button onClick={() => addToCart(product)}>Adicionar ao Carrinho</button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="productList">
              {filteredProducts.length === 0 ? (
                <p>Nenhum produto disponível nesta categoria.</p>
              ) : (
                filteredProducts.map((product) => (
                  <div key={product.id} className="productItem">
                    <img src={product.imagem} alt={product.nome} className="productImage" />
                    <p>{product.nome} - R${product.preco.toFixed(2)}</p>
                    <p>{product.descricao}</p>
                    <button onClick={() => addToCart(product)}>Adicionar ao Carrinho</button>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        <section className={`carinho_compras ${isCartOpen ? "open" : ""}`}>
          <h2 id="titleCar">Sacola</h2>
          <div className="carrinhoItens">
            {cart.length === 0 ? (
              <p>Sua sacola está vazia</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="cartItem">
                  <span className="carTl">{item.nome} - R${item.preco.toFixed(2)}</span>
                  <button className="removeItem" onClick={() => removeFromCart(index)}>X</button>
                </div>
              ))
            )}
          </div>
          <div className="totalCarrinho">
            <p><strong>Total:</strong> R${total.toFixed(2)}</p>
            <button className="btnCar" onClick={handleFinalizePurchase}>Finalizar Compra</button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Lojinha;