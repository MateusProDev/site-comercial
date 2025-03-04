const { db } = require("../src/firebase/firebaseConfig");
const { doc, getDoc } = require("firebase/firestore");
const mercadopago = require("mercadopago");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  console.log("Requisição recebida:", req.body);

  const { cart, payerEmail } = req.body;

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    console.log("Erro: Carrinho inválido ou vazio");
    return res.status(400).json({ error: "Carrinho inválido ou vazio" });
  }

  if (!payerEmail || !payerEmail.includes("@")) {
    console.log("Erro: E-mail inválido");
    return res.status(400).json({ error: "E-mail inválido" });
  }

  try {
    console.log("Buscando Access Token no Firestore...");
    const docRef = doc(db, "settings", "mercadopago");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("Erro: Documento 'settings/mercadopago' não encontrado");
      return res.status(400).json({ error: "Chave secreta do Mercado Pago não configurada" });
    }

    const { secretKey } = docSnap.data();
    if (!secretKey) {
      console.log("Erro: 'secretKey' não encontrado no documento");
      return res.status(400).json({ error: "Chave secreta do Mercado Pago não configurada" });
    }
    console.log("Access Token obtido com sucesso:", secretKey);

    // Configura o Mercado Pago com o Access Token
    mercadopago.configure({
      access_token: secretKey,
    });

    // Mapeia os itens do carrinho
    const items = cart.map((item) => {
      const unitPrice = parseFloat(item.preco || item.price || 0);
      if (isNaN(unitPrice)) {
        console.log("Erro: Preço inválido para item:", item);
        throw new Error("Preço inválido no carrinho");
      }
      return {
        title: item.nome || "Produto sem nome",
        unit_price: unitPrice,
        quantity: 1,
        currency_id: "BRL", // Adicionado para produção
      };
    });

    console.log("Itens do carrinho mapeados:", items);

    // Cria a preferência de pagamento
    const preference = {
      items,
      payer: { email: payerEmail },
      back_urls: {
        success: "https://site-comercial-ten.vercel.app/success",
        failure: "https://site-comercial-ten.vercel.app/failure",
        pending: "https://site-comercial-ten.vercel.app/pending",
      },
      auto_return: "approved",
    };

    console.log("Criando preferência no Mercado Pago...");
    const response = await mercadopago.preferences.create(preference);
    console.log("Preferência criada com sucesso:", response.body.id);

    return res.status(200).json({ id: response.body.id });
  } catch (error) {
    console.error("Erro detalhado ao criar preferência:", error.message, error.stack);
    return res.status(500).json({ error: error.message || "Erro interno ao criar a preferência" });
  }
};