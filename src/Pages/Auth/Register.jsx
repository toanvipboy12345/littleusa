import React, { useState } from "react";
import axiosInstance from "../../Api/axiosInstance";
import {
  Button,
  Input,
  Text,
  Box,
  Link,
  Stack,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu không khớp.";
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ.";
    }

    // Validate password length
    if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    // Validate phone format
    const phoneRegex = /^[0-9]{10,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ.";
    }

    // Validate firstName and lastName
    if (!formData.firstName) {
      newErrors.firstName = "Họ không được để trống.";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Tên không được để trống.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/register", formData);
      if (response.status === 200) {
        setErrors({});
        setSuccessMessage(
          "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận."
        );
        setTimeout(() => setSuccessMessage(""), 5000);
      }
    } catch (err) {
      setErrors({});
      console.log("Error response data:", err.response?.data);
      const errorData = err.response?.data || {};
      const serverErrors = {};
      if (typeof errorData === "object") {
        Object.keys(errorData).forEach((key) => {
          serverErrors[key] = errorData[key];
        });
      } else {
        serverErrors.general = errorData.message || "Đã xảy ra lỗi khi đăng ký.";
      }
      setErrors(serverErrors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      maxW={{ base: "90%", sm: "80%", md: "70%", lg: "40%" }}
      mx="auto"
      my="10"
      p={6}
    >
      <Heading as="h2" textAlign="center" mb="6">
        ĐĂNG KÝ
      </Heading>
      {errors.general && (
        <Text color="red.500" mb={4}>
          {errors.general}
        </Text>
      )}

      <Stack spacing={4}>
        <Text fontSize="sm" fontWeight="bold">
          Email
        </Text>
        <Input
          type="email"
          name="email"
          placeholder="Nhập email của bạn"
          required
          bg="#f7f7f7"
          border="1px solid var(--primary-color)"
          color="black"
          borderRadius="0"
          px="4"
          onChange={handleChange}
          borderColor={errors.email ? "red.500" : "var(--primary-color)"}
          _hover={{
            boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
          }}
          _focus={{
            borderColor: errors.email ? "red.500" : "var(--primary-color)",
          }}
        />
        {errors.email && (
          <Text color="red.500" fontSize="sm">
            {errors.email}
          </Text>
        )}

        <Text fontSize="sm" fontWeight="bold">
          Tên đăng nhập
        </Text>
        <Input
          type="text"
          name="username"
          placeholder="Nhập tên đăng nhập"
          required
          bg="#f7f7f7"
          border="1px solid var(--primary-color)"
          color="black"
          borderRadius="0"
          px="4"
          onChange={handleChange}
          borderColor={errors.username ? "red.500" : "var(--primary-color)"}
          _hover={{
            boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
          }}
          _focus={{
            borderColor: errors.username ? "red.500" : "var(--primary-color)",
          }}
        />
        {errors.username && (
          <Text color="red.500" fontSize="sm">
            {errors.username}
          </Text>
        )}

        <Text fontSize="sm" fontWeight="bold">
          Mật khẩu
        </Text>
        <Input
          type="password"
          name="password"
          placeholder="Nhập mật khẩu"
          required
          bg="#f7f7f7"
          border="1px solid var(--primary-color)"
          color="black"
          borderRadius="0"
          px="4"
          onChange={handleChange}
          borderColor={errors.password ? "red.500" : "var(--primary-color)"}
          _hover={{
            boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
          }}
          _focus={{
            borderColor: errors.password ? "red.500" : "var(--primary-color)",
          }}
        />
        {errors.password && (
          <Text color="red.500" fontSize="sm">
            {errors.password}
          </Text>
        )}

        <Text fontSize="sm" fontWeight="bold">
          Xác nhận mật khẩu
        </Text>
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Xác nhận mật khẩu"
          required
          bg="#f7f7f7"
          border="1px solid var(--primary-color)"
          color="black"
          borderRadius="0"
          px="4"
          onChange={handleChange}
          borderColor={errors.confirmPassword ? "red.500" : "var(--primary-color)"}
          _hover={{
            boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
          }}
          _focus={{
            borderColor: errors.confirmPassword ? "red.500" : "var(--primary-color)",
          }}
        />
        {errors.confirmPassword && (
          <Text color="red.500" fontSize="sm">
            {errors.confirmPassword}
          </Text>
        )}

        <Text fontSize="sm" fontWeight="bold">
          Họ
        </Text>
        <Input
          type="text"
          name="firstName"
          placeholder="Nhập họ của bạn"
          required
          bg="#f7f7f7"
          border="1px solid var(--primary-color)"
          color="black"
          borderRadius="0"
          px="4"
          onChange={handleChange}
          borderColor={errors.firstName ? "red.500" : "var(--primary-color)"}
          _hover={{
            boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
          }}
          _focus={{
            borderColor: errors.firstName ? "red.500" : "var(--primary-color)",
          }}
        />
        {errors.firstName && (
          <Text color="red.500" fontSize="sm">
            {errors.firstName}
          </Text>
        )}

        <Text fontSize="sm" fontWeight="bold">
          Tên
        </Text>
        <Input
          type="text"
          name="lastName"
          placeholder="Nhập tên của bạn"
          required
          bg="#f7f7f7"
          border="1px solid var(--primary-color)"
          color="black"
          borderRadius="0"
          px="4"
          onChange={handleChange}
          borderColor={errors.lastName ? "red.500" : "var(--primary-color)"}
          _hover={{
            boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
          }}
          _focus={{
            borderColor: errors.lastName ? "red.500" : "var(--primary-color)",
          }}
        />
        {errors.lastName && (
          <Text color="red.500" fontSize="sm">
            {errors.lastName}
          </Text>
        )}

        <Text fontSize="sm" fontWeight="bold">
          Số điện thoại
        </Text>
        <Input
          type="tel"
          name="phone"
          placeholder="Nhập số điện thoại"
          required
          bg="#f7f7f7"
          border="1px solid var(--primary-color)"
          color="black"
          borderRadius="0"
          px="4"
          onChange={handleChange}
          borderColor={errors.phone ? "red.500" : "var(--primary-color)"}
          _hover={{
            boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
          }}
          _focus={{
            borderColor: errors.phone ? "red.500" : "var(--primary-color)",
          }}
        />
        {errors.phone && (
          <Text color="red.500" fontSize="sm">
            {errors.phone}
          </Text>
        )}

        {successMessage && (
          <Text color="green.500" mb={4} mx="auto">
            {successMessage}
          </Text>
        )}

        <Button
          onClick={handleSubmit}
          type="submit"
          variant="solid"
          size="lg"
          mx="auto"
          w={{ base: "80%", sm: "70%", md: "40%" }}
          borderRadius="0"
          isLoading={isLoading}
          loadingText="Đang xử lý"
        >
          Đăng ký
        </Button>

        <Flex justifyContent="center">
          <Text mr={2}>Đã có tài khoản?</Text>
          <Link as={RouterLink} to="/Login" color="blue.500">
            Đăng nhập
          </Link>
        </Flex>
      </Stack>
    </Box>
  );
};

export default Register;