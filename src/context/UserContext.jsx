// /* eslint-disable react-refresh/only-export-components */
// import React, { createContext, useState, useEffect } from "react";
// import axiosInstance from "../Api/axiosInstance";
// import { useNavigate } from "react-router-dom"; // Thêm useNavigate nếu cần điều hướng trong context

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate(); // Thêm để điều hướng sau khi đăng nhập
//   console.log(user);
//   // Kiểm tra thông tin người dùng từ localStorage khi ứng dụng khởi động
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   // Hàm xử lý đăng nhập
//   const handleLogin = async (formData) => {
//     try {
//       const response = await axiosInstance.post("/login", formData);
//       const { user } = response.data;
//       localStorage.setItem("user", JSON.stringify(user));
//       setUser(user); // Cập nhật user trong context
//       if (user.role === "admin") {
//         navigate("/admin");
//       } else {
//         navigate("/");
//       }
//     } catch (error) {
//       console.error("Error during login:", error);
//       throw error; // Ném lỗi để component Login xử lý hiển thị thông báo lỗi
//     }
//   };

//   // Hàm xử lý đăng xuất
//   const handleLogout = async () => {
//     try {
//       await axiosInstance.post("/api/logout");
//       localStorage.removeItem("user");
//       setUser(null); // Cập nhật user trong context thành null
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
/* eslint-disable react-refresh/only-export-components */
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
        const user = response.data;
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      } catch (error) {
        console.error("Session check failed:", error);
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login"); // Điều hướng đến trang đăng nhập nếu session không hợp lệ
      }
    };

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      checkSession(); // Kiểm tra session nếu localStorage có user
    }
  }, [navigate]);

  // Hàm xử lý đăng nhập
  const handleLogin = async (formData) => {
    try {
      const response = await axiosInstance.post("/login", formData);
      const { user } = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
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