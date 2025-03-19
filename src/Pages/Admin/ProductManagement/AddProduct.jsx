import React, { useState, useEffect } from "react";
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
  Textarea,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepTitle,
  StepDescription,
  StepSeparator,
  useToast,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import VariantForm from "./VariantForm";

const AddProduct = ({ onAddSuccess, brands: externalBrands, categories: externalCategories }) => {
  const [brands, setBrands] = useState(externalBrands || []);
  const [categories, setCategories] = useState(externalCategories || []);
  const [productFormData, setProductFormData] = useState({
    code: "",
    brandId: "",
    categoryId: "",
    name: "",
    price: "",
    discountRate: "",
    description: "",
  });
  const [variants, setVariants] = useState([
    {
      color: "",
      sizes: [{ size: "S" }],
      mainImage: null,
      images: [],
    },
  ]);
  const [activeStep, setActiveStep] = useState(0);
  const [productId, setProductId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axiosInstance.get("/api/brands");
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
        toast({
          title: "Lỗi khi tải thương hiệu",
          description: "Không thể tải danh sách thương hiệu. Vui lòng thử lại!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Lỗi khi tải danh mục",
          description: "Không thể tải danh sách danh mục. Vui lòng thử lại!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    };

    fetchBrands();
    fetchCategories();
  }, [toast]);
  
  // Kiểm tra state brands sau khi cập nhật
  console.log("Current Brands State:", brands);

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };
      if (name === "price" || name === "discountRate") {
        const price = parseFloat(updatedFormData.price || 0);
        const discountRate = parseFloat(updatedFormData.discountRate || 0);
        if (!isNaN(price) && !isNaN(discountRate)) {
          updatedFormData.discountPrice = (price - price * (discountRate / 100)).toFixed(2);
        } else {
          updatedFormData.discountPrice = "";
        }
      }
      return updatedFormData;
    });
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const handleSizeChange = (variantIndex, sizeIndex, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].sizes[sizeIndex][field] = value;
    setVariants(updatedVariants);
  };

  const addSizeToVariant = (variantIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].sizes.push({ size: "S" });
    setVariants(updatedVariants);
  };

  const removeSizeFromVariant = (variantIndex, sizeIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].sizes = updatedVariants[variantIndex].sizes.filter(
      (_, i) => i !== sizeIndex
    );
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { color: "", sizes: [{ size: "S" }], mainImage: null, images: [] },
    ]);
  };

  const removeVariant = (index) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
  };

  const handleFileChange = (variantIndex, type, files) => {
    const updatedVariants = [...variants];
    if (type === "mainImage") {
      updatedVariants[variantIndex].mainImage = files[0];
    } else if (type === "images") {
      updatedVariants[variantIndex].images = Array.from(files);
    }
    setVariants(updatedVariants);
  };

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  const handleCreateProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("product", JSON.stringify(productFormData));

      const response = await axiosInstance.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const createdProduct = response.data;
      setProductId(createdProduct.id);
      setActiveStep(1);
    } catch (error) {
      console.error("Error creating product:", error);
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      toast({
        title: "Vui lòng nhập thông tin sản phẩm",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleCreateVariants = async () => {
    try {
      if (!productId) {
        toast({
          title: "Lỗi",
          description: "Bạn chưa nhập thông tin sản phẩm",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }

      for (const variant of variants) {
        if (!variant.color || variant.color.trim() === "" || variant.sizes.some(size => !size.size)) {
          toast({
            title: "Lỗi",
            description: "Vui lòng điền đầy đủ thông tin cho biến thể (màu sắc và kích thước)!",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          return;
        }

        const formData = new FormData();
        const variantData = {
          color: variant.color,
          sizes: variant.sizes.map(size => ({
            size: size.size,
          })),
        };
        formData.append("variant", JSON.stringify(variantData));

        if (variant.mainImage) {
          formData.append("mainImage", variant.mainImage);
        }
        if (variant.images && variant.images.length > 0) {
          variant.images.forEach((image) => {
            formData.append("images", image);
          });
        }

        await axiosInstance.post(`/api/products/${productId}/variants`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast({
        title: "Thêm sản phẩm thành công",
        description: "Sản phẩm và biến thể đã được thêm. Bạn có thể tạo phiếu nhập hàng để cập nhật số lượng!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      const newProductData = {
        ...productFormData,
        id: productId,
        variants: variants.map(variant => ({
          color: variant.color,
          sizes: variant.sizes.map(size => ({ size: size.size })),
          mainImage: variant.mainImage ? URL.createObjectURL(variant.mainImage) : null,
          images: variant.images.map(image => URL.createObjectURL(image)),
        })),
      };
      onAddSuccess(newProductData);

      setActiveStep(2);
      setProductFormData({
        code: "",
        brandId: "",
        categoryId: "",
        name: "",
        price: "",
        discountRate: "",
        description: "",
      });
      setVariants([{ color: "", sizes: [{ size: "S" }], mainImage: null, images: [] }]);
      setProductId(null);
    } catch (error) {
      console.error("Error in creating variants:", error);
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      toast({
        title: "Lỗi khi thêm biến thể",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const steps = [
    { title: "Thông tin sản phẩm", description: "Nhập thông tin sản phẩm chính" },
    { title: "Thêm màu sắc", description: "Thêm các biến thể cho sản phẩm" },
    { title: "Hoàn thành", description: "Xác nhận và hoàn tất" },
  ];

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
        <Stepper index={activeStep} colorScheme="green">
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus complete={<AddIcon />} active={<AddIcon />} incomplete={<AddIcon />} />
              </StepIndicator>
              <Box flexShrink="0">
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>
              <StepSeparator />
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <>
            <HStack spacing={4} align="flex-start" flexWrap="wrap" justifyContent={{ base: "flex-start", md: "space-between" }}>
              <FormControl isRequired flex={{ base: "100%", md: "23%" }}>
                <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
                  Mã sản phẩm
                </FormLabel>
                <Input
                  name="code"
                  value={productFormData.code}
                  onChange={handleProductInputChange}
                  placeholder="Nhập mã sản phẩm (ví dụ: NE-TS-001)"
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
                  Tên sản phẩm
                </FormLabel>
                <Input
                  name="name"
                  value={productFormData.name}
                  onChange={handleProductInputChange}
                  placeholder="Nhập tên sản phẩm"
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
                  Giá bán
                </FormLabel>
                <Input
                  name="price"
                  type="number"
                  value={productFormData.price}
                  onChange={handleProductInputChange}
                  placeholder="Nhập giá bán"
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

            <HStack spacing={4} align="flex-start" mt={4} flexWrap="wrap" justifyContent={{ base: "flex-start", md: "space-between" }}>
              <FormControl isRequired flex={{ base: "100%", md: "23%" }}>
                <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
                  Thương hiệu
                </FormLabel>
                <Select
                  name="brandId"
                  value={productFormData.brandId}
                  onChange={handleProductInputChange}
                  placeholder="Chọn thương hiệu"
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
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired flex={{ base: "100%", md: "23%" }}>
                <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
                  Danh mục
                </FormLabel>
                <Select
                  name="categoryId"
                  value={productFormData.categoryId}
                  onChange={handleProductInputChange}
                  placeholder="Chọn danh mục"
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
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl flex={{ base: "100%", md: "23%" }}>
                <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
                  Tỷ lệ giảm giá (%)
                </FormLabel>
                <Input
                  name="discountRate"
                  type="number"
                  value={productFormData.discountRate}
                  onChange={handleProductInputChange}
                  placeholder="Nhập tỷ lệ giảm giá"
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
              <FormControl flex={{ base: "100%", md: "23%" }}>
                <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
                  Giá sau giảm
                </FormLabel>
                <Input
                  value={formatCurrency(productFormData.discountPrice)}
                  isReadOnly
                  placeholder="Tự động tính toán"
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

            <FormControl mt={4}>
              <FormLabel color="var(--primary-color)" _dark={{ color: "white" }} fontSize={{ base: "sm", md: "md" }}>
                Mô tả
              </FormLabel>
              <Textarea
                name="description"
                value={productFormData.description}
                onChange={handleProductInputChange}
                placeholder="Nhập mô tả sản phẩm"
                variant="outline"
                border="1px solid"
                borderColor="var(--primary-color)"
                bg="transparent"
                color="black"
                fontSize={{ base: "sm", md: "md" }}
                size="md"
                height="200px"
                rows={4}
                _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white", _placeholder: { color: "gray.400" } }}
                _hover={{ borderColor: "var(--hover-color)" }}
                _focus={{ borderColor: "var(--primary-color)", boxShadow: "0 0 0 1px var(--primary-color)" }}
              />
            </FormControl>

            <HStack mt={4} spacing={4} justifyContent="flex-end">
              <Button
                colorScheme="blue"
                onClick={handleCreateProduct}
                variant="solid"
                bg="var(--primary-color)"
                color="var(--text-color)"
                size="md"
                _hover={{ bg: "var(--hover-color)" }}
                _active={{ bg: "var(--primary-color)" }}
                _dark={{ bg: "gray.700", color: "white", _hover: { bg: "gray.600" }, _active: { bg: "gray.700" } }}
              >
                Tiếp tục thêm sản phẩm
              </Button>
            </HStack>
          </>
        )}

        {activeStep === 1 && (
          <>
            {variants.map((variant, index) => (
              <VariantForm
                key={index}
                variant={variant}
                index={index}
                handleVariantChange={handleVariantChange}
                handleSizeChange={handleSizeChange}
                addSizeToVariant={addSizeToVariant}
                removeSizeFromVariant={removeSizeFromVariant}
                removeVariant={removeVariant}
                handleFileChange={handleFileChange}
              />
            ))}

            <Button
              mt={2}
              leftIcon={<AddIcon />}
              onClick={addVariant}
              colorScheme="green"
              variant="solid"
              size="md"
              bg="var(--primary-color)"
              color="var(--text-color)"
              _hover={{ bg: "var(--hover-color)" }}
              _active={{ bg: "var(--primary-color)" }}
              _dark={{ bg: "gray.700", color: "white", _hover: { bg: "gray.600" }, _active: { bg: "gray.700" } }}
            >
              Thêm biến thể
            </Button>

            <HStack mt={4} spacing={4} justifyContent="flex-end">
              <Button
                onClick={() => setActiveStep(0)}
                colorScheme="gray"
                variant="outline"
                size="md"
                _hover={{ bg: "gray.100", color: "gray.800" }}
                _dark={{ bg: "gray.700", color: "white", _hover: { bg: "gray.600" } }}
              >
                Quay lại
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleCreateVariants}
                variant="solid"
                size="md"
                bg="var(--primary-color)"
                color="var(--text-color)"
                _hover={{ bg: "var(--hover-color)" }}
                _active={{ bg: "var(--primary-color)" }}
                _dark={{ bg: "gray.700", color: "white", _hover: { bg: "gray.600" }, _active: { bg: "gray.700" } }}
              >
                Thêm biến thể và hoàn tất
              </Button>
            </HStack>
          </>
        )}

        {activeStep === 2 && (
          <VStack spacing={6} align="center">
            <Text fontSize={{ base: "lg", md: "xl" }} textAlign="center">
              Đã thêm sản phẩm thành công! Bạn có thể quay lại để thêm sản phẩm mới hoặc tạo phiếu nhập hàng để cập nhật số lượng.
            </Text>
            <Button
              mt={4}
              onClick={() => setActiveStep(0)}
              colorScheme="green"
              variant="solid"
              size="md"
              bg="var(--primary-color)"
              color="var(--text-color)"
              _hover={{ bg: "var(--hover-color)" }}
              _active={{ bg: "var(--primary-color)" }}
              _dark={{ bg: "gray.700", color: "white", _hover: { bg: "gray.600" }, _active: { bg: "gray.700" } }}
            >
              Thêm sản phẩm mới
            </Button>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default AddProduct;