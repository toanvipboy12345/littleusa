import React, { useState } from "react";
import { useContext } from "react"; // Đảm bảo import useContext
import { UserContext } from "../../context/UserContext"; // Import UserContext
import {
  Button,
  Input,
  Text,
  Box,
  Link,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { FaGoogle } from "react-icons/fa"; // Import Google icon
import { Link as RouterLink } from "react-router-dom"; // Import RouterLink

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { handleLogin } = useContext(UserContext); // Lấy handleLogin từ context

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(formData); // Gọi hàm handleLogin từ context
    } catch (err) {
      let errorMessage = "";
      if (err.response && typeof err.response.data === "string") {
        errorMessage = err.response.data; // Lấy thông điệp lỗi từ server
      }
      setError(errorMessage); // Hiển thị thông điệp lỗi từ server
    }
  };

  return (
    <Box
      maxW={{ base: "90%", sm: "80%", md: "70%", lg: "40%" }}
      mx="auto"
      my="20"
    >
      {/* Tiêu đề */}
      <Heading as="h2" textAlign="center" mb="6">
        ĐĂNG NHẬP
      </Heading>

      {/* Form Đăng nhập */}
      <form onSubmit={handleSubmit}>
        <Box mb="4">
          <Text fontSize="sm" fontWeight="bold">
            TÊN ĐĂNG NHẬP
          </Text>
          <Input
            name="username"
            placeholder="Tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            required
            bg="#f7f7f7"
            border="1px solid var(--primary-color)"
            color="black"
            borderRadius="0"
            w="100%" // Đảm bảo input full width để đồng nhất
            px="4"
            _hover={{
              boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
            }}
            _focus={{
              borderColor: "var(--primary-color)",
            }}
          />
        </Box>
        {/* Password */}
        <Box mb="8">
          <Text fontSize="sm" fontWeight="bold">
            MẬT KHẨU
          </Text>
          <Input
            type="password"
            name="password"
            placeholder="Nhập Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
            bg="#f7f7f7"
            border="1px solid var(--primary-color)"
            color="black"
            borderRadius="0"
            w="100%" // Đảm bảo input full width để đồng nhất
            px="4"
            _hover={{
              boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
            }}
            _focus={{
              borderColor: "var(--primary-color)",
            }}
          />
        </Box>
        {error && <Text color="red">{error}</Text>}
        {/* Nút Đăng nhập và Google - Sát hai bên lề, thẳng hàng với input */}
        <Flex
          justifyContent="space-between" // Căn trái và phải để nút sát lề
          alignItems="center"
          mb="4" // Khoảng cách dưới nút
          flexWrap="wrap" // Cho phép nút xuống dòng trên mobile nếu cần
        >
          {/* Nút Đăng nhập - Căn trái */}
          <Button
            type="submit"
            variant="solid"
            w={{ base: "48%", sm: "48%", md: "48%" }} // Độ rộng 48% để có khoảng trống giữa 2 nút
          >
            ĐĂNG NHẬP
          </Button>

          {/* Nút Đăng nhập với Google - Căn phải */}
          <Button
            variant="outline"
            leftIcon={<FaGoogle />}
            onClick={() =>
              (window.location.href =
                "http://localhost:8080/oauth2/authorization/google")
            }
            w={{ base: "48%", sm: "48%", md: "48%" }} // Độ rộng 48% để đồng nhất với nút Đăng nhập
          >
            Đăng nhập với Google
          </Button>
        </Flex>
      </form>

      {/* Liên kết Quên mật khẩu - Thay đổi màu */}
      <Flex justifyContent="center" mt="4">
        <Link
          as={RouterLink}
          to="/ForgotPassword"

        >
          Quên mật khẩu?
        </Link>
      </Flex>

      {/* Liên kết Đăng ký - Thay đổi màu */}
      <Flex justifyContent="center" mt="2">
        <Text>
          Bạn chưa có tài khoản?{" "}
          <Link
            as={RouterLink}
            to="/Register"
           

          >
            Đăng ký tại đây.
          </Link>
        </Text>
      </Flex>
    </Box>
  );
};

export default Login;
