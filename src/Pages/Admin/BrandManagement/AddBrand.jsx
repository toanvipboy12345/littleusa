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

const AddBrand = ({ onAddSuccess }) => {
  const [newBrand, setNewBrand] = useState({
    name: "",
    description: "",
    image: null,
  });
  const toast = useToast();

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBrand((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý upload file hình ảnh
  const handleImageChange = (e) => {
    setNewBrand((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // Xử lý submit form thêm thương hiệu
  const handleSubmit = async (e) => {
    e.preventDefault();

    const brandData = {
      name: newBrand.name,
      description: newBrand.description,
    };

    const formData = new FormData();
    formData.append("brand", JSON.stringify(brandData));
    if (newBrand.image) {
      formData.append("image", newBrand.image);
    }

    try {
      const response = await axiosInstance.post("/api/brands/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setNewBrand({ name: "", description: "", image: null });
        toast({
          title: "Thành công",
          description: "Đã thêm thương hiệu mới.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        onAddSuccess(response.data);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data || "Không thể thêm thương hiệu.";
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
      maxW={{ base: "100%", md: "600px", lg: "1200px" }} // Giới hạn chiều rộng tối đa trên các kích thước màn hình
      mx="auto" // Căn giữa form
      p={{ base: 4, md: 6 }} // Padding thay đổi theo kích thước màn hình
      bg="transparent"
      _dark={{ bg: "gray.900" }}
    >
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        {/* FormControl cho Tên thương hiệu */}
        <FormControl isRequired>
          <FormLabel
            color="var(--primary-color)"
            _dark={{ color: "white" }}
            fontSize={{ base: "sm", md: "md" }} // Điều chỉnh kích thước chữ theo màn hình
          >
            Tên thương hiệu
          </FormLabel>
          <Input
            name="name"
            value={newBrand.name}
            onChange={handleInputChange}
            placeholder="Nhập tên thương hiệu"
            variant="outline"
            border="1px solid"
            borderColor="var(--primary-color)"
            bg="transparent"
            color="black"
            fontSize={{ base: "sm", md: "md" }}
            size="md" // Kích thước cố định, không quá nhỏ
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
            value={newBrand.description}
            onChange={handleInputChange}
            placeholder="Nhập mô tả thương hiệu"
            borderColor="var(--primary-color)"
            bg="transparent"
            color="black"
            fontSize={{ base: "sm", md: "md" }}
            size="md"
            height="200px"
            rows={4} // Số dòng mặc định, tránh quá cao hoặc quá thấp
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

        {/* FormControl cho Hình ảnh */}
        <FormControl>
          <FormLabel
            color="var(--primary-color)"
            _dark={{ color: "white" }}
            fontSize={{ base: "sm", md: "md" }}
          >
            Hình ảnh
          </FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            variant="outline"
            border="1px solid"
            borderColor="var(--primary-color)"
            bg="transparent"
            color="black"
            fontSize={{ base: "sm", md: "md" }}
            size="md"
            p={1} // Padding nhỏ để không quá dày
            _dark={{
              bg: "gray.800",
              borderColor: "gray.600",
              color: "white",
            }}
            _focus={{
              borderColor: "var(--primary-color)",
              boxShadow: "0 0 0 1px var(--primary-color)",
            }}
          />
        </FormControl>

        {/* Nút Thêm thương hiệu */}
        <Button
          leftIcon={<Plus size={20} />}
          variant="solid"
          type="submit"
          isDisabled={!newBrand.name.trim()}
          bg="var(--primary-color)"
          color="var(--text-color)"
          size="md" // Kích thước nút trung bình
          w={{ base: "full", md: "auto" }} // Toàn chiều rộng trên mobile, tự động trên desktop
          alignSelf={{ base: "stretch", md: "flex-end" }} // Căn phải trên desktop
          _hover={{ bg: "var(--hover-color)" }}
          _active={{ bg: "var(--primary-color)" }}
          _dark={{
            bg: "gray.700",
            color: "white",
            _hover: { bg: "gray.600" },
            _active: { bg: "gray.700" },
          }}
        >
          Thêm thương hiệu
        </Button>
      </VStack>
    </Box>
  );
};

export default AddBrand;