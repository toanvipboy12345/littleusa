import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Button,
  useToast,
} from "@chakra-ui/react";
import axiosInstance from "../../../Api/axiosInstance";

const EditCategory = ({ isOpen, onClose, category, onEditSuccess }) => {
  const [editedCategory, setEditedCategory] = useState({
    name: "",
    description: "",
  });
  const toast = useToast();

  // Cập nhật state khi mở Modal với dữ liệu của category
  useEffect(() => {
    if (category) {
      setEditedCategory({
        name: category.name || "",
        description: category.description || "",
      });
    }
  }, [category]);

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCategory((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý submit form chỉnh sửa danh mục
  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryData = {
      name: editedCategory.name,
      description: editedCategory.description,
    };

    try {
      const response = await axiosInstance.put(`/api/categories/${category.id}`, categoryData);

      if (response.status === 200) {
        toast({
          title: "Thành công",
          description: "Đã cập nhật danh mục.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        onEditSuccess(response.data);
      }
    } catch (error) {
      // Kiểm tra customMessage từ interceptor
      const errorMessage = error.customMessage || error.response?.data || "Không thể cập nhật danh mục.";
      toast({
        title: "Lỗi",
        description:
          typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage),
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right", // Đặt vị trí thông báo ở góc trên bên phải
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cập nhật danh mục</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel color="var(--primary-color)">Tên danh mục</FormLabel>
                <Input
                  name="name"
                  value={editedCategory.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên danh mục"
                  variant="outline"
                  border="1px solid"
                  color="black"
                  borderColor="var(--primary-color)"
                  _dark={{
                    bg: "gray.800",
                    borderColor: "gray.600",
                    color: "white",
                    _placeholder: { color: "gray.400" },
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel color="var(--primary-color)">Mô tả</FormLabel>
                <Textarea
                  name="description"
                  value={editedCategory.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả danh mục"
                  borderColor="var(--primary-color)"
                  _hover={{ borderColor: "var(--hover-color)" }}
                  _focus={{
                    borderColor: "var(--primary-color)",
                    boxShadow: "0 0 0 1px var(--primary-color)",
                  }}
                  _dark={{
                    bg: "gray.800",
                    borderColor: "gray.600",
                    color: "white",
                    _placeholder: { color: "gray.400" },
                  }}
                />
              </FormControl>
            </Stack>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} variant="ghost">
            Hủy
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            ml={3}
            variant="solid"
            bg="var(--primary-color)"
            color="var(--text-color)"
            _hover={{ bg: "var(--hover-color)" }}
            _active={{ bg: "var(--primary-color)" }}
            _dark={{
              bg: "gray.700",
              color: "white",
              _hover: { bg: "gray.600" },
              _active: { bg: "gray.700" },
            }}
          >
            Lưu
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCategory;