import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth"; // Função para login
import { auth } from "../../../firebase/firebase"; // Certifique-se de que está exportando o 'auth' corretamente
import "./AdminLogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Usando a função modular para login
      await signInWithEmailAndPassword(auth, email, password); // Agora passando 'auth' como primeiro parâmetro
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Erro de login:", err); // Log do erro para depuração
      setError("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <div className="admin-login">
      <h2>Painel Administrativo</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default AdminLogin;
