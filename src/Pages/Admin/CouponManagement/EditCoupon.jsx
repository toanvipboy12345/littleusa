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
  Stack,
  Button,
  useToast,
  Checkbox,
  Select 
} from "@chakra-ui/react";
import { Edit2 } from "react-feather";
import axiosInstance from "../../../Api/axiosInstance";

const EditCoupon = ({ isOpen, onClose, coupon, onEditSuccess }) => {
  const [editedCoupon, setEditedCoupon] = useState({
    code: "",
    discountRate: "",
    startDate: "",
    endDate: "",
    maxUses: "",
    usedCount: 0,
    status: "ACTIVE",
    applicableToDiscountedProducts: false,
    usedByUsers: "[]",
    maxDiscountAmount: "", // Thêm trường mới
  });
  const toast = useToast();

  useEffect(() => {
    if (coupon) {
      setEditedCoupon({
        id: coupon.id,
        code: coupon.code || "",
        discountRate: coupon.discountRate || "",
        startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split("T")[0] : "",
        endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split("T")[0] : "",
        maxUses: coupon.maxUses || "",
        usedCount: coupon.usedCount || 0,
        status: coupon.status || "ACTIVE",
        applicableToDiscountedProducts: coupon.applicableToDiscountedProducts || false,
        usedByUsers: coupon.usedByUsers || "[]",
        maxDiscountAmount: coupon.maxDiscountAmount || "", // Load giá trị từ coupon
      });
    }
  }, [coupon]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedCoupon((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      { name: "code", label: "Mã giảm giá" },
      { name: "discountRate", label: "Tỷ lệ giảm (%)" },
      { name: "startDate", label: "Ngày bắt đầu" },
      { name: "endDate", label: "Ngày kết thúc" },
      { name: "maxUses", label: "Số lần sử dụng tối đa" },
      { name: "status", label: "Trạng thái" },
    ];

    for (const field of requiredFields) {
      if (!editedCoupon[field.name] || editedCoupon[field.name].toString().trim() === "") {
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

    // Kiểm tra ngày kết thúc phải lớn hơn ngày bắt đầu
    if (new Date(editedCoupon.endDate) <= new Date(editedCoupon.startDate)) {
      toast({
        title: "Lỗi",
        description: "Ngày kết thúc phải lớn hơn ngày bắt đầu.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return false;
    }

    // Kiểm tra tỷ lệ giảm phải là số dương và không vượt quá 100
    const discountRate = parseInt(editedCoupon.discountRate);
    if (isNaN(discountRate) || discountRate <= 0 || discountRate > 100) {
      toast({
        title: "Lỗi",
        description: "Tỷ lệ giảm phải là số dương và không vượt quá 100%.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return false;
    }

    // Kiểm tra số lần sử dụng tối đa phải là số dương
    const maxUses = parseInt(editedCoupon.maxUses);
    if (isNaN(maxUses) || maxUses <= 0) {
      toast({
        title: "Lỗi",
        description: "Số lần sử dụng tối đa phải là số dương.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return false;
    }

    // Kiểm tra maxDiscountAmount nếu có giá trị thì phải là số dương
    if (editedCoupon.maxDiscountAmount) {
      const maxDiscountAmount = parseFloat(editedCoupon.maxDiscountAmount);
      if (isNaN(maxDiscountAmount) || maxDiscountAmount <= 0) {
        toast({
          title: "Lỗi",
          description: "Số tiền giảm tối đa phải là số dương.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra validation trước khi gửi request
    if (!validateForm()) {
      return;
    }

    const couponData = {
      ...editedCoupon,
      discountRate: parseInt(editedCoupon.discountRate),
      maxUses: parseInt(editedCoupon.maxUses),
      startDate: new Date(editedCoupon.startDate).toISOString(),
      endDate: new Date(editedCoupon.endDate).toISOString(),
      maxDiscountAmount: editedCoupon.maxDiscountAmount ? parseFloat(editedCoupon.maxDiscountAmount) : null, // Chuyển sang số hoặc null
    };

    try {
      const response = await axiosInstance.put(`/api/coupons/manage/${coupon.id}`, couponData);
      if (response.status === 200) {
        toast({
          title: "Thành công",
          description: "Đã cập nhật mã giảm giá.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        onEditSuccess(response.data);
        onClose(); // Đóng modal sau khi thành công
      }
    } catch (error) {
      // Kiểm tra nếu lỗi là 403 và hiển thị custom message
      const errorMessage = error.customMessage || error.response?.data || "Không thể cập nhật mã giảm giá.";
      toast({
        title: "Lỗi",
        description: typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage),
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
        <ModalHeader>Cập nhật mã giảm giá</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel color="var(--primary-color)">Mã giảm giá</FormLabel>
                <Input
                  name="code"
                  value={editedCoupon.code}
                  onChange={handleInputChange}
                  placeholder="Nhập mã giảm giá"
                  variant="outline"
                  border="1px solid"
                  borderColor="var(--primary-color)"
                  _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel color="var(--primary-color)">Tỷ lệ giảm (%)</FormLabel>
                <Input
                  name="discountRate"
                  value={editedCoupon.discountRate}
                  onChange={handleInputChange}
                  placeholder="Nhập tỷ lệ giảm"
                  type="number"
                  variant="outline"
                  border="1px solid"
                  borderColor="var(--primary-color)"
                  _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel color="var(--primary-color)">Ngày bắt đầu</FormLabel>
                <Input
                  name="startDate"
                  value={editedCoupon.startDate}
                  onChange={handleInputChange}
                  type="date"
                  variant="outline"
                  border="1px solid"
                  borderColor="var(--primary-color)"
                  _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel color="var(--primary-color)">Ngày kết thúc</FormLabel>
                <Input
                  name="endDate"
                  value={editedCoupon.endDate}
                  onChange={handleInputChange}
                  type="date"
                  variant="outline"
                  border="1px solid"
                  borderColor="var(--primary-color)"
                  _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel color="var(--primary-color)">Số lần sử dụng tối đa</FormLabel>
                <Input
                  name="maxUses"
                  value={editedCoupon.maxUses}
                  onChange={handleInputChange}
                  placeholder="Nhập số lần tối đa"
                  type="number"
                  variant="outline"
                  border="1px solid"
                  borderColor="var(--primary-color)"
                  _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
                />
              </FormControl>
              <FormControl>
                <FormLabel color="var(--primary-color)">Số tiền giảm tối đa (VND)</FormLabel>
                <Input
                  name="maxDiscountAmount"
                  value={editedCoupon.maxDiscountAmount}
                  onChange={handleInputChange}
                  placeholder="Nhập số tiền giảm tối đa (để trống nếu không giới hạn)"
                  type="number"
                  variant="outline"
                  border="1px solid"
                  borderColor="var(--primary-color)"
                  _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel color="var(--primary-color)">Trạng thái</FormLabel>
                <Select
                  name="status"
                  value={editedCoupon.status}
                  onChange={handleInputChange}
                  variant="outline"
                  border="1px solid"
                  borderColor="var(--primary-color)"
                  _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
                >
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="INACTIVE">Không hoạt động</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel color="var(--primary-color)">Áp dụng cho sản phẩm đã giảm giá</FormLabel>
                <Checkbox
                  name="applicableToDiscountedProducts"
                  isChecked={editedCoupon.applicableToDiscountedProducts}
                  onChange={handleInputChange}
                  colorScheme="teal"
                  _dark={{ color: "white" }}
                >
                  Có
                </Checkbox>
              </FormControl>
              <FormControl>
                <FormLabel color="var(--primary-color)">Người dùng đã sử dụng (Read-only)</FormLabel>
                <Input
                  name="usedByUsers"
                  value={editedCoupon.usedByUsers}
                  isReadOnly
                  placeholder="Danh sách userId (tự động cập nhật)"
                  variant="outline"
                  border="1px solid"
                  borderColor="var(--primary-color)"
                  _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
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

export default EditCoupon;