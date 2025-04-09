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
} from "@chakra-ui/react";
import { Plus } from "react-feather";
import axiosInstance from "../../../Api/axiosInstance";

const AddShippingMethod = ({ onAddSuccess }) => {
  const [newShippingMethod, setNewShippingMethod] = useState({
    code: "",
    name: "",
    shippingFee: "",
    status: "ACTIVE",
  });
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShippingMethod((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const shippingMethodData = {
      ...newShippingMethod,
      shippingFee: parseFloat(newShippingMethod.shippingFee), // Chuyển sang số thực
    };

    try {
      const response = await axiosInstance.post("/api/shipping-methods", shippingMethodData);
      if (response.status === 200) {
        setNewShippingMethod({
          code: "",
          name: "",
          shippingFee: "",
          status: "ACTIVE",
        });
        toast({
          title: "Thành công",
          description: "Đã thêm đơn vị vận chuyển mới.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        onAddSuccess(response.data);
      }
    } catch (error) {
      const errorMessage = error.response?.data || "Không thể thêm đơn vị vận chuyển.";
      toast({
        title: "Lỗi",
        description:
          typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage),
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
        <FormControl isRequired>
          <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
            Mã đơn vị vận chuyển
          </FormLabel>
          <Input
            name="code"
            value={newShippingMethod.code}
            onChange={handleInputChange}
            placeholder="Nhập mã"
            variant="outline"
            border="1px solid"
            borderColor="var(--primary-color)"
            bg="transparent"
            color="black"
            fontSize={{ base: "sm", md: "md" }}
            size="md"
            _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
            _focus={{ borderColor: "var(--primary-color)", boxShadow: "0 0 0 1px var(--primary-color)" }}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
            Tên đơn vị vận chuyển
          </FormLabel>
          <Input
            name="name"
            value={newShippingMethod.name}
            onChange={handleInputChange}
            placeholder="Nhập tên"
            variant="outline"
            border="1px solid"
            borderColor="var(--primary-color)"
            bg="transparent"
            color="black"
            fontSize={{ base: "sm", md: "md" }}
            size="md"
            _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
            _focus={{ borderColor: "var(--primary-color)", boxShadow: "0 0 0 1px var(--primary-color)" }}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
            Phí vận chuyển (VND)
          </FormLabel>
          <Input
            name="shippingFee"
            value={newShippingMethod.shippingFee}
            onChange={handleInputChange}
            placeholder="Nhập phí vận chuyển"
            type="number"
            step="0.01"
            variant="outline"
            border="1px solid"
            borderColor="var(--primary-color)"
            bg="transparent"
            color="black"
            fontSize={{ base: "sm", md: "md" }}
            size="md"
            _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
            _focus={{ borderColor: "var(--primary-color)", boxShadow: "0 0 0 1px var(--primary-color)" }}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
            Trạng thái
          </FormLabel>
          <Select
            name="status"
            value={newShippingMethod.status}
            onChange={handleInputChange}
            variant="outline"
            border="1px solid"
            borderColor="var(--primary-color)"
            bg="transparent"
            color="black"
            fontSize={{ base: "sm", md: "md" }}
            size="md"
            _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
            _focus={{ borderColor: "var(--primary-color)", boxShadow: "0 0 0 1px var(--primary-color)" }}
          >
            <option value="ACTIVE">Hoạt động</option>
            <option value="INACTIVE">Không hoạt động</option>
          </Select>
        </FormControl>

        <Button
          leftIcon={<Plus size={20} />}
          variant="solid"
          type="submit"
          isDisabled={!newShippingMethod.code.trim() || !newShippingMethod.name || !newShippingMethod.shippingFee || !newShippingMethod.status}
          bg="var(--primary-color)"
          color="var(--text-color)"
          size="md"
          w={{ base: "full", md: "auto" }}
          alignSelf={{ base: "stretch", md: "flex-end" }}
          _hover={{ bg: "var(--hover-color)" }}
          _active={{ bg: "var(--primary-color)" }}
          _dark={{ bg: "gray.700", color: "white", _hover: { bg: "gray.600" }, _active: { bg: "gray.700" } }}
        >
          Thêm đơn vị vận chuyển
        </Button>
      </VStack>
    </Box>
  );
};

export default AddShippingMethod;