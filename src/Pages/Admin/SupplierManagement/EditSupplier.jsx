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
  FormErrorMessage,
} from "@chakra-ui/react";
import { Edit2 } from "react-feather";
import axiosInstance from "../../../Api/axiosInstance";

const EditSupplier = ({ isOpen, onClose, supplier, onEditSuccess }) => {
  const [editedSupplier, setEditedSupplier] = useState({
    name: "",
    code: "",
    contact: "",
    address: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const toast = useToast();

  // Update state when modal opens with supplier data
  useEffect(() => {
    if (supplier) {
      setEditedSupplier({
        name: supplier.name || "",
        code: supplier.code || "",
        contact: supplier.contact || "",
        address: supplier.address || "",
        phone: supplier.phone || "",
      });
      setErrors({}); // Reset errors when modal opens
    }
  }, [supplier]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedSupplier((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi khi người dùng bắt đầu nhập
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!editedSupplier.name.trim()) {
      newErrors.name = "Tên nhà cung cấp là bắt buộc";
    }
    if (!editedSupplier.code.trim()) {
      newErrors.code = "Mã nhà cung cấp là bắt buộc";
    }
    if (editedSupplier.phone && !/^\d{10,11}$/.test(editedSupplier.phone)) {
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
      name: editedSupplier.name,
      code: editedSupplier.code,
      contact: editedSupplier.contact,
      address: editedSupplier.address,
      phone: editedSupplier.phone,
    };

    try {
      const response = await axiosInstance.put(`/api/suppliers/${supplier.id}`, supplierData);

      if (response.status === 200) {
        toast({
          title: "Thành công",
          description: "Đã cập nhật nhà cung cấp.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        onEditSuccess(response.data);
      }
    } catch (error) {
      // Kiểm tra customMessage từ interceptor
      const errorMessage = error.customMessage || error.response?.data || "Không thể cập nhật nhà cung cấp.";
      toast({
        title: "Lỗi",
        description: typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage),
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
        <ModalHeader>Cập nhật nhà cung cấp</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired isInvalid={!!errors.name}>
                <FormLabel color="var(--primary-color)">Tên nhà cung cấp</FormLabel>
                <Input
                  name="name"
                  value={editedSupplier.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên nhà cung cấp"
                  variant="outline"
                  border="1px solid"
                  color="black"
                  borderColor="var(--primary-color)"
                  _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.code}>
                <FormLabel color="var(--primary-color)">Mã nhà cung cấp</FormLabel>
                <Input
                  name="code"
                  value={editedSupplier.code}
                  onChange={handleInputChange}
                  placeholder="Nhập mã nhà cung cấp"
                  variant="outline"
                  border="1px solid"
                  color="black"
                  borderColor="var(--primary-color)"
                  _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
                />
                <FormErrorMessage>{errors.code}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel color="var(--primary-color)">Liên hệ</FormLabel>
                <Input
                  name="contact"
                  value={editedSupplier.contact}
                  onChange={handleInputChange}
                  placeholder="Nhập thông tin liên hệ"
                  variant="outline"
                  border="1px solid"
                  color="black"
                  borderColor="var(--primary-color)"
                  _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color="var(--primary-color)">Địa chỉ</FormLabel>
                <Textarea
                  name="address"
                  value={editedSupplier.address}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ nhà cung cấp"
                  borderColor="var(--primary-color)"
                  _hover={{ borderColor: "var(--hover-color)" }}
                  _focus={{ borderColor: "var(--primary-color)", boxShadow: "0 0 0 1px var(--primary-color)" }}
                  _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.phone}>
                <FormLabel color="var(--primary-color)">Số điện thoại</FormLabel>
                <Input
                  name="phone"
                  value={editedSupplier.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  variant="outline"
                  border="1px solid"
                  color="black"
                  borderColor="var(--primary-color)"
                  _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
                />
                <FormErrorMessage>{errors.phone}</FormErrorMessage>
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

export default EditSupplier;