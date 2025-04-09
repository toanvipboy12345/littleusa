import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  SimpleGrid,
  Flex,
  Button,
  Text,
  Image,
  Heading,
  HStack,
  VStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Checkbox,
  CheckboxGroup,
  Tag,
  TagLabel,
  TagCloseButton,
  useToast,
  Spinner,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from "@chakra-ui/react";
import { ChevronDown, AlertCircle, Grid, List } from "react-feather";
import axiosInstance from "../../../../Api/axiosInstance";
import { Link, useSearchParams } from "react-router-dom";
import useDocumentTitle from "../../../../hook/useDocumentTitle";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: [],
    brand: [],
    priceMin: "",
    priceMax: "",
    hasDiscount: false, // Thêm hasDiscount vào filters
  });
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [size] = useState(30);
  const [viewMode, setViewMode] = useState("card");

  useDocumentTitle("Danh sách sản phẩm");
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  // Khởi tạo dữ liệu ban đầu khi mount
  useEffect(() => {
    const category = searchParams.get("category")?.split(",") || [];
    const brand = searchParams.get("brand")?.split(",") || [];
    const priceMin = searchParams.get("priceMin") || "";
    const priceMax = searchParams.get("priceMax") || "";
    const hasDiscount = searchParams.get("hasDiscount") === "true"; // Lấy hasDiscount từ URL
    const sortParam = searchParams.get("sort") || "";
    const pageParam = parseInt(searchParams.get("page") || "0", 10);

    setFilters({
      category,
      brand,
      priceMin,
      priceMax,
      hasDiscount, // Khởi tạo hasDiscount từ URL
    });
    setSort(sortParam);
    setPage(pageParam >= 0 ? pageParam : 0);
    updateAppliedFilters(category, brand, priceMin, priceMax, hasDiscount);

    fetchBrands();
    fetchCategories();
    fetchProducts(pageParam >= 0 ? pageParam : 0, { category, brand, priceMin, priceMax, hasDiscount, sort: sortParam });
  }, []); // Chỉ chạy khi mount

  // Theo dõi searchParams khi URL thay đổi từ Header
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category")?.split(",") || [];
    const pageFromUrl = parseInt(searchParams.get("page") || "0", 10);
    const hasDiscountFromUrl = searchParams.get("hasDiscount") === "true";

    // Chỉ fetch lại nếu category hoặc hasDiscount từ URL khác với filters hiện tại
    if (
      JSON.stringify(categoryFromUrl) !== JSON.stringify(filters.category) ||
      hasDiscountFromUrl !== filters.hasDiscount
    ) {
      setFilters((prev) => ({
        ...prev,
        category: categoryFromUrl,
        hasDiscount: hasDiscountFromUrl,
      }));
      setPage(0); // Reset về page 0 khi danh mục hoặc hasDiscount thay đổi
      updateAppliedFilters(categoryFromUrl, filters.brand, filters.priceMin, filters.priceMax, hasDiscountFromUrl);
      fetchProducts(0, { ...filters, category: categoryFromUrl, hasDiscount: hasDiscountFromUrl });
    } else if (pageFromUrl !== page) {
      // Nếu chỉ page thay đổi, fetch lại với page mới
      setPage(pageFromUrl);
      fetchProducts(pageFromUrl, filters);
    }
  }, [searchParams]); // Theo dõi searchParams

  const updateAppliedFilters = (cat, br, min, max, hasDiscount) => {
    const filtersList = [];
    if (cat.length > 0) filtersList.push(`Danh mục: ${cat.join(", ")}`);
    if (br.length > 0) filtersList.push(`Thương hiệu: ${br.join(", ")}`);
    if (min) filtersList.push(`Giá từ: ${min} đ`);
    if (max) filtersList.push(`Giá đến: ${max} đ`);
    if (hasDiscount) filtersList.push("Sản phẩm khuyến mại"); // Thêm bộ lọc khuyến mại vào danh sách
    setAppliedFilters(filtersList);
  };

  const fetchBrands = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/brands");
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  const fetchProducts = useCallback(
    async (currentPage, appliedFilters) => {
      setLoading(true);
      const startTime = Date.now();

      try {
        const response = await axiosInstance.get("/api/product-dto/cards", {
          params: {
            page: currentPage,
            size,
            category: appliedFilters.category.length > 0 ? appliedFilters.category.join(",") : undefined,
            brand: appliedFilters.brand.length > 0 ? appliedFilters.brand.join(",") : undefined,
            priceMin: appliedFilters.priceMin || undefined,
            priceMax: appliedFilters.priceMax || undefined,
            hasDiscount: appliedFilters.hasDiscount || undefined, // Thêm hasDiscount vào params
            sort: sort || undefined,
          },
        });
        setProducts(response.data.products);
        const totalCards = response.data.total;
        setTotalPages(Math.ceil(totalCards / size) || 1);

        const elapsedTime = Date.now() - startTime;
        const remainingTime = 1000 - elapsedTime;
        if (remainingTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingTime));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Lỗi khi lấy sản phẩm",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [size, sort, toast]
  );

  const handleFilterChange = (type) => (value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleSortChange = (sortValue) => {
    setSort(sortValue);
  };

  const removeFilter = (filterToRemove) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (filterToRemove.startsWith("Danh mục:")) newFilters.category = [];
      else if (filterToRemove.startsWith("Thương hiệu:")) newFilters.brand = [];
      else if (filterToRemove.startsWith("Giá từ:")) newFilters.priceMin = "";
      else if (filterToRemove.startsWith("Giá đến:")) newFilters.priceMax = "";
      else if (filterToRemove === "Sản phẩm khuyến mại") newFilters.hasDiscount = false; // Xóa bộ lọc khuyến mại
      updateAppliedFilters(newFilters.category, newFilters.brand, newFilters.priceMin, newFilters.priceMax, newFilters.hasDiscount);
      fetchProducts(page, newFilters);
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    const newFilters = {
      category: [],
      brand: [],
      priceMin: "",
      priceMax: "",
      hasDiscount: false, // Reset hasDiscount
    };
    setFilters(newFilters);
    setSort("");
    setPage(0);
    setAppliedFilters([]);
    setSearchParams({ page: "0" });
    fetchProducts(0, newFilters);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      setSearchParams({ ...Object.fromEntries(searchParams), page: newPage.toString() });
      fetchProducts(newPage, filters);
    }
  };

  const applyFilters = () => {
    setPage(0);
    updateAppliedFilters(filters.category, filters.brand, filters.priceMin, filters.priceMax, filters.hasDiscount);
    const params = new URLSearchParams();
    if (filters.category.length > 0) params.set("category", filters.category.join(","));
    if (filters.brand.length > 0) params.set("brand", filters.brand.join(","));
    if (filters.priceMin) params.set("priceMin", filters.priceMin);
    if (filters.priceMax) params.set("priceMax", filters.priceMax);
    if (filters.hasDiscount) params.set("hasDiscount", filters.hasDiscount.toString()); // Thêm hasDiscount vào params
    if (sort) params.set("sort", sort);
    params.set("page", "0");
    setSearchParams(params);
    fetchProducts(0, filters);
  };

  const imageBaseUrl = "http://localhost:8080";

  return (
    <Box py={{ base: 4, md: 8, lg: 20 }} px={{ base: 2, md: 4, lg: 8 }} mx="auto" w={{ base: "95%", md: "90%", lg: "80%" }}>
      <Breadcrumb mb={6}>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Trang chủ
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Sản phẩm</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Flex direction={{ base: "column", md: "row" }} gap={6}>
        <Box w={{ base: "100%", md: "25%" }}>
          <Box bg="gray.50" p={4} borderRadius="md" boxShadow="md" transition="all 0.2s">
            <Heading size="md" color="gray.800" mb={4}>
              Bộ lọc
            </Heading>
            <Accordion allowMultiple>
              <AccordionItem>
                <AccordionButton _hover={{ bg: "gray.100" }}>
                  <Box flex="1" textAlign="left">
                    <Text fontWeight="bold">Danh mục</Text>
                  </Box>
                  <Box as={ChevronDown} size={20} transition="transform 0.2s" transform="rotate(0deg)" _expanded={{ transform: "rotate(180deg)" }} />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <CheckboxGroup value={filters.category} onChange={handleFilterChange("category")}>
                    <SimpleGrid columns={2} spacing={2}>
                      {categories.map((cat) => (
                        <Checkbox key={cat.id} value={cat.name}>
                          {cat.name}
                        </Checkbox>
                      ))}
                    </SimpleGrid>
                  </CheckboxGroup>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton _hover={{ bg: "gray.100" }}>
                  <Box flex="1" textAlign="left">
                    <Text fontWeight="bold">Thương hiệu</Text>
                  </Box>
                  <Box as={ChevronDown} size={20} transition="transform 0.2s" transform="rotate(0deg)" _expanded={{ transform: "rotate(180deg)" }} />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <CheckboxGroup value={filters.brand} onChange={handleFilterChange("brand")}>
                    <SimpleGrid columns={2} spacing={2}>
                      {brands.map((brand) => (
                        <Checkbox key={brand.id} value={brand.name}>
                          {brand.name}
                        </Checkbox>
                      ))}
                    </SimpleGrid>
                  </CheckboxGroup>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton _hover={{ bg: "gray.100" }}>
                  <Box flex="1" textAlign="left">
                    <Text fontWeight="bold">Giá</Text>
                  </Box>
                  <Box as={ChevronDown} size={20} transition="transform 0.2s" transform="rotate(0deg)" _expanded={{ transform: "rotate(180deg)" }} />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack spacing={4} align="stretch">
                    <RangeSlider
                      aria-label={["min", "max"]}
                      defaultValue={[filters.priceMin ? parseInt(filters.priceMin) : 0, filters.priceMax ? parseInt(filters.priceMax) : 3000000]}
                      min={0}
                      max={3000000}
                      step={100000}
                      onChange={(values) => {
                        setFilters((prev) => ({
                          ...prev,
                          priceMin: values[0] === 0 ? "" : values[0],
                          priceMax: values[1] === 3000000 ? "" : values[1],
                        }));
                      }}
                    >
                      <RangeSliderTrack bg="gray.200">
                        <RangeSliderFilledTrack bg="black" />
                      </RangeSliderTrack>
                      <RangeSliderThumb index={0} boxSize={4} bg="black" />
                      <RangeSliderThumb index={1} boxSize={4} bg="black" />
                    </RangeSlider>
                    <HStack justify="space-between">
                      <Text fontSize="sm">
                        {filters.priceMin ? `${parseInt(filters.priceMin).toLocaleString("vi-VN")} đ` : "Tối thiểu"}
                      </Text>
                      <Text fontSize="sm">
                        {filters.priceMax ? `${parseInt(filters.priceMax).toLocaleString("vi-VN")} đ` : "Tối đa"}
                      </Text>
                    </HStack>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>

              {/* Thêm bộ lọc Sản phẩm khuyến mại */}
              <AccordionItem>
                <AccordionButton _hover={{ bg: "gray.100" }}>
                  <Box flex="1" textAlign="left">
                    <Text fontWeight="bold">Khuyến mại</Text>
                  </Box>
                  <Box as={ChevronDown} size={20} transition="transform 0.2s" transform="rotate(0deg)" _expanded={{ transform: "rotate(180deg)" }} />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Checkbox
                    isChecked={filters.hasDiscount}
                    onChange={(e) => handleFilterChange("hasDiscount")(e.target.checked)}
                  >
                    Sản phẩm khuyến mại
                  </Checkbox>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton _hover={{ bg: "gray.100" }}>
                  <Box flex="1" textAlign="left">
                    <Text fontWeight="bold">Sắp xếp theo</Text>
                  </Box>
                  <Box as={ChevronDown} size={20} transition="transform 0.2s" transform="rotate(0deg)" _expanded={{ transform: "rotate(180deg)" }} />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack spacing={2} align="stretch">
                    <Button
                      variant="outline"
                      borderColor={sort === "price_asc" ? "black" : "gray.300"}
                      bg={sort === "price_asc" ? "black" : "white"}
                      color={sort === "price_asc" ? "white" : "black"}
                      onClick={() => handleSortChange("price_asc")}
                    >
                      Giá: Thấp đến Cao
                    </Button>
                    <Button
                      variant="outline"
                      borderColor={sort === "price_desc" ? "black" : "gray.300"}
                      bg={sort === "price_desc" ? "black" : "white"}
                      color={sort === "price_desc" ? "white" : "black"}
                      onClick={() => handleSortChange("price_desc")}
                    >
                      Giá: Cao đến Thấp
                    </Button>
                    <Button
                      variant="outline"
                      borderColor={sort === "created_at_desc" ? "black" : "gray.300"}
                      bg={sort === "created_at_desc" ? "black" : "white"}
                      color={sort === "created_at_desc" ? "white" : "black"}
                      onClick={() => handleSortChange("created_at_desc")}
                    >
                      Mới nhất
                    </Button>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Button mt={4} variant="solid" onClick={applyFilters} w="full">
              Áp dụng bộ lọc
            </Button>
            <Button mt={2} variant="outline" onClick={clearAllFilters} w="full">
              Xóa tất cả
            </Button>
          </Box>
          {appliedFilters.length > 0 && (
            <Box mt={4}>
              <HStack spacing={2} wrap="wrap">
                {appliedFilters.map((filter, index) => (
                  <Tag key={index} size="md" borderRadius="full" variant="subtle" _hover={{ bg: "gray.200" }}>
                    <TagLabel>{filter}</TagLabel>
                    <TagCloseButton onClick={() => removeFilter(filter)} />
                  </Tag>
                ))}
              </HStack>
            </Box>
          )}
        </Box>

        <Box w={{ base: "100%", md: "75%" }}>
          <Flex justify="flex-end" mb={4}>
            <HStack spacing={2}>
              <Button
                variant={viewMode === "card" ? "solid" : "outline"}
                onClick={() => setViewMode("card")}
                p={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Grid size={20} />
              </Button>
              <Button
                variant={viewMode === "list" ? "solid" : "outline"}
                onClick={() => setViewMode("list")}
                p={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <List size={20} />
              </Button>
            </HStack>
          </Flex>

          {loading ? (
            <Flex justify="center" align="center" minH="500px">
              <Spinner thickness="2px" speed="0.65s" emptyColor="gray.200" color="black" size="lg" />
            </Flex>
          ) : products.length === 0 ? (
            <Flex justify="center" align="center" minH="500px" direction="column" gap={4}>
              <Box as={AlertCircle} size={48} color="gray.500" />
              <Text fontSize="lg" color="gray.600">Không có sản phẩm nào để hiển thị.</Text>
            </Flex>
          ) : viewMode === "card" ? (
            <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={{ base: 4, md: 6 }}>
              {products.map((product) => {
                const name = product?.name ? product.name.toLowerCase().replace(/\s+/g, "-") : "unknown-product";
                const slug = `${name}`;
                return (
                  <Link
                    key={product.variantId}
                    to={`/products/${product.productId}/${slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Box
                      bg="white"
                      overflow="hidden"
                      transition="transform 0.2s ease"
                      _hover={{ transform: "scale(1.05)", bg: "gray.100" }}
                    >
                      <Image
                        src={`${imageBaseUrl}${product.mainImage}`}
                        alt={product.name || "Product"}
                        h={{ base: "150px", md: "200px" }}
                        w="100%"
                        objectFit="contain"
                        fallbackSrc="https://via.placeholder.com/200"
                      />
                      <Box p={{ base: 4, md: 4 }} position="relative">
                        <Heading
                          size={{ base: "xs", md: "sm" }}
                          color="gray.800"
                          noOfLines={2}
                          textOverflow="ellipsis"
                          whiteSpace="normal"
                          overflow="hidden"
                        >
                          {product.name || "Unnamed Product"}
                        </Heading>
                        <HStack mt={{ base: 1, md: 2 }} spacing={2}>
                          {product.discountRate === 0 ? (
                            <Text color="gray.800" fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                              {product.price?.toLocaleString("vi-VN") || "0"} đ
                            </Text>
                          ) : (
                            <>
                              <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                                {product.discountPrice?.toLocaleString("vi-VN") || "0"} đ
                              </Text>
                              <Text color="gray.500" textDecoration="line-through" fontSize={{ base: "sm", md: "md" }}>
                                {product.price?.toLocaleString("vi-VN") || "0"} đ
                              </Text>
                            </>
                          )}
                        </HStack>
                      </Box>
                    </Box>
                  </Link>
                );
              })}
            </SimpleGrid>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {products.map((product) => {
                const name = product?.name ? product.name.toLowerCase().replace(/\s+/g, "-") : "unknown-product";
                const slug = `${name}`;
                return (
                  <Link
                    key={product.variantId}
                    to={`/products/${product.productId}/${slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Flex
                      p={{ base: 2, md: 4 }}
                      transition="transform 0.2s ease"
                      _hover={{ transform: "scale(1.02)", bg: "gray.100" }}
                      align="start"
                      minH={{ base: "120px", md: "150px" }}
                    >
                      <Image
                        src={`${imageBaseUrl}${product.mainImage}`}
                        alt={product.name || "Product"}
                        boxSize={{ base: "100px", md: "150px" }}
                        objectFit="cover"
                        mr={{ base: 2, md: 4 }}
                        fallbackSrc="https://via.placeholder.com/100"
                      />
                      <VStack align="start" flex="1" spacing={2}>
                        <Heading
                          size={{ base: "sm", md: "md" }}
                          color="gray.800"
                          noOfLines={2}
                          textOverflow="ellipsis"
                          whiteSpace="normal"
                          overflow="hidden"
                          w="100%"
                        >
                          {product.name || "Unnamed Product"}
                        </Heading>
                        <HStack spacing={2}>
                          {product.discountRate === 0 ? (
                            <Text color="gray.800" fontWeight="bold">
                              {product.price?.toLocaleString("vi-VN") || "0"} đ
                            </Text>
                          ) : (
                            <>
                              <Text fontWeight="bold">
                                {product.discountPrice?.toLocaleString("vi-VN") || "0"} đ
                              </Text>
                              <Text color="gray.500" textDecoration="line-through">
                                {product.price?.toLocaleString("vi-VN") || "0"} đ
                              </Text>
                            </>
                          )}
                        </HStack>
                      </VStack>
                    </Flex>
                  </Link>
                );
              })}
            </SimpleGrid>
          )}

          <Flex justify="center" mt={6} wrap="wrap" gap={2}>
            <Button onClick={() => handlePageChange(page - 1)} isDisabled={page === 0} variant="outline" size="sm">
              Trước
            </Button>
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index}
                onClick={() => handlePageChange(index)}
                variant={page === index ? "solid" : "outline"}
                size="sm"
                mx={1}
              >
                {index + 1}
              </Button>
            ))}
            <Button onClick={() => handlePageChange(page + 1)} isDisabled={page + 1 >= totalPages} variant="outline" size="sm">
              Sau
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Product;