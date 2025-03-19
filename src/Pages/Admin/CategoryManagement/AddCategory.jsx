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
} from "@chakra-ui/react";
import { Plus } from "react-feather";
import axiosInstance from "../../../Api/axiosInstance";

const AddCategory = ({ onAddSuccess }) => {
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const toast = useToast();

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý submit form thêm danh mục
  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryData = {
      name: newCategory.name,
      description: newCategory.description,
    };

    try {
      const response = await axiosInstance.post("/api/categories", categoryData);

      if (response.status === 201) {
        setNewCategory({ name: "", description: "" });
        toast({
          title: "Thành công",
          description: "Đã thêm danh mục mới.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        onAddSuccess(response.data);
      }
    } catch (error) {
      const errorMessage = error.response?.data || "Không thể thêm danh mục.";
      toast({
        title: "Lỗi",
        description:
          typeof errorMessage === "string"
            ? errorMessage
            : JSON.stringify(errorMessage),
        status: "error",
        duration: 3000,
        isClosable: true,
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
        {/* FormControl cho Tên danh mục */}
        <FormControl isRequired>
          <FormLabel
            color="var(--primary-color)"
            _dark={{ color: "white" }}
            fontSize={{ base: "sm", md: "md" }}
          >
            Tên danh mục
          </FormLabel>
          <Input
            name="name"
            value={newCategory.name}
            onChange={handleInputChange}
            placeholder="Nhập tên danh mục"
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

        {/* FormControl cho Mô tả */}
        <FormControl>
          <FormLabel
            color="var(--primary-color)"
            _dark={{ color: "white" }}
            fontSize={{ base: "sm", md: "md" }}
          >
            Mô tả
          </FormLabel>
          <Textarea
            name="description"
            value={newCategory.description}
            onChange={handleInputChange}
            placeholder="Nhập mô tả danh mục"
            borderColor="var(--primary-color)"
            bg="transparent"
            color="black"
            fontSize={{ base: "sm", md: "md" }}
            size="md"
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

        {/* Nút Thêm danh mục */}
        <Button
          leftIcon={<Plus size={20} />}
          variant="solid"
          type="submit"
          isDisabled={!newCategory.name.trim()}
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
          Thêm danh mục
        </Button>
      </VStack>
    </Box>
  );
};

export default AddCategory;