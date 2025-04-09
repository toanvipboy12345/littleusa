import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  Spinner,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  SimpleGrid,
  VStack,
  HStack,
  Button,
  Tag,
  useToast,
  Divider, // Thêm Divider từ Chakra UI
} from "@chakra-ui/react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import axiosInstance from "../../../../Api/axiosInstance";
import useDocumentTitle from "../../../../hook/useDocumentTitle";
import { Link } from "react-router-dom";

// Component hiển thị danh sách coupon
const CouponList = ({ coupons }) => {
  const toast = useToast();

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Đã sao chép mã!",
      description: `Mã ${code} đã được sao chép vào clipboard.`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box as="section" py="30px" mt={8}>
      <Heading size={{ base: "md", md: "lg" }} mb={6} textAlign="center" color="gray.800">
        Mã Giảm Giá Khả Dụng
      </Heading>
      {coupons.length === 0 ? (
        <Box textAlign="center" minH="200px">
          <Text fontSize="lg" color="gray.600">
            Hiện tại không có mã giảm giá nào khả dụng.
          </Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {coupons.map((coupon) => {
            const endDate = new Date(coupon.endDate);
            const currentDate = new Date();
            const isExpired = endDate < currentDate;
            const isAvailable = coupon.status === "ACTIVE" && !isExpired && coupon.usedCount < coupon.maxUses;

            return (
              <Box
                key={coupon.id}
                bg={isAvailable ? "white" : "gray.100"}
                borderWidth="1px"
                borderColor={isAvailable ? "gray.200" : "gray.300"}
                borderRadius="md"
                p={4}
                boxShadow="sm"
                transition="all 0.2s"
                _hover={isAvailable ? { boxShadow: "md", transform: "scale(1.02)" } : {}}
                opacity={isAvailable ? 1 : 0.6}
              >
                <VStack align="start" spacing={2}>
                  <HStack justify="space-between" w="full">
                    <Tag size="lg" colorScheme={isAvailable ? "green" : "red"} borderRadius="full">
                      {isAvailable ? "Khả dụng" : isExpired ? "Hết hạn" : "Hết lượt"}
                    </Tag>
                    <Text fontSize="sm" color="gray.500">
                      Hết hạn: {endDate.toLocaleDateString("vi-VN")}
                    </Text>
                  </HStack>
                  <Heading size="md" color="gray.800">
                    {coupon.code}
                  </Heading>
                  <Text fontSize="lg" fontWeight="bold" color="red.500">
                    Giảm {coupon.discountRate}% (Tối đa {coupon.maxDiscountAmount.toLocaleString("vi-VN")} đ)
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="teal"
                    onClick={() => handleCopyCode(coupon.code)}
                    isDisabled={!isAvailable}
                    w="full"
                  >
                    Sao chép mã
                  </Button>
                </VStack>
              </Box>
            );
          })}
        </SimpleGrid>
      )}
    </Box>
  );
};

const Promotions = () => {
  const [topDiscountedProducts, setTopDiscountedProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const imageBaseUrl = "http://localhost:8080";
  const swiperRef = useRef(null);
  const toast = useToast();

  useDocumentTitle("Khuyến Mãi Sâu Nhất");

  const fetchTopDiscountedProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await axiosInstance.get("/api/product-dto/top-discounted");
      if (Array.isArray(response.data)) {
        setTopDiscountedProducts(response.data);
      } else {
        console.error("API did not return an array:", response.data);
        setTopDiscountedProducts([]);
      }
    } catch (error) {
      console.error("Error fetching top discounted products:", error);
      setTopDiscountedProducts([]);
      toast({
        title: "Lỗi khi lấy sản phẩm giảm giá",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchCoupons = async () => {
    setLoadingCoupons(true);
    try {
      const response = await axiosInstance.get("/api/coupons/manage");
      if (Array.isArray(response.data)) {
        setCoupons(response.data);
      } else {
        console.error("API did not return an array:", response.data);
        setCoupons([]);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setCoupons([]);
      toast({
        title: "Lỗi khi lấy danh sách mã giảm giá",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setLoadingCoupons(false);
    }
  };

  useEffect(() => {
    fetchTopDiscountedProducts();
    fetchCoupons();
  }, []);

  return (
    <Box py={{ base: 4, md: 8, lg: 20 }} px={{ base: 2, md: 4, lg: 8 }} mx="auto" w={{ base: "95%", md: "90%", lg: "80%" }}>
      {/* Breadcrumb */}
      <Breadcrumb mb={6}>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Trang chủ
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Khuyến Mãi</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Slider sản phẩm giảm giá sâu nhất */}
      <Box as="section" bg="transparent" py="30px" mt={2}>
        <Box maxW={{ base: "90%", md: "100%" }} mx="auto">
          <Heading size={{ base: "md", md: "lg" }} mb={6} textAlign="center" color="gray.800">
            Sản Phẩm Giảm Giá Sâu Nhất
          </Heading>

          {loadingProducts ? (
            <Box display="flex" justifyContent="center" alignItems="center" minH="500px">
              <Spinner size="lg" color="gray.800" />
            </Box>
          ) : topDiscountedProducts.length === 0 ? (
            <Box textAlign="center" minH="500px">
              <Text fontSize="lg" color="gray.800">
                Không có sản phẩm giảm giá nào để hiển thị.
              </Text>
            </Box>
          ) : (
            <Box
              position="relative"
              className="swiper-container"
              pt={2}
              sx={{
                "& .swiper-button-next, & .swiper-button-prev": {
                  zIndex: 10,
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#000000",
                },
                "& .swiper-button-next::after, & .swiper-button-prev::after": {
                  color: "white",
                  fontSize: "20px",
                },
              }}
            >
              <Swiper
                ref={swiperRef}
                modules={[Navigation, Autoplay]}
                spaceBetween={2}
                slidesPerView={7}
                navigation
                loop={true}
                autoplay={{
                  delay: 2000,
                  disableOnInteraction: false,
                }}
              >
                {topDiscountedProducts.map((product, index) => {
                  const name = product?.name ? product.name.toLowerCase().replace(/\s+/g, "-") : "unknown-product";
                  const slug = `${name}`;
                  const key = product.variantId ?? `product-${index}`;

                  return (
                    <SwiperSlide key={key}>
                      <Link to={`/products/${product.productId}/${slug}`}>
                        <Box
                          overflow="hidden"
                          transition="transform 0.2s ease"
                          _hover={{ bg: "gray.100" }}
                        >
                          <Image
                            src={`${imageBaseUrl}${product.mainImage}`}
                            alt={product.name || "Product"}
                            h={{ base: "150px", md: "200px" }}
                            w="100%"
                            objectFit="contain"
                            mt={2}
                          />
                          <Box p={{ base: 2, md: 4 }} display="flex" flexDirection="column" justifyContent="center">
                            <Heading
                              size={{ base: "xs", md: "sm" }}
                              noOfLines={2}
                              textOverflow="ellipsis"
                              whiteSpace="normal"
                              overflow="hidden"
                              textTransform="uppercase"
                              mt={{ base: 1, md: 2 }}
                            >
                              {product.name || "Unnamed Product"}
                            </Heading>
                            <Box mt={{ base: 1, md: 1 }} display="flex" alignItems="center" gap={2}>
                              {product.discountRate === 0 ? (
                                <Text color="gray.800" fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                                  {product.price?.toLocaleString("vi-VN") || "0"} đ
                                </Text>
                              ) : (
                                <>
                                  <Text fontWeight="bold" fontSize={{ base: "sm", md: "sm" }}>
                                    {product.discountPrice?.toLocaleString("vi-VN") || "0"} đ
                                  </Text>
                                  <Text color="gray.500" textDecoration="line-through" fontSize={{ base: "sm", md: "sm" }}>
                                    {product.price?.toLocaleString("vi-VN") || "0"} đ
                                  </Text>
                                </>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Link>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </Box>
          )}
        </Box>
      </Box>

      {/* Divider phân cách giữa hai phần */}
      <Divider my={8} borderColor="gray.300" borderWidth="2px" />

      {/* Danh sách coupon */}
      {loadingCoupons ? (
        <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
          <Spinner size="lg" color="gray.800" />
        </Box>
      ) : (
        <CouponList coupons={coupons} />
      )}
    </Box>
  );
};

export default Promotions;