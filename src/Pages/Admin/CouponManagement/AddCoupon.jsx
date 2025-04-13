import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Button,
  useToast,
  VStack,
  Box,
  Checkbox,
} from "@chakra-ui/react";
import { Plus } from "react-feather";
import axiosInstance from "../../../Api/axiosInstance";

const AddCoupon = ({ onAddSuccess }) => {
  const [newCoupon, setNewCoupon] = useState({
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCoupon((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const couponData = {
      ...newCoupon,
      discountRate: parseInt(newCoupon.discountRate),
      maxUses: parseInt(newCoupon.maxUses),
      usedCount: 0,
      startDate: new Date(newCoupon.startDate).toISOString(),
      endDate: new Date(newCoupon.endDate).toISOString(),
      status: newCoupon.status,
      applicableToDiscountedProducts: newCoupon.applicableToDiscountedProducts,
      usedByUsers: newCoupon.usedByUsers,
      maxDiscountAmount: newCoupon.maxDiscountAmount ? parseFloat(newCoupon.maxDiscountAmount) : null, // Chuyển sang số hoặc null
    };

    try {
      const response = await axiosInstance.post("/api/coupons/manage", couponData);
      if (response.status === 200) {
        setNewCoupon({
          code: "",
          discountRate: "",
          startDate: "",
          endDate: "",
          maxUses: "",
          usedCount: 0,
          status: "ACTIVE",
          applicableToDiscountedProducts: false,
          usedByUsers: "[]",
          maxDiscountAmount: "", // Reset trường mới
        });
        toast({
          title: "Thành công",
          description: "Đã thêm mã giảm giá mới.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        onAddSuccess(response.data);
      }
    } catch (error) {
      // Kiểm tra nếu lỗi là 403 và hiển thị custom message
      const errorMessage = error.customMessage || error.response?.data || "Không thể thêm mã giảm giá.";
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
        <FormControl isRequired>
          <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
            Mã giảm giá
          </FormLabel>
          <Input
            name="code"
            value={newCoupon.code}
            onChange={handleInputChange}
            placeholder="Nhập mã giảm giá"
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

        <FormControl isRequired>
          <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
            Tỷ lệ giảm (%)
          </FormLabel>
          <Input
            name="discountRate"
            value={newCoupon.discountRate}
            onChange={handleInputChange}
            placeholder="Nhập tỷ lệ giảm"
            type="number"
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

        <FormControl isRequired>
          <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
            Ngày bắt đầu
          </FormLabel>
          <Input
            name="startDate"
            value={newCoupon.startDate}
            onChange={handleInputChange}
            type="datetime-local"
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

        <FormControl isRequired>
          <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
            Ngày kết thúc
          </FormLabel>
          <Input
            name="endDate"
            value={newCoupon.endDate}
            onChange={handleInputChange}
            type="datetime-local"
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

        <FormControl isRequired>
          <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
            Số lần sử dụng tối đa
          </FormLabel>
          <Input
            name="maxUses"
            value={newCoupon.maxUses}
            onChange={handleInputChange}
            placeholder="Nhập số lần tối đa"
            type="number"
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
          <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
            Số tiền giảm tối đa (VND)
          </FormLabel>
          <Input
            name="maxDiscountAmount"
            value={newCoupon.maxDiscountAmount}
            onChange={handleInputChange}
            placeholder="Nhập số tiền giảm tối đa (để trống nếu không giới hạn)"
            type="number"
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

        <FormControl isRequired>
          <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
            Trạng thái
          </FormLabel>
          <Select
            name="status"
            value={newCoupon.status}
            onChange={handleInputChange}
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
          >
            <option value="ACTIVE">Hoạt động</option>
            <option value="INACTIVE">Không hoạt động</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
            Áp dụng cho sản phẩm đã giảm giá
          </FormLabel>
          <Checkbox
            name="applicableToDiscountedProducts"
            isChecked={newCoupon.applicableToDiscountedProducts}
            onChange={handleInputChange}
            colorScheme="teal"
            size="md"
            _dark={{
              color: "white",
            }}
          >
            Có
          </Checkbox>
        </FormControl>

        <Button
          leftIcon={<Plus size={20} />}
          variant="solid"
          type="submit"
          isDisabled={
            !newCoupon.code.trim() ||
            !newCoupon.discountRate ||
            !newCoupon.startDate ||
            !newCoupon.endDate ||
            !newCoupon.maxUses ||
            !newCoupon.status
          }
          alignSelf={{ base: "stretch", md: "flex-end" }}
          _dark={{
            bg: "gray.700",
            color: "white",
            _hover: { bg: "gray.600" },
            _active: { bg: "gray.700" },
          }}
        >
          Thêm mã giảm giá
        </Button>
      </VStack>
    </Box>
  );
};

export default AddCoupon;