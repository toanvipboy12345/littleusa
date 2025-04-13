import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../../Api/axiosInstance";
import {
  Box,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Input,
  Stack,
  Flex,
  HStack,
  VStack,
  Text,
  Image,
  Wrap,
  WrapItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Select,
} from "@chakra-ui/react";
import {
  Trash2,
  Edit2,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus as AddIcon,
} from "react-feather";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import EditVariant from "./EditVariant";
import { useDisclosure } from "@chakra-ui/react";

const LOW_STOCK_THRESHOLD = 5; // Ngưỡng số lượng thấp

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const toast = useToast();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  const {
    isOpen: isEditProductOpen,
    onOpen: onEditProductOpen,
    onClose: onEditProductClose,
  } = useDisclosure();
  const [productToEdit, setProductToEdit] = useState(null);

  const {
    isOpen: isEditVariantOpen,
    onOpen: onEditVariantOpen,
    onClose: onEditVariantClose,
  } = useDisclosure();
  const [variantToEdit, setVariantToEdit] = useState(null);

  // Hàm định dạng ngày giống BlogListView
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Hàm kiểm tra số lượng thấp
  const checkLowStock = (variants) => {
    if (!variants || !Array.isArray(variants)) return [];
    return variants.map((variant) => ({
      ...variant,
      lowStockSizes: variant.sizes?.filter(
        (size) => size.quantity <= LOW_STOCK_THRESHOLD
      ) || [],
    }));
  };

  // Kiểm tra xem sản phẩm có biến thể nào sắp hết hàng không
  const hasLowStock = (variants) => {
    if (!variants || !Array.isArray(variants)) return false;
    return variants.some((variant) => variant.lowStockSizes?.length > 0);
  };

  // Nạp danh sách thương hiệu và danh mục
  useEffect(() => {
    const fetchBrandsAndCategories = async () => {
      try {
        const [brandsResponse, categoriesResponse] = await Promise.all([
          axiosInstance.get("/api/brands"),
          axiosInstance.get("/api/categories"),
        ]);
        setBrands(brandsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching brands or categories:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách thương hiệu hoặc danh mục.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    };
    fetchBrandsAndCategories();
  }, [toast]);

  // Nạp danh sách sản phẩm
  const fetchProducts = useCallback(
    async (search = "", categoryId = "", brandId = "") => {
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (categoryId) params.append("categoryId", categoryId);
        if (brandId) params.append("brandId", brandId);

        const response = await axiosInstance.get(
          `/api/products${params.toString() ? `?${params.toString()}` : ""}`
        );
        const normalizedProducts = response.data.map((product) => ({
          ...product,
          variants: checkLowStock(
            product.variants?.map((variant) => ({
              ...variant,
              productId:
                variant.productId && !isNaN(Number(variant.productId))
                  ? Number(variant.productId)
                  : null,
            })) || []
          ),
        }));

        // Sắp xếp sản phẩm: ưu tiên sản phẩm có biến thể sắp hết hàng lên đầu
        const sortedProducts = normalizedProducts.sort((a, b) => {
          const aHasLowStock = hasLowStock(a.variants);
          const bHasLowStock = hasLowStock(b.variants);

          if (aHasLowStock && !bHasLowStock) return -1; // a lên đầu nếu a có biến thể sắp hết hàng
          if (!aHasLowStock && bHasLowStock) return 1; // b lên đầu nếu b có biến thể sắp hết hàng
          return 0; // Giữ nguyên thứ tự nếu cả hai đều có hoặc không có biến thể sắp hết hàng
        });

        setProducts(sortedProducts);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách sản phẩm.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    },
    [toast]
  );

  useEffect(() => {
    fetchProducts(searchTerm, selectedCategory, selectedBrand);
  }, [fetchProducts, searchTerm, selectedCategory, selectedBrand]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
  };

  const handleBrandChange = (e) => {
    const value = e.target.value;
    setSelectedBrand(value);
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleDeleteOpen = (id) => {
    setProductIdToDelete(id);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (productIdToDelete) {
      try {
        await axiosInstance.delete(`/api/products/${productIdToDelete}`);
        setProducts(
          products.filter((product) => product.id !== productIdToDelete)
        );
        toast({
          title: "Thành công",
          description: "Đã xóa sản phẩm.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        if (paginatedProducts.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        const errorMessage = error.customMessage || "Lỗi không xác định";
        toast({
          title: "Lỗi",
          description: errorMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } finally {
        onDeleteClose();
        setProductIdToDelete(null);
      }
    }
  };

  const handleEditProductOpen = (product) => {
    setProductToEdit(product);
    onEditProductOpen();
  };

  const handleEditVariantOpen = (variant) => {
    if (!variant || typeof variant !== "object") {
      console.error("Invalid variant object:", variant);
      toast({
        title: "Lỗi",
        description: "Dữ liệu biến thể không hợp lệ.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    let productId = variant.productId;
    if (
      productId === null ||
      productId === undefined ||
      isNaN(Number(productId))
    ) {
      const product = products.find((p) =>
        p.variants.some((v) => v.id === variant.id)
      );
      productId = product ? product.id : null;

      if (!productId || isNaN(Number(productId))) {
        console.error("Cannot find valid productId for variant:", variant);
        toast({
          title: "Lỗi",
          description:
            "Không thể mở chỉnh sửa biến thể do ID sản phẩm không hợp lệ.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }
    }

    setVariantToEdit({
      ...variant,
      productId: Number(productId),
    });
    onEditVariantOpen();
  };

  const handleAddVariantOpen = (productId) => {
    if (!productId || isNaN(productId)) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm biến thể do ID sản phẩm không hợp lệ.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    setVariantToEdit({
      productId: Number(productId),
      id: null,
      color: "",
      sizes: [{ size: "S", quantity: 0 }],
      mainImage: null,
      images: [],
    });
    onEditVariantOpen();
  };

  const handleAddSuccess = () => {
    fetchProducts(searchTerm, selectedCategory, selectedBrand);
    setActiveTab(0);
  };

  const handleEditProductSuccess = (updatedProduct) => {
    // Áp dụng checkLowStock cho sản phẩm vừa cập nhật
    const normalizedProduct = {
      ...updatedProduct,
      variants: checkLowStock(updatedProduct.variants || []),
    };
    const updatedProducts = products.map((product) =>
      product.id === normalizedProduct.id ? normalizedProduct : product
    );

    // Sắp xếp lại danh sách sau khi cập nhật
    const sortedProducts = updatedProducts.sort((a, b) => {
      const aHasLowStock = hasLowStock(a.variants);
      const bHasLowStock = hasLowStock(b.variants);

      if (aHasLowStock && !bHasLowStock) return -1;
      if (!aHasLowStock && bHasLowStock) return 1;
      return 0;
    });

    setProducts(sortedProducts);
    onEditProductClose();
  };

  const handleEditVariantSuccess = (updatedVariant) => {
    const updatedProducts = products.map((product) => {
      if (product.id === updatedVariant.productId) {
        if (updatedVariant.deleted) {
          const updatedVariants = product.variants.filter(
            (v) => v.id !== updatedVariant.id
          );
          return { ...product, variants: updatedVariants };
        } else {
          const updatedVariants = product.variants.map((v) =>
            v.id === updatedVariant.id ? updatedVariant : v
          );
          if (!updatedVariant.id) {
            updatedVariants.push(updatedVariant);
          }
          return {
            ...product,
            variants: checkLowStock(updatedVariants),
          };
        }
      }
      return product;
    });

    // Sắp xếp lại danh sách sau khi cập nhật biến thể
    const sortedProducts = updatedProducts.sort((a, b) => {
      const aHasLowStock = hasLowStock(a.variants);
      const bHasLowStock = hasLowStock(b.variants);

      if (aHasLowStock && !bHasLowStock) return -1;
      if (!aHasLowStock && bHasLowStock) return 1;
      return 0;
    });

    setProducts(sortedProducts);
    fetchProducts(searchTerm, selectedCategory, selectedBrand);
    setVariantToEdit({
      ...updatedVariant,
      productId: updatedVariant.productId,
    });
    onEditVariantClose();
  };

  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.name : brandId;
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <Box p={{ base: 2, md: 4 }} mx="auto" maxW={{ base: "100%" }}>
      <Tabs index={activeTab} onChange={(index) => setActiveTab(index)}>
        <TabList mb={{ base: 2, md: 4 }} flexWrap="wrap">
          <Tab fontSize={{ base: "sm", md: "md" }}>Danh sách sản phẩm</Tab>
          <Tab fontSize={{ base: "sm", md: "md" }}>Thêm sản phẩm</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <Stack spacing={{ base: 2, md: 4 }} mb={{ base: 2, md: 4 }}>
              <Flex
                direction={{ base: "column", md: "row" }}
                align={{ base: "stretch", md: "center" }}
                justify="space-between"
                gap={{ base: 2, md: 4 }}
              >
                <Flex direction={{ base: "column", md: "row" }} gap={4} flex="1">
                  <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={handleSearch}
                    leftIcon={<Search size={20} />}
                    variant="outline"
                    borderColor="var(--primary-color)"
                    _hover={{ borderColor: "var(--hover-color)" }}
                    _focus={{
                      borderColor: "var(--primary-color)",
                      boxShadow: "0 0 0 1px var(--primary-color)",
                    }}
                    color="black"
                    size={{ base: "sm", md: "md" }}
                    _dark={{
                      color: "white",
                      _placeholder: { color: "gray.400" },
                    }}
                  />
                  <Select
                    placeholder="Chọn danh mục"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    variant="outline"
                    borderColor="var(--primary-color)"
                    size={{ base: "sm", md: "md" }}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                  <Select
                    placeholder="Chọn thương hiệu"
                    value={selectedBrand}
                    onChange={handleBrandChange}
                    variant="outline"
                    borderColor="var(--primary-color)"
                    size={{ base: "sm", md: "md" }}
                  >
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </Select>
                </Flex>
                <HStack
                  spacing={2}
                  flexShrink={0}
                  justify={{ base: "center", md: "flex-end" }}
                >
                  <Text
                    fontSize={{ base: "sm", md: "md" }}
                    whiteSpace="nowrap"
                    color="gray.600"
                    _dark={{ color: "gray.300" }}
                  >
                    Hiển thị:
                  </Text>
                  <Select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    size={{ base: "sm", md: "md" }}
                    w={{ base: "100px", md: "120px" }}
                    borderColor="gray.300"
                    color="gray.600"
                    _dark={{
                      borderColor: "gray.600",
                      color: "white",
                      bg: "gray.700",
                    }}
                    sx={{
                      option: {
                        bg: "white",
                        color: "gray.600",
                        _dark: {
                          bg: "gray.700",
                          color: "white",
                        },
                      },
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </Select>
                  <Text
                    fontSize={{ base: "sm", md: "md" }}
                    whiteSpace="nowrap"
                    color="gray.600"
                    _dark={{ color: "gray.300" }}
                  >
                    sản phẩm/trang
                  </Text>
                </HStack>
              </Flex>
            </Stack>

            <Box
              overflowX={{ base: "auto", md: "visible" }}
              display={{ base: "block", md: "block" }}
            >
              <Table
                variant="simple"
                size={{ base: "sm", md: "md" }}
                display={{ base: "none", md: "table" }}
              >
                <Thead>
                  <Tr>
                    <Th>Mã sản phẩm</Th>
                    <Th>Tên</Th>
                    <Th>Giá bán</Th>
                    <Th>Thương hiệu</Th>
                    <Th>Danh mục</Th>
                    <Th>Ngày tạo</Th>
                    <Th>Màu sắc & Tồn kho</Th>
                    <Th>Thao tác</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedProducts.map((product) => (
                    <Tr key={product.id}>
                      <Td>{product.code}</Td>
                      <Td>{product.name}</Td>
                      <Td>{formatCurrency(product.price)}</Td>
                      <Td>{getBrandName(product.brandId)}</Td>
                      <Td>{getCategoryName(product.categoryId)}</Td>
                      <Td>{formatDate(product.createdAt)}</Td>
                      <Td>
                        {product.variants && product.variants.length > 0 ? (
                          <Box>
                            {/* Hiển thị ảnh các biến thể nằm ngang */}
                            <Wrap spacing={2} mb={2}>
                              {product.variants.map(
                                (variant, index) =>
                                  variant.mainImage && (
                                    <WrapItem key={index}>
                                      <Image
                                        src={`http://localhost:8080${variant.mainImage}`}
                                        alt={`${product.name} - ${variant.color}`}
                                        boxSize="50px"
                                        objectFit="cover"
                                      />
                                    </WrapItem>
                                  )
                              )}
                            </Wrap>
                            {/* Chỉ hiển thị thông tin màu sắc và tồn kho của các biến thể sắp hết hàng */}
                            {hasLowStock(product.variants) && (
                              <>
                                {product.variants
                                  .filter((variant) => variant.lowStockSizes?.length > 0)
                                  .map((variant, index) => (
                                    <Box key={index}>
                                      <Text fontSize="sm">
                                        Màu: {variant.color}
                                      </Text>
                                      <Text fontSize="sm" color="red.500">
                                        Sắp hết:{" "}
                                        {variant.lowStockSizes
                                          .map((size) => `${size.size} (${size.quantity})`)
                                          .join(", ")}
                                      </Text>
                                    </Box>
                                  ))}
                              </>
                            )}
                          </Box>
                        ) : (
                          "Không có biến thể"
                        )}
                      </Td>
                      <Td>
                        <Flex align="center" gap={2}>
                          <IconButton
                            icon={<Edit2 size={{ base: 16, md: 18 }} />}
                            aria-label="Sửa thông tin sản phẩm"
                            onClick={() => handleEditProductOpen(product)}
                            variant="outline"
                            size={{ base: "xs", md: "sm" }}
                          />
                          <Popover>
                            <PopoverTrigger>
                              <IconButton
                                icon={<AddIcon size={{ base: 16, md: 18 }} />}
                                aria-label="Quản lý biến thể"
                                colorScheme="green"
                                variant="outline"
                                size={{ base: "xs", md: "sm" }}
                              />
                            </PopoverTrigger>
                            <PopoverContent width="200px">
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverHeader>Quản lý biến thể</PopoverHeader>
                              <PopoverBody>
                                <VStack spacing={2} align="stretch">
                                  {product.variants.map((variant) => (
                                    <Button
                                      key={variant.id}
                                      onClick={() =>
                                        handleEditVariantOpen(variant)
                                      }
                                      variant="ghost"
                                      size="sm"
                                    >
                                      Biến thể {variant.color}
                                    </Button>
                                  ))}
                                  <Button
                                    onClick={() =>
                                      handleAddVariantOpen(product.id)
                                    }
                                    variant="ghost"
                                    size="sm"
                                  >
                                    Thêm biến thể mới
                                  </Button>
                                </VStack>
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                          <IconButton
                            icon={<Trash2 size={{ base: 16, md: 18 }} />}
                            aria-label="Xóa sản phẩm"
                            onClick={() => handleDeleteOpen(product.id)}
                            variant="outline"
                            size={{ base: "xs", md: "sm" }}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <VStack
                spacing={4}
                align="stretch"
                display={{ base: "flex", md: "none" }}
              >
                {paginatedProducts.map((product) => (
                  <Box
                    key={product.id}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    bg="white"
                    _dark={{ bg: "gray.800" }}
                  >
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">Mã: {product.code}</Text>
                        <Text>Tên: {product.name}</Text>
                        <Text fontSize="sm">
                          Giá bán: {formatCurrency(product.price)}
                        </Text>
                        <Text fontSize="sm">
                          Thương hiệu: {getBrandName(product.brandId)}
                        </Text>
                        <Text fontSize="sm">
                          Danh mục: {getCategoryName(product.categoryId)}
                        </Text>
                        <Text fontSize="sm">
                          Ngày tạo: {formatDate(product.createdAt)}
                        </Text>
                        {product.variants && product.variants.length > 0 ? (
                          <Box mt={2}>
                            {/* Hiển thị ảnh các biến thể nằm ngang */}
                            <Wrap spacing={2} mb={2}>
                              {product.variants.map(
                                (variant, index) =>
                                  variant.mainImage && (
                                    <WrapItem key={index}>
                                      <Image
                                        src={`http://localhost:8080${variant.mainImage}`}
                                        alt={`${product.name} - ${variant.color}`}
                                        boxSize="50px"
                                        objectFit="cover"
                                        borderRadius="md"
                                      />
                                    </WrapItem>
                                  )
                              )}
                            </Wrap>
                            {/* Chỉ hiển thị thông tin màu sắc và tồn kho của các biến thể sắp hết hàng */}
                            {hasLowStock(product.variants) && (
                              <>
                                {product.variants
                                  .filter((variant) => variant.lowStockSizes?.length > 0)
                                  .map((variant, index) => (
                                    <Box key={index}>
                                      <Text fontSize="sm">
                                        Màu: {variant.color}
                                      </Text>
                                      <Text fontSize="sm" color="red.500">
                                        Sắp hết:{" "}
                                        {variant.lowStockSizes
                                          .map((size) => `${size.size} (${size.quantity})`)
                                          .join(", ")}
                                      </Text>
                                    </Box>
                                  ))}
                              </>
                            )}
                          </Box>
                        ) : (
                          <Text fontSize="sm">Không có biến thể</Text>
                        )}
                      </VStack>
                      <VStack spacing={2}>
                        <IconButton
                          icon={<Edit2 size={16} />}
                          aria-label="Sửa thông tin sản phẩm"
                          onClick={() => handleEditProductOpen(product)}
                          variant="outline"
                          size="xs"
                        />
                        <Popover>
                          <PopoverTrigger>
                            <IconButton
                              icon={<AddIcon size={16} />}
                              aria-label="Quản lý biến thể"
                              variant="outline"
                              size="xs"
                            />
                          </PopoverTrigger>
                          <PopoverContent width="200px">
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>Quản lý biến thể</PopoverHeader>
                            <PopoverBody>
                              <VStack spacing={2} align="stretch">
                                {product.variants.map((variant) => (
                                  <Button
                                    key={variant.id}
                                    onClick={() =>
                                      handleEditVariantOpen(variant)
                                    }
                                    variant="ghost"
                                    size="sm"
                                  >
                                    Sửa biến thể {variant.color}
                                  </Button>
                                ))}
                                <Button
                                  onClick={() =>
                                    handleAddVariantOpen(product.id)
                                  }
                                  variant="ghost"
                                  size="sm"
                                >
                                  Thêm biến thể mới
                                </Button>
                              </VStack>
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                        <IconButton
                          icon={<Trash2 size={16} />}
                          aria-label="Xóa sản phẩm"
                          onClick={() => handleDeleteOpen(product.id)}
                          variant="outline"
                          size="xs"
                        />
                      </VStack>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </Box>

            {products.length > 0 && (
              <Flex
                direction={{ base: "column", md: "row" }}
                justify={{ base: "center", md: "space-between" }}
                align="center"
                mt={{ base: 3, md: 4 }}
                gap={{ base: 2, md: 0 }}
              >
                <HStack spacing={{ base: 1, md: 2 }}>
                  <IconButton
                    icon={<ChevronLeft size={{ base: 16, md: 20 }} />}
                    onClick={handlePrevPage}
                    isDisabled={currentPage === 1}
                    aria-label="Trang trước"
                    variant="outline"
                    size={{ base: "xs", md: "sm" }}
                  />
                  <Text fontSize={{ base: "sm", md: "md" }}>
                    Trang {currentPage} / {totalPages}
                  </Text>
                  <IconButton
                    icon={<ChevronRight size={{ base: 16, md: 20 }} />}
                    onClick={handleNextPage}
                    isDisabled={currentPage === totalPages}
                    aria-label="Trang sau"
                    variant="outline"
                    size={{ base: "xs", md: "sm" }}
                  />
                </HStack>
                <Text fontSize={{ base: "sm", md: "md" }}>
                  Tổng: {products.length} sản phẩm
                </Text>
              </Flex>
            )}
          </TabPanel>

          <TabPanel>
            <AddProduct
              onAddSuccess={handleAddSuccess}
              brands={brands}
              categories={categories}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <AlertDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        leastDestructiveRef={undefined}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xác nhận xóa
            </AlertDialogHeader>
            <AlertDialogBody>
              Bạn có chắc muốn xóa sản phẩm này không? Hành động này không thể
              hoàn tác và sẽ xóa cả các biến thể liên quan.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onDeleteClose} variant="ghost">
                Hủy
              </Button>
              <Button onClick={handleDeleteConfirm} ml={3} variant="solid">
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <EditProduct
        isOpen={isEditProductOpen}
        onClose={onEditProductClose}
        product={productToEdit}
        onEditSuccess={handleEditProductSuccess}
        brands={brands}
        categories={categories}
      />

      <EditVariant
        isOpen={isEditVariantOpen}
        onClose={onEditVariantClose}
        variant={variantToEdit}
        onEditSuccess={handleEditVariantSuccess}
        productId={variantToEdit?.productId}
      />
    </Box>
  );
};

export default ProductManagement;