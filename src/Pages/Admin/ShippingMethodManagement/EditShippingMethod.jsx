import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axiosInstance from "../../../Api/axiosInstance";

const EditShippingMethod = ({ isOpen, onClose, shippingMethod, onEditSuccess }) => {
  const [editedShippingMethod, setEditedShippingMethod] = useState({
    id: "",
    code: "",
    name: "",
    shippingFee: "",
    status: "ACTIVE",
  });
  const toast = useToast();

  // Đồng bộ editedShippingMethod với shippingMethod mỗi khi shippingMethod hoặc isOpen thay đổi
  useEffect(() => {
    if (isOpen && shippingMethod) {
      setEditedShippingMethod({
        id: shippingMethod.id || "",
        code: shippingMethod.code || "",
        name: shippingMethod.name || "",
        shippingFee: shippingMethod.shippingFee?.toString() || "", // Chuyển sang string để hiển thị trên input
        status: shippingMethod.status || "ACTIVE",
      });
    }
  }, [isOpen, shippingMethod]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedShippingMethod((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      { name: "code", label: "Mã đơn vị vận chuyển" },
      { name: "name", label: "Tên đơn vị vận chuyển" },
      { name: "shippingFee", label: "Phí vận chuyển" },
      { name: "status", label: "Trạng thái" },
    ];

    // Kiểm tra các trường bắt buộc không được để trống
    for (const field of requiredFields) {
      if (!editedShippingMethod[field.name] || editedShippingMethod[field.name].toString().trim() === "") {
        toast({
          title: "Lỗi",
          description: `Vui lòng nhập ${field.label}.`,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        return false;
      }
    }

    // Kiểm tra phí vận chuyển phải là số dương
    const shippingFee = parseFloat(editedShippingMethod.shippingFee);
    if (isNaN(shippingFee) || shippingFee <= 0) {
      toast({
        title: "Lỗi",
        description: "Phí vận chuyển phải là số dương.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!editedShippingMethod.id) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy ID đơn vị vận chuyển để cập nhật.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    // Kiểm tra validation trước khi gửi request
    if (!validateForm()) {
      return;
    }

    const shippingMethodData = {
      ...editedShippingMethod,
      shippingFee: parseFloat(editedShippingMethod.shippingFee),
    };

    try {
      const response = await axiosInstance.put(`/api/shipping-methods/${editedShippingMethod.id}`, shippingMethodData);
      if (response.status === 200) {
        toast({
          title: "Thành công",
          description: "Đã cập nhật đơn vị vận chuyển.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        onEditSuccess(response.data);
        onClose();
      }
    } catch (error) {
      // Kiểm tra nếu lỗi là 403 và hiển thị custom message
      const errorMessage = error.customMessage || (error.response?.data || "Không thể cập nhật đơn vị vận chuyển.");
      toast({
        title: "Lỗi",
        description:
          typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage),
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
        <ModalHeader>Sửa đơn vị vận chuyển</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Mã đơn vị vận chuyển</FormLabel>
              <Input
                name="code"
                value={editedShippingMethod.code}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Tên đơn vị vận chuyển</FormLabel>
              <Input
                name="name"
                value={editedShippingMethod.name}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Phí vận chuyển (VND)</FormLabel>
              <Input
                name="shippingFee"
                value={editedShippingMethod.shippingFee}
                onChange={handleInputChange}
                type="number"
                step="0.01"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Trạng thái</FormLabel>
              <Select
                name="status"
                value={editedShippingMethod.status}
                onChange={handleInputChange}
              >
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Không hoạt động</option>
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>
            Lưu
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditShippingMethod;