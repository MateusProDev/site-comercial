import React, { useState, useEffect } from "react";
import { db } from "../../../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EditProducts.css";

const EditProducts = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newProduct, setNewProduct] = useState({
    categoryIndex: null,
    name: "",
    description: "",
    price: "",
    anchorPrice: "",
    discountPercentage: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editCategoryIndex, setEditCategoryIndex] = useState(null);
  const [editProductIndex, setEditProductIndex] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const productsRef = doc(db, "lojinha", "products");
        const productsDoc = await getDoc(productsRef);
        if (productsDoc.exists()) {
          setCategories(productsDoc.data().categories || []);
        }
      } catch (error) {
        setError("Erro ao carregar dados.");
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageUpload = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "qc7tkpck");
    formData.append("cloud_name", "doeiv6m4h");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/doeiv6m4h/image/upload",
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      setError("Falha no upload da imagem.");
      return null;
    }
  };

  const handleAddCategory = () => {
    if (!newCategoryTitle) {
      setError("Digite um título para a categoria!");
      return;
    }
    setCategories((prev) => [...prev, { title: newCategoryTitle, products: [] }]);
    setNewCategoryTitle("");
  };

  const handleAddProduct = async () => {
    const { name, description, price, anchorPrice, discountPercentage, image, categoryIndex } = newProduct;

    if (!name || !description || !price || !anchorPrice || !image) {
      setError("Preencha todos os campos do produto!");
      return;
    }

    setLoading(true);

    const imageUrl = await handleImageUpload(image);

    if (imageUrl) {
      const updatedCategories = [...categories];
      const newProductData = {
        name,
        description,
        price: parseFloat(price),
        anchorPrice: parseFloat(anchorPrice),
        discountPercentage: parseFloat(discountPercentage) || 0,
        imageUrl,
      };
      updatedCategories[categoryIndex].products.push(newProductData);

      try {
        // Salvar as categorias e produtos
        await setDoc(doc(db, "lojinha", "products"), { categories: updatedCategories });

        // Criar uma entrada estática para os detalhes do produto
        const productDetailRef = doc(
          db,
          "lojinha",
          `product-details-${categoryIndex}-${updatedCategories[categoryIndex].products.length - 1}`
        );
        await setDoc(productDetailRef, {
          ...newProductData,
          categoryIndex,
          productIndex: updatedCategories[categoryIndex].products.length - 1,
          details: "Detalhes adicionais podem ser editados aqui.",
        });

        setCategories(updatedCategories);
        setNewProduct({ categoryIndex: null, name: "", description: "", price: "", anchorPrice: "", discountPercentage: "", image: null });
        setSuccess("Produto e detalhes adicionados com sucesso!");
      } catch (error) {
        setError("Erro ao salvar o produto ou detalhes.");
        console.error(error);
      }
    }

    setLoading(false);
  };

  const handleDeleteProduct = (categoryIndex, productIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].products.splice(productIndex, 1);

    setDoc(doc(db, "lojinha", "products"), { categories: updatedCategories })
      .then(() => {
        setCategories(updatedCategories);
      })
      .catch((error) => {
        setError("Erro ao excluir o produto.");
      });
  };

  const handleDeleteCategory = (categoryIndex) => {
    const updatedCategories = categories.filter((_, index) => index !== categoryIndex);

    setDoc(doc(db, "lojinha", "products"), { categories: updatedCategories })
      .then(() => {
        setCategories(updatedCategories);
        setSuccess("Categoria excluída com sucesso!");
      })
      .catch((error) => {
        setError("Erro ao excluir a categoria.");
      });
  };

  const handleSaveCategory = (categoryIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].title = newCategoryTitle;
    setCategories(updatedCategories);
    setEditCategoryIndex(null);
    setSuccess("Categoria atualizada!");
  };

  const handleSaveProduct = async (categoryIndex, productIndex) => {
    const updatedCategories = [...categories];
    const product = updatedCategories[categoryIndex].products[productIndex];

    let imageUrl = product.imageUrl;
    if (newProduct.image && typeof newProduct.image !== "string") {
      imageUrl = await handleImageUpload(newProduct.image);
    }

    updatedCategories[categoryIndex].products[productIndex] = {
      ...product,
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      anchorPrice: parseFloat(newProduct.anchorPrice),
      discountPercentage: parseFloat(newProduct.discountPercentage) || 0,
      imageUrl: imageUrl || product.imageUrl,
    };

    setCategories(updatedCategories);
    setEditProductIndex(null);
    setSuccess("Produto atualizado com sucesso!");
  };

  const handleEditCategory = (categoryIndex) => {
    setNewCategoryTitle(categories[categoryIndex].title);
    setEditCategoryIndex(categoryIndex);
  };

  const handleEditProduct = (categoryIndex, productIndex) => {
    const product = categories[categoryIndex].products[productIndex];
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      anchorPrice: product.anchorPrice.toString(),
      discountPercentage: product.discountPercentage.toString(),
      image: product.imageUrl,
      categoryIndex,
    });
    setEditProductIndex(productIndex);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, "lojinha", "products"), { categories });
      setSuccess("Alterações salvas!");
      setTimeout(() => navigate("/admin/dashboard"), 2000);
    } catch (error) {
      setError("Erro ao salvar as alterações.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-products">
      <h2>Editar Produtos</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <div className="add-category-form">
        <input
          type="text"
          placeholder="Nome da Categoria"
          value={newCategoryTitle}
          onChange={(e) => setNewCategoryTitle(e.target.value)}
        />
        <button onClick={handleAddCategory} disabled={loading}>
          Nova Categoria
        </button>
      </div>

      <div className="categories-list">
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="category">
            {editCategoryIndex === categoryIndex ? (
              <div>
                <input
                  type="text"
                  value={newCategoryTitle}
                  onChange={(e) => setNewCategoryTitle(e.target.value)}
                />
                <button onClick={() => handleSaveCategory(categoryIndex)} disabled={loading}>
                  Salvar
                </button>
              </div>
            ) : (
              <>
                <h3>{category.title}</h3>
                <button onClick={() => handleEditCategory(categoryIndex)} disabled={loading}>
                  Editar Categoria
                </button>
              </>
            )}

            <button
              onClick={() => handleDeleteCategory(categoryIndex)}
              className="delete-category-btn"
              disabled={loading}
            >
              Excluir Categoria
            </button>

            {newProduct.categoryIndex === categoryIndex && (
              <div className="add-product-form">
                <input
                  type="text"
                  placeholder="Nome do Produto"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <textarea
                  placeholder="Descrição"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Preço (R$)"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Preço de Ancoragem (R$)"
                  value={newProduct.anchorPrice}
                  onChange={(e) => setNewProduct({ ...newProduct, anchorPrice: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Desconto (%)"
                  value={newProduct.discountPercentage}
                  onChange={(e) => setNewProduct({ ...newProduct, discountPercentage: e.target.value })}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                />
                <button onClick={handleAddProduct} disabled={loading}>
                  {loading ? "Adicionando..." : "Adicionar Produto"}
                </button>
              </div>
            )}

            <button
              onClick={() => setNewProduct({ ...newProduct, categoryIndex })}
              disabled={loading}
            >
              Adicionar Produto
            </button>

            <div className="products-list">
              {category.products.map((product, productIndex) => (
                <div key={productIndex} className="product">
                  {editProductIndex === productIndex ? (
                    <div>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      />
                      <textarea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      />
                      <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      />
                      <input
                        type="number"
                        value={newProduct.anchorPrice}
                        onChange={(e) => setNewProduct({ ...newProduct, anchorPrice: e.target.value })}
                      />
                      <input
                        type="number"
                        value={newProduct.discountPercentage}
                        onChange={(e) => setNewProduct({ ...newProduct, discountPercentage: e.target.value })}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                      />
                      <button onClick={() => handleSaveProduct(categoryIndex, productIndex)} disabled={loading}>
                        Salvar Produto
                      </button>
                    </div>
                  ) : (
                    <div>
                      <img src={product.imageUrl} alt={product.name} />
                      <h4>{product.name}</h4>
                      <p>{product.description}</p>
                      <p>Preço: R${product.price.toFixed(2)}</p>
                      <p>Ancoragem: R${product.anchorPrice.toFixed(2)}</p>
                      <p>Desconto: {product.discountPercentage}%</p>
                      <button onClick={() => handleEditProduct(categoryIndex, productIndex)} disabled={loading}>
                        Editar Produto
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(categoryIndex, productIndex)}
                        disabled={loading}
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSave} disabled={loading}>
        {loading ? "Salvando..." : "Salvar Tudo"}
      </button>
    </div>
  );
};

export default EditProducts;