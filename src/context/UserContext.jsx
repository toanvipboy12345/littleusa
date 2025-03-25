
// import React, { createContext, useState, useEffect } from "react";
// import axiosInstance from "../Api/axiosInstance";
// import { useNavigate } from "react-router-dom";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   // Kiểm tra session và đồng bộ user khi ứng dụng khởi động
//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const response = await axiosInstance.get("/api/current-user");
//         const user = response.data;
//         localStorage.setItem("user", JSON.stringify(user));
//         setUser(user);
//       } catch (error) {
//         console.error("Session check failed:", error);
//         localStorage.removeItem("user");
//         setUser(null);
//         navigate("/login"); // Điều hướng đến trang đăng nhập nếu session không hợp lệ
//       }
//     };

//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       checkSession(); // Kiểm tra session nếu localStorage có user
//     }
//   }, [navigate]);

//   // Hàm xử lý đăng nhập
//   const handleLogin = async (formData) => {
//     try {
//       const response = await axiosInstance.post("/login", formData);
//       const { user } = response.data;
//       localStorage.setItem("user", JSON.stringify(user));
//       setUser(user);
//       if (user.role === "admin") {
//         navigate("/admin");
//       } else {
//         navigate("/");
//       }
//     } catch (error) {
//       console.error("Error during login:", error);
//       throw error;
//     }
//   };

//   // Hàm xử lý đăng xuất
//   const handleLogout = async () => {
//     try {
//       await axiosInstance.post("/api/logout");
//       localStorage.removeItem("user");
//       setUser(null);
//       navigate("/login");
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

//   return (
//     <UserContext.Provider value={{ user, setUser, handleLogin, handleLogout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../Api/axiosInstance";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Kiểm tra session và đồng bộ user khi ứng dụng khởi động
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axiosInstance.get("/api/current-user");
        const userData = response.data;
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        // Hợp nhất wishlist nếu có wishlistToken
        const wishlistToken = localStorage.getItem("wishlistToken");
        if (wishlistToken) {
          await mergeWishlist(userData.id, wishlistToken);
        }
      } catch (error) {
        console.error("Session check failed:", error);
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login"); // Điều hướng đến trang đăng nhập nếu session không hợp lệ
      }
    };

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser); // Khôi phục user từ localStorage
      checkSession(); // Kiểm tra session
    }
  }, [navigate]);

  // Hàm hợp nhất wishlist
  const mergeWishlist = async (userId, wishlistToken) => {
    try {
      await axiosInstance.post("/api/wishlist/merge", null, {
        params: { userId, wishlistToken },
      });
      // Sau khi hợp nhất thành công, xóa wishlistToken
      localStorage.removeItem("wishlistToken");
    } catch (error) {
      console.error("Error merging wishlist:", error);
    }
  };

  // Hàm xử lý đăng nhập
  const handleLogin = async (formData) => {
    try {
      const response = await axiosInstance.post("/login", formData);
      const { user } = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      // Hợp nhất wishlist nếu có wishlistToken
      const wishlistToken = localStorage.getItem("wishlistToken");
      if (wishlistToken) {
        await mergeWishlist(user.id, wishlistToken);
      }

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/logout");
      localStorage.removeItem("user");
      localStorage.removeItem("wishlistToken"); // Xóa wishlistToken khi đăng xuất
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, handleLogin, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};