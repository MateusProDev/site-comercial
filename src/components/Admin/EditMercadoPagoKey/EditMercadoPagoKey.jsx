import React, { useState } from "react";
import { db } from "../../../firebase/firebase"; // Importe o Firestore
import { doc, setDoc } from "firebase/firestore";
import "./EditMercadoPagoKey.css";

const EditMercadoPagoKey = () => {
  const [mpPublicKey, setMpPublicKey] = useState("");
  const [mpSecretKey, setMpSecretKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSaveKeys = async () => {
    setLoading(true);
    setMessage("");
    try {
      // Referência para o documento onde vamos salvar as chaves
      const docRef = doc(db, "settings", "mercadopago");

      // Salvar as chaves no Firestore
      await setDoc(docRef, {
        publicKey: mpPublicKey,
        secretKey: mpSecretKey,
      });

      setMessage("Chaves salvas com sucesso!");
    } catch (error) {
      setMessage("Erro ao salvar as chaves.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="edit-mercadopago-key">
      <h2>Editar Chaves do Mercado Pago</h2>

      {message && <p className="message">{message}</p>}

      <div>
        <p>Chave Pública Atual: {mpPublicKey || "Nenhuma chave pública configurada"}</p>
        <input
          type="text"
          value={mpPublicKey}
          onChange={(e) => setMpPublicKey(e.target.value)}
          placeholder="Nova chave pública"
        />
      </div>

      <div>
        <p>Chave Secreta Atual: {mpSecretKey || "Nenhuma chave secreta configurada"}</p>
        <input
          type="text"
          value={mpSecretKey}
          onChange={(e) => setMpSecretKey(e.target.value)}
          placeholder="Nova chave secreta"
        />
      </div>

      <button
        onClick={handleSaveKeys}
        disabled={loading || !mpPublicKey || !mpSecretKey}
      >
        {loading ? "Salvando..." : "Salvar Chaves"}
      </button>
    </div>
  );
};

export default EditMercadoPagoKey;
