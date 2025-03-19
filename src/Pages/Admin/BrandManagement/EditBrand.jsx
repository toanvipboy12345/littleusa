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
import { Edit2 } from "react-feather";
import axiosInstance from "../../../Api/axiosInstance";

const EditBrand = ({ isOpen, onClose, brand, onEditSuccess }) => {
  const [editedBrand, setEditedBrand] = useState({
    name: "",
    description: "",
    image: null,
  });
  const toast = useToast();

  // Cập nhật state khi mở Modal với dữ liệu của brand
  useEffect(() => {
    if (brand) {
      setEditedBrand({
        name: brand.name || "",
        description: brand.description || "",
        image: null, // Reset image để người dùng có thể tải lại nếu muốn
      });
    }
  }, [brand]);

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBrand((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý upload file hình ảnh
  const handleImageChange = (e) => {
    setEditedBrand((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // Xử lý submit form chỉnh sửa thương hiệu
  const handleSubmit = async (e) => {
    e.preventDefault();

    const brandData = {
      name: editedBrand.name,
      description: editedBrand.description,
    };

    const formData = new FormData();
    formData.append("brand", JSON.stringify(brandData));
    if (editedBrand.image) {
      formData.append("image", editedBrand.image);
    }

    try {
      const response = await axiosInstance.put(`/api/brands/${brand.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast({
          title: "Thành công",
          description: "Đã cập nhật thương hiệu.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right"
        });
        onEditSuccess(response.data);
      }
    } catch (error) {
      const errorMessage = error.response?.data || "Không thể cập nhật thương hiệu.";
      toast({
        title: "Lỗi",
        description: typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Cập nhật thương hiệu
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel color="var(--primary-color)">Tên thương hiệu</FormLabel>
                <Input
                  name="name"
                  value={editedBrand.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên thương hiệu"
                  variant="outline"
                  border="1px solid"
                  color = "Black"
                  borderColor="var(--primary-color)"
                  _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
                />
              </FormControl>
              <FormControl>
                <FormLabel color="var(--primary-color)">Mô tả</FormLabel>
                <Textarea
                  name="description"
                  value={editedBrand.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả thương hiệu"
                  borderColor="var(--primary-color)"
                  _hover={{ borderColor: "var(--hover-color)" }}
                  _focus={{ borderColor: "var(--primary-color)", boxShadow: "0 0 0 1px var(--primary-color)" }}
                  _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
                />
              </FormControl>
              <FormControl>
                <FormLabel color="var(--primary-color)">Hình ảnh</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  variant="outline"
                  border="1px solid"
                  borderColor="var(--primary-color)"
                  bg="transparent"
                  height="auto"
                  p={1}
                  _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white" }}
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
            _dark={{ bg: "gray.700", color: "white", _hover: { bg: "gray.600" }, _active: { bg: "gray.700" } }}
          >
            Lưu
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditBrand;