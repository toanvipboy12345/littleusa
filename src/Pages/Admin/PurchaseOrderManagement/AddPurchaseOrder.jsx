// src/components/Admin/AddPurchaseOrder/AddPurchaseOrder.js
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../Api/axiosInstance";
import {
  Box,
  Text,
  Input,
  Select,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  useToast,
  Checkbox,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  List,
  ListItem,
} from "@chakra-ui/react";

const AddPurchaseOrder = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchProductTerm, setSearchProductTerm] = useState("");
  const [purchaseOrderData, setPurchaseOrderData] = useState({
    purchaseOrderCode: "",
    supplierId: "",
    productId: "",
    importPrice: "",
  });
  const [items, setItems] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axiosInstance.get("/api/suppliers");
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        toast({
          title: "Lỗi khi tải nhà cung cấp",
          description: "Không thể tải danh sách nhà cung cấp. Vui lòng thử lại!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/api/products");
        setProducts(response.data);
        setFilteredProducts(response.data); // Ban đầu hiển thị toàn bộ sản phẩm
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Lỗi khi tải sản phẩm",
          description: "Không thể tải danh sách sản phẩm. Vui lòng thử lại!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    };

    fetchSuppliers();
    fetchProducts();
  }, [toast]);

  useEffect(() => {
    if (purchaseOrderData.productId) {
      const fetchVariants = async () => {
        try {
          const response = await axiosInstance.get(`/api/products/${purchaseOrderData.productId}/variants`);
          const fetchedVariants = response.data;
          setVariants(fetchedVariants);
          const initialItems = fetchedVariants.flatMap((variant) =>
            variant.sizes.map((size) => ({
              variantSizeId: size.id,
              quantity: "",
              variantColor: variant.color,
              size: size.size,
            }))
          );
          setItems(initialItems);
          setSelectedVariants(fetchedVariants.map((variant) => variant.id));
        } catch (error) {
          console.error("Error fetching variants:", error);
          toast({
            title: "Lỗi khi tải biến thể",
            description: "Không thể tải danh sách biến thể. Vui lòng thử lại!",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        }
      };
      fetchVariants();
    } else {
      setVariants([]);
      setItems([]);
      setSelectedVariants([]);
    }
  }, [purchaseOrderData.productId, toast]);

  // Hàm tìm kiếm sản phẩm dựa trên từ khóa
  const handleProductSearch = (value) => {
    setSearchProductTerm(value);
    if (value) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(value.toLowerCase()) ||
          product.code.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  // Hàm chọn sản phẩm từ danh sách gợi ý
  const handleProductSelect = (product) => {
    setPurchaseOrderData((prev) => ({ ...prev, productId: product.id }));
    setSearchProductTerm(`${product.name} (${product.code})`);
    setFilteredProducts(products);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPurchaseOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleVariantSelection = (variantId) => {
    setSelectedVariants((prev) =>
      prev.includes(variantId)
        ? prev.filter((id) => id !== variantId)
        : [...prev, variantId]
    );
  };

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  const calculateTotalAmount = () => {
    const importPrice = parseFloat(purchaseOrderData.importPrice || 0);
    const totalQuantity = items.reduce((sum, item) => {
      const variant = variants.find((v) =>
        v.sizes.some((size) => size.id === item.variantSizeId)
      );
      if (selectedVariants.includes(variant?.id) && item.quantity && parseInt(item.quantity) > 0) {
        return sum + parseInt(item.quantity);
      }
      return sum;
    }, 0);
    return importPrice * totalQuantity;
  };

  const handleCreatePurchaseOrder = async () => {
    try {
      if (
        !purchaseOrderData.purchaseOrderCode ||
        !purchaseOrderData.supplierId ||
        !purchaseOrderData.productId ||
        !purchaseOrderData.importPrice
      ) {
        toast({
          title: "Lỗi",
          description: "Vui lòng điền đầy đủ thông tin phiếu nhập hàng!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }

      if (parseFloat(purchaseOrderData.importPrice) <= 0) {
        toast({
          title: "Lỗi",
          description: "Giá nhập phải lớn hơn 0!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }

      const validItems = items
        .filter((item) => {
          const variant = variants.find((v) =>
            v.sizes.some((size) => size.id === item.variantSizeId)
          );
          return (
            selectedVariants.includes(variant?.id) &&
            item.quantity &&
            parseInt(item.quantity) > 0
          );
        })
        .map((item) => ({
          variantSizeId: item.variantSizeId,
          quantity: parseInt(item.quantity),
        }));

      if (validItems.length === 0) {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập số lượng cho ít nhất một kích thước của biến thể đã chọn!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }

      const formData = {
        purchaseOrderCode: purchaseOrderData.purchaseOrderCode,
        supplier: { id: purchaseOrderData.supplierId },
        product: { id: purchaseOrderData.productId },
        importPrice: parseFloat(purchaseOrderData.importPrice),
        items: validItems,
        totalAmount: calculateTotalAmount(),
      };

      const response = await axiosInstance.post("/api/purchase-orders", formData, {
        headers: { "Content-Type": "application/json" },
      });

      toast({
        title: "Thêm phiếu nhập hàng thành công",
        description: "Phiếu nhập hàng đã được tạo",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      // Reset form
      setPurchaseOrderData({
        purchaseOrderCode: "",
        supplierId: "",
        productId: "",
        importPrice: "",
      });
      setSearchProductTerm("");
      setItems([]);
      setVariants([]);
      setSelectedVariants([]);
    } catch (error) {
      // Sử dụng error.customMessage nếu có (được thêm bởi interceptor khi lỗi 403)
      const errorMessage = error.customMessage || error.response?.data?.message || error.message || "Lỗi không xác định";

      toast({
        title: "Lỗi khi thêm phiếu nhập hàng",
        description: errorMessage,
        status: "error", // Sửa từ "status: error" thành "status: 'error'"
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <Box
      as="form"
      onSubmit={(e) => e.preventDefault()}
      maxW={{ base: "100%", md: "600px", lg: "100%" }}
      mx="auto"
      p={{ base: 4, md: 6 }}
      bg="transparent"
      _dark={{ bg: "gray.900" }}
    >
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
          Tạo Phiếu Nhập Hàng
        </Text>

        <HStack spacing={4} align="flex-start" flexWrap="wrap" justifyContent={{ base: "flex-start", md: "space-between" }}>
          <FormControl isRequired flex={{ base: "100%", md: "23%" }}>
            <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
              Mã phiếu nhập
            </FormLabel>
            <Input
              name="purchaseOrderCode"
              value={purchaseOrderData.purchaseOrderCode}
              onChange={handleInputChange}
              placeholder="Nhập mã phiếu (ví dụ: PO-001)"
              variant="outline"
              border="1px solid"
              borderColor="var(--primary-color)"
              bg="transparent"
              color="black"
              fontSize={{ base: "sm", md: "md" }}
              size="md"
              _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
              _focus={{ borderColor: "var(--primary-color)", boxShadow: "0 0 0 1px var(--primary-color)" }}
              _hover={{ borderColor: "var(--hover-color)" }}
            />
          </FormControl>

          <FormControl isRequired flex={{ base: "100%", md: "23%" }}>
            <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
              Nhà cung cấp
            </FormLabel>
            <Select
              name="supplierId"
              value={purchaseOrderData.supplierId}
              onChange={handleInputChange}
              placeholder="Chọn nhà cung cấp"
              variant="outline"
              border="1px solid"
              borderColor="var(--primary-color)"
              bg="transparent"
              color="black"
              fontSize={{ base: "sm", md: "md" }}
              size="md"
              _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
              _focus={{ borderColor: "var(--primary-color)", boxShadow: "0 0 0 1px var(--primary-color)" }}
              _hover={{ borderColor: "var(--hover-color)" }}
            >
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired flex={{ base: "100%", md: "23%" }}>
            <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
              Sản phẩm
            </FormLabel>
            <Popover placement="bottom-start" closeOnBlur={true}>
              <PopoverTrigger>
                <Input
                  value={searchProductTerm}
                  onChange={(e) => handleProductSearch(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  variant="outline"
                  border="1px solid"
                  borderColor="var(--primary-color)"
                  bg="transparent"
                  color="black"
                  fontSize={{ base: "sm", md: "md" }}
                  size="md"
                  _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
                  _focus={{ borderColor: "var(--primary-color)", boxShadow: "0 0 0 1px var(--primary-color)" }}
                  _hover={{ borderColor: "var(--hover-color)" }}
                />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody maxH="200px" overflowY="auto">
                  <List spacing={2}>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <ListItem
                          key={product.id}
                          p={2}
                          _hover={{ bg: "gray.100", cursor: "pointer" }}
                          onClick={() => handleProductSelect(product)}
                        >
                          {product.name} ({product.code})
                        </ListItem>
                      ))
                    ) : (
                      <ListItem>Không tìm thấy sản phẩm</ListItem>
                    )}
                  </List>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </FormControl>

          <FormControl isRequired flex={{ base: "100%", md: "23%" }}>
            <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
              Giá nhập
            </FormLabel>
            <Input
              name="importPrice"
              type="number"
              value={purchaseOrderData.importPrice}
              onChange={handleInputChange}
              placeholder="Nhập giá nhập"
              variant="outline"
              border="1px solid"
              borderColor="var(--primary-color)"
              bg="transparent"
              color="black"
              fontSize={{ base: "sm", md: "md" }}
              size="md"
              _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
              _focus={{ borderColor: "var(--primary-color)", boxShadow: "0 0 0 1px var(--primary-color)" }}
              _hover={{ borderColor: "var(--hover-color)" }}
            />
          </FormControl>
        </HStack>

        {variants.length > 0 && (
          <>
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" mt={4}>
              Chọn biến thể và nhập số lượng cho từng kích thước
            </Text>
            {variants.map((variant, variantIndex) => (
              <VStack key={variant.id} spacing={2} align="stretch" mt={2}>
                <HStack spacing={3}>
                  <Checkbox
                    isChecked={selectedVariants.includes(variant.id)}
                    onChange={() => handleVariantSelection(variant.id)}
                  >
                    <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold">
                      Màu: {variant.color}
                    </Text>
                  </Checkbox>
                </HStack>
                {selectedVariants.includes(variant.id) && (
                  <HStack spacing={4} flexWrap="wrap">
                    {variant.sizes.map((size, sizeIndex) => {
                      const itemIndex = items.findIndex(
                        (item) => item.variantSizeId === size.id
                      );
                      return (
                        <FormControl key={size.id} flex={{ base: "100%", md: "23%" }}>
                          <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
                            Size {size.size}
                          </FormLabel>
                          <Input
                            type="number"
                            value={items[itemIndex]?.quantity || ""}
                            onChange={(e) => handleItemChange(itemIndex, "quantity", e.target.value)}
                            placeholder="Nhập số lượng"
                            variant="outline"
                            border="1px solid"
                            borderColor="var(--primary-color)"
                            bg="transparent"
                            color="black"
                            fontSize={{ base: "sm", md: "md" }}
                            size="md"
                            _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
                            _focus={{ borderColor: "var(--primary-color)", boxShadow: "0 0 0 1px var(--primary-color)" }}
                            _hover={{ borderColor: "var(--hover-color)" }}
                          />
                        </FormControl>
                      );
                    })}
                  </HStack>
                )}
              </VStack>
            ))}
          </>
        )}

        <HStack spacing={4} mt={4} justifyContent="space-between">
          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold">
            Tổng giá trị: {formatCurrency(calculateTotalAmount())}
          </Text>
          <Button
            onClick={handleCreatePurchaseOrder}
            variant="solid"
            size="md"
            bg="var(--primary-color)"
            color="var(--text-color)"
            _hover={{ bg: "var(--hover-color)" }}
            _active={{ bg: "var(--primary-color)" }}
            _dark={{ bg: "gray.700", color: "white", _hover: { bg: "gray.600" }, _active: { bg: "gray.700" } }}
          >
            Tạo phiếu nhập hàng
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default AddPurchaseOrder;