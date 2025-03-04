import mercadopago from "mercadopago";

// Armazenamento temporário de chaves, pode ser substituído por qualquer outro sistema de armazenamento (como um banco de dados temporário).
let tempKeys = { publicKey: "", secretKey: "" };

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { cart, payerEmail, publicKey, secretKey } = req.body;

      // Validação de dados de entrada
      if (!cart || cart.length === 0) {
        return res.status(400).json({ error: "Carrinho vazio." });
      }

      if (!payerEmail) {
        return res.status(400).json({ error: "E-mail do pagador é necessário." });
      }

      if (!publicKey || !secretKey) {
        return res.status(400).json({ error: "Chaves do Mercado Pago são necessárias." });
      }

      // Armazenando as chaves temporariamente no servidor
      tempKeys.publicKey = publicKey;
      tempKeys.secretKey = secretKey;

      // Configurando o Mercado Pago com a chave secreta
      mercadopago.configure({
        access_token: secretKey, // Usando a chave secreta para autenticação
      });

      // Mapeando os itens corretamente para o Mercado Pago
      const items = cart.map((item) => ({
        title: item.name,
        unit_price: Number(item.price),
        quantity: Number(item.quantity),
      }));

      const preference = {
        payer: { email: payerEmail },
        items,
        back_urls: {
          success: "https://site-comercial-ten.vercel.app/lojinha/sucesso",
          failure: "https://site-comercial-ten.vercel.app/lojinha/falha",
          pending: "https://site-comercial-ten.vercel.app/lojinha/pendente",
        },
        auto_return: "approved",
      };

      console.log("Criando a preferência de pagamento:", preference);

      const response = await mercadopago.preferences.create(preference);
      console.log("Resposta do Mercado Pago:", response.body); // Log da resposta

      return res.json({ id: response.body.id }); // Retorna o ID da preferência para o frontend
    } catch (error) {
      console.error("Erro no servidor:", error.message);
      return res.status(500).json({ error: "Erro ao criar preferência de pagamento: " + error.message });
    }
  } else if (req.method === "GET") {
    // Caso você queira acessar as chaves temporárias armazenadas
    return res.status(200).json(tempKeys);
  } else {
    return res.status(405).json({ error: "Método não permitido" });
  }
}
