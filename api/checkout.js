import mercadopago from "mercadopago";

// Armazenamento temporário de chaves, pode ser substituído por qualquer outro sistema de armazenamento (como um banco de dados temporário).
let tempKeys = { publicKey: "", secretKey: "" };

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { publicKey, secretKey } = req.body;

      // Armazenando as chaves temporariamente no servidor
      tempKeys.publicKey = publicKey;
      tempKeys.secretKey = secretKey;

      // Configurando o Mercado Pago com a chave secreta
      mercadopago.configure({
        access_token: secretKey, // Usando a chave secreta para autenticação
      });

      const { cart, payerEmail } = req.body;

      if (!cart || cart.length === 0) {
        return res.status(400).json({ error: "Carrinho vazio." });
      }

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
          success: "http://localhost:3000/lojinha/sucesso",
          failure: "http://localhost:3000/lojinha/falha",
          pending: "http://localhost:3000/lojinha/pendente",
        },
        auto_return: "approved",
      };

      const response = await mercadopago.preferences.create(preference);
      return res.json({ id: response.body.id }); // Retorna o ID da preferência para o frontend
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === "GET") {
    // Caso você queira acessar as chaves temporárias armazenadas
    return res.status(200).json(tempKeys);
  } else {
    return res.status(405).json({ error: "Método não permitido" });
  }
}