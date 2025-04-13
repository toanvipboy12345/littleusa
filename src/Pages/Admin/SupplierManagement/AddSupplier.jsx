import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Button,
  useToast,
  VStack,
  Box,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Plus } from "react-feather";
import axiosInstance from "../../../Api/axiosInstance";

const AddSupplier = ({ onAddSuccess }) => {
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    code: "",
    contact: "",
    address: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const toast = useToast();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi khi người dùng bắt đầu nhập
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!newSupplier.name.trim()) {
      newErrors.name = "Tên nhà cung cấp là bắt buộc";
    }
    if (!newSupplier.code.trim()) {
      newErrors.code = "Mã nhà cung cấp là bắt buộc";
    }
    if (newSupplier.phone && !/^\d{10,11}$/.test(newSupplier.phone)) {
      newErrors.phone = "Số điện thoại phải có 10-11 chữ số";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const supplierData = {
      name: newSupplier.name,
      code: newSupplier.code,
      contact: newSupplier.contact,
      address: newSupplier.address,
      phone: newSupplier.phone,
    };

    try {
      const response = await axiosInstance.post("/api/suppliers", supplierData);

      if (response.status === 201) {
        setNewSupplier({ name: "", code: "", contact: "", address: "", phone: "" });
        setErrors({});
        toast({
          title: "Thành công",
          description: "Đã thêm nhà cung cấp mới.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        onAddSuccess(response.data);
      }
    } catch (error) {
      // Kiểm tra customMessage từ interceptor
      const errorMessage = error.customMessage || error.response?.data || "Không thể thêm nhà cung cấp.";
      toast({
        title: "Lỗi",
        description:
          typeof errorMessage === "string"
            ? errorMessage
            : JSON.stringify(errorMessage),
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      maxW={{ base: "100%", md: "600px", lg: "1200px" }}
      mx="auto"
      p={{ base: 4, md: 6 }}
      bg="transparent"
      _dark={{ bg: "gray.900" }}
    >
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        <FormControl isRequired isInvalid={!!errors.name}>
          <FormLabel
            color="var(--primary-color)"
            _dark={{ color: "white" }}
            fontSize={{ base: "sm", md: "md" }}
          >
            Tên nhà cung cấp
          </FormLabel>
          <Input
            name="name"
            value={newSupplier.name}
            onChange={handleInputChange}
            placeholder="Nhập tên nhà cung cấp"
            variant="outline"
            border="1px solid"
            borderColor="var(--primary-color)"
            bg="transparent"
            color="black"
            fontSize={{ base: "sm", md: "md" }}
            size="md"
            _dark={{
              bg: "gray.800",
              borderColor: "gray.600",
              color: "white",
              _placeholder: { color: "gray.400" },
            }}
            _focus={{
              borderColor: "var(--primary-color)",
              boxShadow: "0 0 0 1px var(--primary-color)",
            }}
          />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.code}>
          <FormLabel
            color="var(--primary-color)"
            _dark={{ color: "white" }}
            fontSize={{ base: "sm", md: "md" }}
          >
            Mã nhà cung cấp
          </FormLabel>
          <Input
            name="code"
            value={newSupplier.code}
            onChange={handleInputChange}
            placeholder="Nhập mã nhà cung cấp"
            variant="outline"
            border="1px solid"
            borderColor="var(--primary-color)"
            bg="transparent"
            color="black"
            fontSize={{ base: "sm", md: "md" }}
            size="md"
            _dark={{
              bg: "gray.800",
              borderColor: "gray.600",
              color: "white",
              _placeholder: { color: "gray.400" },
            }}
            _focus={{
              borderColor: "var(--primary-color)",
              boxShadow: "0 0 0 1px var(--primary-color)",
            }}
          />
          <FormErrorMessage>{errors.code}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel
            color="var(--primary-color)"
            _dark={{ color: "white" }}
            fontSize={{ base: "sm", md: "md" }}
          >
            Liên hệ
          </FormLabel>
          <Input
            name="contact"
            value={newSupplier.contact}
            onChange={handleInputChange}
            placeholder="Nhập thông tin liên hệ"
            variant="outline"
            border="1px solid"
            borderColor="var(--primary-color)"
            bg="transparent"
            color="black"
            fontSize={{ base: "sm", md: "md" }}
            size="md"
            _dark={{
              bg: "gray.800",
              borderColor: "gray.600",
              color: "white",
              _placeholder: { color: "gray.400" },
            }}
            _focus={{
              borderColor: "var(--primary-color)",
              boxShadow: "0 0 0 1px var(--primary-color)",
            }}
          />
        </FormControl>

        <FormControl>
          <FormLabel
            color="var(--primary-color)"
            _dark={{ color: "white" }}
            fontSize={{ base: "sm", md: "md" }}
          >
            Địa chỉ
          </FormLabel>
          <Textarea
            name="address"
            value={newSupplier.address}
            onChange={handleInputChange}
            placeholder="Nhập địa chỉ nhà cung cấp"
            borderColor="var(--primary-color)"
            bg="transparent"
            color="black"
            fontSize={{ base: "sm", md: "md" }}
            size="md"
            height="200px"
            rows={4}
            _dark={{
              bg: "gray.800",
              borderColor: "gray.600",
              color: "white",
              _placeholder: { color: "gray.400" },
            }}
            _hover={{ borderColor: "var(--hover-color)" }}
            _focus={{
              borderColor: "var(--primary-color)",
              boxShadow: "0 0 0 1px var(--primary-color)",
            }}
          />
        </FormControl>

        <FormControl isInvalid={!!errors.phone}>
          <FormLabel
            color="var(--primary-color)"
            _dark={{ color: "white" }}
            fontSize={{ base: "sm", md: "md" }}
          >
            Số điện thoại
          </FormLabel>
          <Input
            name="phone"
            value={newSupplier.phone}
            onChange={handleInputChange}
            placeholder="Nhập số điện thoại"
            variant="outline"
            border="1px solid"
            borderColor="var(--primary-color)"
            bg="transparent"
            color="black"
            fontSize={{ base: "sm", md: "md" }}
            size="md"
            _dark={{
              bg: "gray.800",
              borderColor: "gray.600",
              color: "white",
              _placeholder: { color: "gray.400" },
            }}
            _focus={{
              borderColor: "var(--primary-color)",
              boxShadow: "0 0 0 1px var(--primary-color)",
            }}
          />
          <FormErrorMessage>{errors.phone}</FormErrorMessage>
        </FormControl>

        <Button
          leftIcon={<Plus size={20} />}
          variant="solid"
          type="submit"
          isDisabled={!newSupplier.name.trim() || !newSupplier.code.trim()}
          bg="var(--primary-color)"
          color="var(--text-color)"
          size="md"
          w={{ base: "full", md: "auto" }}
          alignSelf={{ base: "stretch", md: "flex-end" }}
          _hover={{ bg: "var(--hover-color)" }}
          _active={{ bg: "var(--primary-color)" }}
          _dark={{
            bg: "gray.700",
            color: "white",
            _hover: { bg: "gray.600" },
            _active: { bg: "gray.700" },
          }}
        >
          Thêm nhà cung cấp
        </Button>
      </VStack>
    </Box>
  );
};

export default AddSupplier;