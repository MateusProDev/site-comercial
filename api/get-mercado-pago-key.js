// pages/api/get-mercado-pago-key.js
import { db } from "../../../firebase/firebase"; // Certifique-se de que o caminho está correto
import { doc, getDoc } from "firebase/firestore"; // Funções para acessar o Firestore

export default async function handler(req, res) {
  try {
    // Referência ao documento de configuração das chaves
    const docRef = doc(db, "settings", "mercadopago");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(400).json({ error: "Chave pública do Mercado Pago não configurada." });
    }

    // Recuperando a chave pública
    const { publicKey } = docSnap.data();
    
    // Retorna apenas a chave pública para o frontend
    return res.json({ publicKey });
  } catch (error) {
    console.error("Erro ao obter chave pública:", error.message);
    return res.status(500).json({ error: "Erro ao obter chave pública do Mercado Pago." });
  }
}
