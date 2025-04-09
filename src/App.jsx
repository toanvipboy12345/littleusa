import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider, UserContext } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import Home from "./Pages/Home/Home";
import Admin from "./Pages/Admin/Admin";
import ProductDetail from "./Pages/Home/Body/ProductDetail/ProductDetail";
import MainLayout from "./Pages/Home/Layouts/MainLayout";
import theme from "./Pages/Theme";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import Product from "./Pages/Home/Body/Product/Product";
import Brands from "./Pages/Home/Body/Brands/Brands";
import Checkout from "./Pages/Home/Body/Checkout/Checkout"; 
import PaymentError from "./Pages/Home/Body/Checkout/PaymentError";
import PaymentSuccess from "./Pages/Home/Body/Checkout/PaymentSuccess";
import Order from "./Pages/Home/Body/Account/Order/Order";
import Account from "./Pages/Home/Body/Account/Account";
import Blog from "./Pages/Home/Body/Blogs/Blog";
import Blogdetail from "./Pages/Home/Body/Blogs/Blogdetail";
import Abouts from "./Pages/Home/Body/About/About-us";
import Promotions from "./Pages/Home/Body/promotions/promotions";
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = React.useContext(UserContext);

  if (!user) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <UserProvider>
          <CartProvider>
            <Routes>
              {/* Trang chủ */}
              <Route path="/" element={<MainLayout><Home /></MainLayout>} />

              {/* Trang đăng nhập */}
              <Route path="/Login" element={<MainLayout><Login /></MainLayout>} />

              {/* Trang đăng ký */}
              <Route path="/Register" element={<MainLayout><Register /></MainLayout>} />

              {/* Trang quên mật khẩu */}
              <Route path="/ForgotPassword" element={<MainLayout><ForgotPassword /></MainLayout>} />

              {/* Trang danh sách sản phẩm */}
              <Route path="/product" element={<MainLayout><Product /></MainLayout>} />

              {/* Trang danh sách thương hiệu */}
              <Route path="/brands" element={<MainLayout><Brands /></MainLayout>} />

              {/* Trang chi tiết sản phẩm */}
              <Route
                path="/products/:id/:slug"
                element={<MainLayout><ProductDetail /></MainLayout>}
              />
              {/* Trang tài khoản */}
              <Route path="/account" element={<MainLayout><Account /></MainLayout>} />
              {/* Trang thanh toán */}
              <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
              <Route path="/payment-error" element={<MainLayout><PaymentError /></MainLayout>} />
              <Route path="/payment-success" element={<MainLayout><PaymentSuccess /></MainLayout>} />

              {/* Trang đơn hàng */}
              <Route path="/order" element={<MainLayout><Order /></MainLayout>} />
              {/* Trang bài viết */}
              <Route path="/blogs" element={<MainLayout><Blog /></MainLayout>} />
              {/* Trang chi tiết bài viết */}
              <Route path="/blog/:id" element={<MainLayout><Blogdetail /></MainLayout>} />
              {/* Trang giới thiệu */}
              <Route path="/about-us" element={<MainLayout><Abouts /></MainLayout>} />
              {/* Trang khuyến mãi */}
              <Route path="/promotions" element={<MainLayout><Promotions /></MainLayout>} />
              {/* Trang quản trị */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </CartProvider>
        </UserProvider>
      </Router>
    </ChakraProvider>
  );
};

export default App;