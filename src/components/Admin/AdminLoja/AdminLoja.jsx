import React, { useState, useEffect } from "react";
import { db, auth } from "../../../firebase/firebaseConfig";
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Vamos usar o Axios para fazer o upload para o Cloudinary
import "./AdminLoja.css";

const AdminLoja = () => {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("Destaque");
  const [imagem, setImagem] = useState(null);
  const [descricao, setDescricao] = useState(""); // Adicionado campo descrição
  const [editandoProduto, setEditandoProduto] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Feedback de sucesso
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/loja/login");
      setError("Usuário não autenticado. Redirecionando para login.");
    } else {
      const unsubscribe = onSnapshot(collection(db, "produtos"), (querySnapshot) => {
        const produtosList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProdutos(produtosList);
        console.log("Produtos carregados:", produtosList);
      }, (error) => {
        console.error("Erro ao escutar produtos:", error.message);
        setError("Erro ao carregar produtos: " + error.message);
      });

      return () => unsubscribe();
    }
  }, [navigate]);

  const uploadImagemCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "qc7tkpck"); // Coloque seu upload_preset do Cloudinary aqui
    formData.append("cloud_name", "doeiv6m4h"); // Coloque seu cloud_name aqui

    try {
      const response = await axios.post("https://api.cloudinary.com/v1_1/doeiv6m4h/image/upload", formData);
      const url = response.data.secure_url; // URL da imagem no Cloudinary
      console.log("Imagem enviada para o Cloudinary:", url);
      return url;
    } catch (error) {
      throw new Error("Erro ao fazer upload da imagem no Cloudinary: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    let imagemUrl = editandoProduto?.imagem || "";
    if (imagem) {
      try {
        imagemUrl = await uploadImagemCloudinary(imagem);
      } catch (error) {
        setError(error.message);
        return;
      }
    }

    const produtoData = {
      nome,
      preco: parseFloat(preco),
      categoria,
      imagem: imagemUrl,
      descricao, // Adicionando a descrição aqui
    };

    try {
      if (editandoProduto) {
        await updateDoc(doc(db, "produtos", editandoProduto.id), produtoData);
        setSuccess("Produto editado com sucesso!");
        setEditandoProduto(null);
      } else {
        const docRef = await addDoc(collection(db, "produtos"), produtoData);
        setSuccess(`Produto adicionado com ID: ${docRef.id}`);
      }

      setNome("");
      setPreco("");
      setCategoria("Destaque");
      setImagem(null);
      setDescricao(""); // Limpar campo de descrição após enviar
    } catch (error) {
      console.error("Erro ao salvar produto:", error.message);
      setError("Erro ao salvar produto: " + error.message);
    }
  };

  const handleEditar = (produto) => {
    setEditandoProduto(produto);
    setNome(produto.nome);
    setPreco(produto.preco);
    setCategoria(produto.categoria);
    setDescricao(produto.descricao); // Carregar a descrição ao editar
  };

  const handleExcluir = async (id) => {
    try {
      await deleteDoc(doc(db, "produtos", id));
      setSuccess("Produto excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir produto:", error.message);
      setError("Erro ao excluir produto: " + error.message);
    }
  };

  return (
    <div className="admin-loja-container">
      <h1>Painel de Administração da Loja</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit} className="admin-form">
        <h2>{editandoProduto ? "Editar Produto" : "Adicionar Produto"}</h2>
        <input
          type="text"
          placeholder="Nome do Produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição do Produto"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        >
          <option value="Destaque">Destaque</option>
          <option value="Eletrônicos">Eletrônicos</option>
          <option value="Moda">Moda</option>
          <option value="Casa">Casa</option>
        </select>
        <input
          type="file"
          onChange={(e) => setImagem(e.target.files[0])}
          accept="image/*"
        />
        <button type="submit">
          {editandoProduto ? "Salvar Edição" : "Adicionar Produto"}
        </button>
      </form>

      <div className="produtos-list">
        <h2>Produtos Cadastrados</h2>
        {produtos.length === 0 ? (
          <p>Nenhum produto cadastrado.</p>
        ) : (
          produtos.map((produto) => (
            <div key={produto.id} className="produto-item">
              <img src={produto.imagem} alt={produto.nome} className="produto-imagem" />
              <div className="produto-info">
                <h3>{produto.nome}</h3>
                <p>R$ {produto.preco.toFixed(2)}</p>
                <p>Categoria: {produto.categoria}</p>
                <p>{produto.descricao}</p> {/* Exibe a descrição */}
              </div>
              <div className="produto-actions">
                <button onClick={() => handleEditar(produto)}>Editar</button>
                <button onClick={() => handleExcluir(produto.id)}>Excluir</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminLoja;
