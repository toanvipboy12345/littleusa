import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import axiosInstance from "../../../Api/axiosInstance";

const EditAdmin = ({ isOpen, onClose, admin, onEditSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: admin?.firstName || "",
    lastName: admin?.lastName || "",
    phone: admin?.phone || "",
    username: admin?.username || "",
  });
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const updatedAdmin = {
        ...admin,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        username: formData.username,
      };
      const response = await axiosInstance.put(`/user/${admin.id}`, updatedAdmin);
      onEditSuccess(response.data);
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin admin.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      const errorMessage =
        error.customMessage ||
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Không thể cập nhật admin.";
      toast({
        title: "Lỗi",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chỉnh sửa admin</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Họ</FormLabel>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Nhập họ..."
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Tên</FormLabel>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Nhập tên..."
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Số điện thoại</FormLabel>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại..."
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Tên đăng nhập</FormLabel>
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập..."
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit} ml={3}>
            Lưu
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditAdmin;