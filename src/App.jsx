import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext/CartContext"; // Importe o CartProvider
import Home from "./pages/Home/Home";
import AboutPage from "./pages/AboutPage/AboutPage";
import AdminLogin from "./components/Admin/AdminLogin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard/AdminDashboard";
import EditBanner from "./components/Admin/EditBanner/EditBanner";
import EditBoxes from "./components/Admin/EditBoxes/EditBoxes";
import EditAbout from "./components/Admin/EditAbout/EditAbout";
import EditFooter from "./components/Admin/EditFooter/EditFooter";
import AdminWhatsAppConfig from "./components/Admin/AdminWhatsAppConfig/AdminWhatsAppConfig";
import EditCarousel from "./components/Admin/EditCarousel/EditCarousel";
import EditHours from "./components/Admin/EditHours/EditHours";
import LojaLogin from "./pages/LojaLogin/LojaLogin";
import Lojinha from "./components/Lojinha/Lojinha";
import AdminLoja from "./components/Admin/AdminLoja/AdminLoja";
import BannerAdmin from "./components/Admin/BannerAdmin/BannerAdmin";
import EditLojinhaHeader from "./components/Admin/EditLojinhaHeader/EditLojinhaHeader";
import EditProducts from "./components/Admin/EditProducts/EditProducts"; // Novo componente
import Products from "./components/Lojinha/Products/Products"; // Novo componente
import ProductDetail from "./components/Lojinha/ProductDetail/ProductDetail"; // Novo componente
import { auth } from "./firebase/firebaseConfig";

// Componente para proteger rotas administrativas
const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser; // Verifica se o usuário está autenticado
  return user ? children : <Navigate to="/loja/login" />; // Redireciona para o login se não estiver autenticado
};

const App = () => {
  return (
    <CartProvider> {/* Envolve toda a aplicação com o CartProvider */}
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/loja/login" element={<LojaLogin />} />
          <Route path="/lojinha" element={<Lojinha />} /> {/* Rota pública para Lojinha */}
          <Route path="/products" element={<Products />} /> {/* Rota pública para Products */}
          <Route path="/produto/:categoryIndex/:productIndex" element={<ProductDetail />} /> {/* Rota pública para detalhes */}

          {/* Rotas administrativas protegidas */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-banner"
            element={
              <ProtectedRoute>
                <EditBanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-boxes"
            element={
              <ProtectedRoute>
                <EditBoxes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-about"
            element={
              <ProtectedRoute>
                <EditAbout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-footer"
            element={
              <ProtectedRoute>
                <EditFooter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/loja/admin/edit-lojinhaHeader"
            element={
              <ProtectedRoute>
                <EditLojinhaHeader />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-whatsapp"
            element={
              <ProtectedRoute>
                <AdminWhatsAppConfig />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-carousel"
            element={
              <ProtectedRoute>
                <EditCarousel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-hours"
            element={
              <ProtectedRoute>
                <EditHours />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/loja"
            element={
              <ProtectedRoute>
                <AdminLoja />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/banner-admin"
            element={
              <ProtectedRoute>
                <BannerAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-products" // Nova rota para edição de produtos
            element={
              <ProtectedRoute>
                <EditProducts />
              </ProtectedRoute>
            }
          />

          {/* Rota de login administrativo */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Rota padrão para redirecionar */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;