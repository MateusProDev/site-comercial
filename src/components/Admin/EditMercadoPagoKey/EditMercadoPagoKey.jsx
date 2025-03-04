import React, { useState, useEffect } from "react";
import { db } from "../../../firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./EditMercadoPagoKey.css";

const EditMercadoPagoKey = () => {
  const [publicKey, setPublicKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const docRef = doc(db, "settings", "mercadopago");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPublicKey(data.publicKey || "");
        }
      } catch (err) {
        console.error("Erro ao carregar chave pública:", err);
      }
    };
    fetchKeys();
  }, []);

  const handleSaveKeys = async () => {
    setLoading(true);
    setMessage("");
    try {
      const docRef = doc(db, "settings", "mercadopago");
      await setDoc(docRef, { publicKey }, { merge: true });
      setMessage("Chave pública salva com sucesso!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Erro ao salvar a chave pública.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="edit-mercadopago-key">
      <h2>Editar Chave Pública do Mercado Pago</h2>
      {message && <p className={message.includes("Erro") ? "error" : "success"}>{message}</p>}
      <div className="form-group">
        <label>Chave Pública:</label>
        <input
          type="text"
          value={publicKey}
          onChange={(e) => setPublicKey(e.target.value)}
          placeholder="Digite a chave pública"
        />
      </div>
      <button onClick={handleSaveKeys} disabled={loading || !publicKey}>
        {loading ? "Salvando..." : "Salvar Chave"}
      </button>
      <p className="note">Nota: A chave secreta deve ser configurada no painel do Vercel.</p>
    </div>
  );
};

export default EditMercadoPagoKey;