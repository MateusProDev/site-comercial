const { db } = require("../src/firebase/firebaseConfig"); // Ajuste o caminho
const { doc, getDoc } = require("firebase/firestore");
const mercadopago = require("mercadopago");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  console.log("Requisição recebida:", req.body); // Log para depuração

  const { cart, payerEmail } = req.body;

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: "Carrinho inválido ou vazio" });
  }

  if (!payerEmail || !payerEmail.includes("@")) {
    return res.status(400).json({ error: "E-mail inválido" });
  }

  try {
    // Busca o Access Token do Firestore
    const docRef = doc(db, "settings", "mercadopago");
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(400).json({ error: "Chave secreta do Mercado Pago não configurada" });
    }
    const { secretKey } = docSnap.data();
    console.log("Access Token obtido:", secretKey); // Log para depuração

    // Configura o Mercado Pago
    mercadopago.configure({
      access_token: secretKey,
    });

    // Mapeia os itens do carrinho
    const items = cart.map((item) => ({
      title: item.nome || "Produto sem nome",
      unit_price: parseFloat(item.preco || item.price || 0),
      quantity: 1,
    }));

    // Cria a preferência de pagamento
    const preference = {
      items,
      payer: { email: payerEmail },
      back_urls: {
        success: process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/success`
          : "http://localhost:3000/success",
        failure: process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/failure`
          : "http://localhost:3000/failure",
        pending: process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/pending`
          : "http://localhost:3000/pending",
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);
    console.log("Preferência criada:", response.body.id); // Log para depuração
    return res.status(200).json({ id: response.body.id });
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    return res.status(500).json({ error: "Erro ao criar a preferência de pagamento" });
  }
};