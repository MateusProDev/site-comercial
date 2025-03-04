import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext/CartContext";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import "./CheckoutOptions.css";

const CheckoutOptions = () => {
  const { cart, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [payerEmail, setPayerEmail] = useState("");
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    initMercadoPago(process.env.REACT_APP_MP_PUBLIC_KEY, { locale: "pt-BR" });
  }, []);

  const handleMercadoPagoCheckout = async () => {
    if (!payerEmail) {
      setError("Por favor, insira seu e-mail.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    // URL da API dependendo do ambiente (desenvolvimento ou produção)
    const baseURL =
      process.env.NODE_ENV === "production"
        ? "https://site-comercial-ten.vercel.app/api/checkout"
        : "http://localhost:3000/api/checkout";

    try {
      const response = await fetch(baseURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, payerEmail }), // Removido `total`
      });

      const data = await response.json();
      if (data.id) {
        setPreferenceId(data.id);
        setSuccess("Pronto para pagar com Mercado Pago!");
      } else {
        setError("Erro ao criar a preferência de pagamento.");
      }
    } catch (err) {
      setError("Erro ao processar o pagamento com Mercado Pago.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <p>Sua sacola está vazia.</p>;
  }

  return (
    <div className="checkout-options">
      <h2>Finalizar Compra Online</h2>
      <p>Total: R${total.toFixed(2)}</p>
      {error && <p className="checkout-error">{error}</p>}
      {success && <p className="checkout-success">{success}</p>}
      <input
        type="email"
        value={payerEmail}
        onChange={(e) => setPayerEmail(e.target.value)}
        placeholder="Seu e-mail"
        className="email-input"
      />
      <button
        className="mercadopago-btn"
        onClick={handleMercadoPagoCheckout}
        disabled={loading}
      >
        Pagar com Mercado Pago
      </button>
      {loading && <p>Processando...</p>}
      {preferenceId && <Wallet initialization={{ preferenceId }} />}
    </div>
  );
};

export default CheckoutOptions;
