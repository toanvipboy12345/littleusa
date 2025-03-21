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
  HStack,
  Select,
} from "@chakra-ui/react";
import axiosInstance from "../../../Api/axiosInstance";

const EditProduct = ({ isOpen, onClose, product, onEditSuccess, brands, categories }) => {
  const [editedProduct, setEditedProduct] = useState({
    code: "",
    brandId: "",
    categoryId: "",
    name: "",
    price: "",
    discountRate: "",
    description: "",
  });
  const toast = useToast();

  useEffect(() => {
    if (product) {
      setEditedProduct({
        code: product.code || "",
        brandId: product.brandId?.toString() || "",
        categoryId: product.categoryId?.toString() || "",
        name: product.name || "",
        price: product.price?.toString() || "",
        discountRate: product.discountRate?.toString() || "",
        description: product.description || "",
      });
    }
  }, [product]);

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => {
      const updatedProduct = { ...prev, [name]: value };
      if (name === "price" || name === "discountRate") {
        const price = parseFloat(updatedProduct.price || 0);
        const discountRate = parseFloat(updatedProduct.discountRate || 0);
        if (!isNaN(price) && !isNaN(discountRate)) {
          updatedProduct.discountPrice = (price - price * (discountRate / 100)).toFixed(2);
        } else {
          updatedProduct.discountPrice = "";
        }
      }
      return updatedProduct;
    });
  };

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit called");

    if (!product || !product.id) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy ID sản phẩm để cập nhật.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    const productData = {
      code: editedProduct.code,
      brandId: parseInt(editedProduct.brandId, 10) || null,
      categoryId: parseInt(editedProduct.categoryId, 10) || null,
      name: editedProduct.name,
      price: parseFloat(editedProduct.price) || 0,
      discountRate: parseFloat(editedProduct.discountRate) || 0,
      description: editedProduct.description,
    };

    console.log("Product data to send:", productData);

    try {
      const formData = new FormData();
      formData.append("product", JSON.stringify(productData));
      const response = await axiosInstance.put(`/api/products/${product.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin sản phẩm.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      onEditSuccess(response.data);
      onClose();
    } catch (error) {
      const errorMessage =error.customMessage ||"Lỗi không xác định";

      toast({
        title: "Đã có lỗi xảy ra",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxH="80vh" overflowY="auto">
        <ModalHeader>Cập nhật thông tin sản phẩm</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={4}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <HStack spacing={4} align="flex-start" flexWrap="wrap" justifyContent={{ base: "flex-start", md: "space-between" }}>
                <FormControl isRequired flex={{ base: "100%", md: "23%" }}>
                  <FormLabel color="var(--primary-color)" _dark={{ color: "white" }}>
                    Mã sản phẩm
                  </FormLabel>
                  <Input
                    name="code"
                    value={editedProduct.code}
                    onChange={handleProductInputChange}
                    placeholder="Nhập mã sản phẩm (ví dụ: NE-TS-001)"
                    variant="outline"
                    border="1px solid"
                    borderColor="var(--primary-color)"
                    bg="transparent"
                    color="black"
                    _dark={{
                      bg: "gray.800",
                      borderColor: "gray.600",
                      color: "white",
                      _placeholder: { color: "gray.400" },
                    }}
                  />
                </FormControl>
                <FormControl isRequired flex={{ base: "100%", md: "23%" }}>
                  <FormLabel color="var(--primary-color)" _dark={{ color: "white" }}>
                    Tên sản phẩm
                  </FormLabel>
                  <Input
                    name="name"
                    value={editedProduct.name}
                    onChange={handleProductInputChange}
                    placeholder="Nhập tên sản phẩm"
                    variant="outline"
                    border="1px solid"
                    borderColor="var(--primary-color)"
                    bg="transparent"
                    color="black"
                    _dark={{
                      bg: "gray.800",
                      borderColor: "gray.600",
                      color: "white",
                      _placeholder: { color: "gray.400" },
                    }}
                  />
                </FormControl>
                <FormControl isRequired flex={{ base: "100%", md: "23%" }}>
                  <FormLabel color="var(--primary-color)" _dark={{ color: "white" }}>
                    Giá bán
                  </FormLabel>
                  <Input
                    name="price"
                    type="number"
                    value={editedProduct.price}
                    onChange={handleProductInputChange}
                    placeholder="Nhập giá bán"
                    variant="outline"
                    border="1px solid"
                    borderColor="var(--primary-color)"
                    bg="transparent"
                    color="black"
                    _dark={{
                      bg: "gray.800",
                      borderColor: "gray.600",
                      color: "white",
                      _placeholder: { color: "gray.400" },
                    }}
                  />
                </FormControl>
                <FormControl isRequired flex={{ base: "100%", md: "23%" }}>
                </FormControl>
              </HStack>

              <HStack spacing={4} align="flex-start" mt={4} flexWrap="wrap" justifyContent={{ base: "flex-start", md: "space-between" }}>
                <FormControl isRequired flex={{ base: "100%", md: "23%" }}>
                  <FormLabel color="var(--primary-color)" _dark={{ color: "white" }}>
                    Thương hiệu
                  </FormLabel>
                  <Select
                    name="brandId"
                    value={editedProduct.brandId}
                    onChange={handleProductInputChange}
                    placeholder="Chọn thương hiệu"
                    variant="outline"
                    border="1px solid"
                    borderColor="var(--primary-color)"
                    bg="transparent"
                    color="black"
                    _dark={{
                      bg: "gray.800",
                      borderColor: "gray.600",
                      color: "white",
                      _placeholder: { color: "gray.400" },
                    }}
                  >
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired flex={{ base: "100%", md: "23%" }}>
                  <FormLabel color="var(--primary-color)" _dark={{ color: "white" }}>
                    Danh mục
                  </FormLabel>
                  <Select
                    name="categoryId"
                    value={editedProduct.categoryId}
                    onChange={handleProductInputChange}
                    placeholder="Chọn danh mục"
                    variant="outline"
                    border="1px solid"
                    borderColor="var(--primary-color)"
                    bg="transparent"
                    color="black"
                    _dark={{
                      bg: "gray.800",
                      borderColor: "gray.600",
                      color: "white",
                      _placeholder: { color: "gray.400" },
                    }}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl flex={{ base: "100%", md: "23%" }}>
                  <FormLabel color="var(--primary-color)" _dark={{ color: "white" }}>
                    Tỷ lệ giảm giá (%)
                  </FormLabel>
                  <Input
                    name="discountRate"
                    type="number"
                    value={editedProduct.discountRate}
                    onChange={handleProductInputChange}
                    placeholder="Nhập tỷ lệ giảm giá"
                    variant="outline"
                    border="1px solid"
                    borderColor="var(--primary-color)"
                    bg="transparent"
                    color="black"
                    _dark={{
                      bg: "gray.800",
                      borderColor: "gray.600",
                      color: "white",
                      _placeholder: { color: "gray.400" },
                    }}
                  />
                </FormControl>

                <FormControl flex={{ base: "100%", md: "23%" }}>
                  <FormLabel color="var(--primary-color)" _dark={{ color: "white" }}>
                    Giá sau giảm
                  </FormLabel>
                  <Input
                    value={formatCurrency(parseFloat(editedProduct.discountPrice) || 0)}
                    isReadOnly
                    placeholder="Tự động tính toán"
                    variant="outline"
                    border="1px solid"
                    borderColor="var(--primary-color)"
                    bg="transparent"
                    color="black"
                    _dark={{
                      bg: "gray.800",
                      borderColor: "gray.600",
                      color: "white",
                      _placeholder: { color: "gray.400" },
                    }}
                  />
                </FormControl>
              </HStack>

              <FormControl mt={4}>
                <FormLabel color="var(--primary-color)" _dark={{ color: "white" }}>
                  Mô tả
                </FormLabel>
                <Textarea
                  name="description"
                  value={editedProduct.description}
                  onChange={handleProductInputChange}
                  placeholder="Nhập mô tả sản phẩm"
                  variant="outline"
                  border="1px solid"
                  borderColor="var(--primary-color)"
                  bg="transparent"
                  color="black"
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
            </Stack>
            <ModalFooter>
              <Button onClick={onClose} variant="ghost">
                Hủy
              </Button>
              <Button
                type="submit"
                ml={3}
                variant="solid"
                bg="var(--primary-color)"
                color="var(--text-color)"
                _hover={{ bg: "var(--hover-color)" }}
                _dark={{
                  bg: "gray.700",
                  color: "white",
                  _hover: { bg: "gray.600" },
                }}
              >
                Lưu
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditProduct;