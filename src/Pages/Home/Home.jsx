import React, { useEffect } from "react";
import axiosInstance from "../../Api/axiosInstance";
import Body from "./Body/Body";
import { useContext } from "react";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate
import { UserContext } from "../../context/UserContext";
import useDocumentTitle from "../../hook/useDocumentTitle";

const Home = () => {
  // eslint-disable-next-line no-unused-vars
  const { user, setUser } = useContext(UserContext); // Lấy user từ context
  const navigate = useNavigate(); // Sử dụng useNavigate
  useDocumentTitle("LITTLE USA")
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Gọi API /api/check-login để kiểm tra trạng thái đăng nhập
        const checkLoginResponse = await axiosInstance.get("/api/check-login");
        if (checkLoginResponse.data) {
          // Nếu đã đăng nhập, gọi API /api/current-user để lấy thông tin người dùng
          const currentUserResponse = await axiosInstance.get("/api/current-user");
          const currentUser = currentUserResponse.data;
          localStorage.setItem("user", JSON.stringify(currentUser));
          setUser(currentUser); // Cập nhật user trong context

          // Kiểm tra nếu người dùng là admin, chuyển hướng đến /admin
          if (currentUser.role === "admin") {
            navigate("/admin");
          }
        } else {
          // Nếu chưa đăng nhập, bỏ qua việc gọi API
          console.log("Người dùng chưa đăng nhập.");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        localStorage.removeItem("user");
      }
    };
    fetchCurrentUser();
  }, [setUser, navigate]);

  return (
    <div>
      {/* Truyền thông tin người dùng xuống Header */}
      <Body />
     
    </div>
  );
};

export default Home;