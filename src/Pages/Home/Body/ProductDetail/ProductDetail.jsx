import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../../../../Api/axiosInstance";
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Button,
  Input,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Heart } from "react-feather";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import { useCart } from "../../../../context/CartContext";
import useDocumentTitle from "../../../../hook/useDocumentTitle";
import { UserContext } from "../../../../context/UserContext"; // Import UserContext

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const BASE_URL = "http://localhost:8080";
  const { addToCart } = useCart();
  const { user } = useContext(UserContext); // Lấy user từ UserContext

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        const [productResponse, detailResponse] = await Promise.all([
          axiosInstance.get(`/api/products/${id}`),
          axiosInstance.get(`/api/product-dto/details/${id}`),
        ]);

        const productData = {
          ...productResponse.data,
          brandName: detailResponse.data.brandName || "Unknown Brand",
          categoryName: detailResponse.data.categoryName || "Unknown Category",
        };
        setProduct(productData);

        const slugParts = slug.split("-");
        const variantColor = slugParts[slugParts.length - 1].toLowerCase();
        const initialVariant =
          productData.variants.find((v) => v.color.toLowerCase() === variantColor) || productData.variants[0];
        setSelectedVariant(initialVariant);

        const expectedSlug = `${productData.name
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")}-${initialVariant.color
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")}`;
        if (slug !== expectedSlug) {
          navigate(`/products/${id}/${expectedSlug}`, { replace: true });
        }
      } catch (error) {
        console.error("Error fetching product detail:", error);
        toast({ title: "Lỗi khi lấy chi tiết sản phẩm", status: "error", duration: 2000, isClosable: true });
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id, slug, navigate, toast]);

  const productName = product?.name || "Sản Phẩm";
  const variantColor = selectedVariant?.color || "";
  useDocumentTitle(`${productName} - ${variantColor}`);

  const handleSizeSelect = (size) => setSelectedSize(size);

  const handleQuantityChange = (action) => {
    if (action === "decrease" && quantity > 1) setQuantity(quantity - 1);
    else if (action === "increase") setQuantity(quantity + 1);
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setSelectedSize(null);
    const newSlug = `${product.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")}-${variant.color.trim().toLowerCase().replace(/\s+/g, "-").replace(/-+/g, "-")}`;
    navigate(`/products/${id}/${newSlug}`);
  };

  const addToCartHandler = async () => {
    if (!selectedSize || !selectedVariant || !quantity) {
      toast({ title: "Vui lòng chọn kích thước và số lượng!", status: "warning", duration: 2000, isClosable: true });
      return;
    }

    const size = selectedVariant.sizes.find((s) => s.size === selectedSize);
    if (!size) {
      toast({ title: "Kích thước không hợp lệ!", status: "error", duration: 2000, isClosable: true });
      return;
    }

    try {
      const sizes = [{ sizeId: size.id, quantity }];
      await addToCart(product.id, selectedVariant.id, sizes);
      toast({ title: "Đã thêm vào giỏ hàng", status: "success", duration: 2000, isClosable: true });
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response && error.response.status === 500) {
        toast({
          title: "Lỗi khi thêm vào giỏ hàng",
          description: "Vui lòng thử lại sau.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Lỗi khi thêm vào giỏ hàng",
          description: error.message || "Vui lòng thử lại.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  // Hàm xử lý thêm vào wishlist
  const addToWishlistHandler = async () => {
    if (!selectedVariant) {
      toast({ title: "Vui lòng chọn biến thể sản phẩm!", status: "warning", duration: 2000, isClosable: true });
      return;
    }

    try {
      // Lấy wishlistToken từ localStorage nếu có
      let wishlistToken = localStorage.getItem("wishlistToken");

      // Sử dụng userId từ UserContext nếu người dùng đã đăng nhập
      const userId = user ? user.id : null;

      const response = await axiosInstance.post("/api/wishlist/add", null, {
        params: {
          userId: userId, // Ưu tiên userId nếu người dùng đã đăng nhập
          wishlistToken: userId ? null : wishlistToken, // Chỉ sử dụng wishlistToken nếu không có userId
          variantId: selectedVariant.id,
        },
      });

      // Nếu không có userId và wishlistToken được trả về, lưu vào localStorage
      if (!userId && response.data.wishlistToken) {
        localStorage.setItem("wishlistToken", response.data.wishlistToken);
      }

      toast({
        title: "Đã thêm vào danh sách yêu thích",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast({
        title: "Lỗi khi thêm vào danh sách yêu thích",
        description: error.response?.data?.message || "Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box py={{ base: 4, md: 8, lg: 20 }} px={{ base: 2, md: 4, lg: 8 }} mx="auto" w={{ base: "95%", md: "90%", lg: "75%" }}>
        <Flex justify="center" align="center" minH="500px">
          <Spinner thickness="2px" speed="0.65s" emptyColor="gray.200" color="black" size="lg" />
        </Flex>
      </Box>
    );
  }

  if (!product || !product.variants || product.variants.length === 0) {
    return (
      <Box py={{ base: 4, md: 8, lg: 20 }} px={{ base: 2, md: 4, lg: 8 }} mx="auto" w={{ base: "95%", md: "90%", lg: "75%" }}>
        <Text textAlign="center">Không tìm thấy sản phẩm hoặc dữ liệu không hợp lệ.</Text>
      </Box>
    );
  }

  const variant = selectedVariant || {};
  const mainImage = variant.mainImage || "";
  const images = variant.images || [];
  const getImageUrl = (imagePath) => `${BASE_URL}${imagePath}`;

  return (
    <Box py={{ base: 8, md: 12, lg: 20 }} px={{ base: 2, md: 4, lg: 8 }} mx="auto" w={{ base: "95%", md: "90%", lg: "70%" }}>
      <Flex direction={{ base: "column", md: "row" }} gap={8}>
        <Box w={{ base: "100%", md: "50%" }}>
          {(mainImage || (images && images.length > 0)) && (
            <>
              <Swiper
                modules={[Thumbs]}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                spaceBetween={10}
                slidesPerView={1}
                style={{ width: "100%" }}
              >
                {mainImage && (
                  <SwiperSlide>
                    <Image src={getImageUrl(mainImage)} alt={product.name || "Product"} objectFit="cover" w="100%" />
                  </SwiperSlide>
                )}
                {images &&
                  images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <Image src={getImageUrl(image)} alt={`Hình ${index + 1}`} objectFit="cover" w="100%" />
                    </SwiperSlide>
                  ))}
              </Swiper>
              {(mainImage || (images && images.length > 0)) && (
                <Swiper
                  onSwiper={setThumbsSwiper}
                  modules={[Thumbs]}
                  style={{ marginTop: "5px" }}
                  spaceBetween={5}
                  slidesPerView={4}
                  watchSlidesProgress
                >
                  {mainImage && (
                    <SwiperSlide>
                      <Image
                        src={getImageUrl(mainImage)}
                        alt={product.name || "Product"}
                        objectFit="cover"
                        w="100%"
                        cursor="pointer"
                        _hover={{ opacity: 0.8 }}
                      />
                    </SwiperSlide>
                  )}
                  {images &&
                    images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <Image
                          src={getImageUrl(image)}
                          alt={`Hình ${index + 1}`}
                          objectFit="cover"
                          w="100%"
                          cursor="pointer"
                          _hover={{ opacity: 0.8 }}
                        />
                      </SwiperSlide>
                    ))}
                </Swiper>
              )}
            </>
          )}
          {!(mainImage || (images && images.length > 0)) && (
            <Box textAlign="center" p={4}>Không có hình ảnh sản phẩm.</Box>
          )}
        </Box>
        <VStack w={{ base: "100%", md: "50%" }} align="start" spacing={4}>
          <Text fontSize={{ base: "2xs", md: "2xs", lg: "sm" }}>
            <Link to="/">Trang chủ</Link> / <Link to="/products">{product.categoryName || "Unknown Category"}</Link> / <Link to="/products">{product.brandName || "Unknown Brand"}</Link> / {(product.name || "Unnamed Product").toUpperCase()}
          </Text>
          <Heading size="lg" textTransform="uppercase">
            {(product.name || "Unnamed Product")} - {(variant.color || "Unknown").replace(/\s+/g, "-")}
          </Heading>
          {product.discountRate > 0 ? (
            <HStack spacing={3}>
              <Text fontSize="xl" textDecoration="line-through"> {product.price.toLocaleString("vi-VN")} VND</Text>
              <Text fontSize="xl" fontWeight="bold"> {product.discountPrice.toLocaleString("vi-VN")} VND</Text>
            </HStack>
          ) : (
            <Text fontSize="xl" fontWeight="bold">
              {product.price.toLocaleString("vi-VN")} VND
            </Text>
          )}
          {product.variants.length > 0 && (
            <Box>
              <HStack spacing={2}>
                {product.variants.map((variant) => (
                  <Image
                    key={variant.id}
                    src={getImageUrl(variant.mainImage || "")}
                    alt={`Variant ${variant.color || "Unknown"}`}
                    w="60px"
                    h="60px"
                    objectFit="cover"
                    cursor="pointer"
                    border={selectedVariant?.id === variant.id ? "1px solid black" : "1px solid gray"}
                    _hover={{ border: "1px solid black" }}
                    onClick={() => handleVariantSelect(variant)}
                  />
                ))}
              </HStack>
            </Box>
          )}
          {variant.sizes?.length > 0 && (
            <Box>
              <Text fontWeight="bold" mb={2}>Size:</Text>
              <HStack spacing={2} wrap="nowrap">
                {variant.sizes.map((size) => (
                  <Button
                    key={size.id}
                    onClick={() => handleSizeSelect(size.size)}
                    variant={selectedSize === size.size ? "solid" : "outline"}
                    bg={selectedSize === size.size ? "black" : "transparent"}
                    color={selectedSize === size.size ? "white" : "black"}
                    borderColor="black"
                    borderWidth="1px"
                    p={2}
                    h="40px"
                    borderRadius="0"
                  >
                    {size.size}
                  </Button>
                ))}
              </HStack>
            </Box>
          )}
          <HStack spacing={2} w="full" align="center">
            <Button variant="outline" size="sm" onClick={() => handleQuantityChange("decrease")} h="40px" borderRadius="0" _hover={{ bg: "gray.200" }}>-</Button>
            <Input
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              type="number"
              size="sm"
              w="60px"
              h="40px"
              textAlign="center"
              borderColor="black"
              borderWidth="1px"
              borderRadius="0"
              _hover={{ borderColor: "gray.500" }}
              _focus={{ borderColor: "black", boxShadow: "none" }}
            />
            <Button variant="outline" size="sm" onClick={() => handleQuantityChange("increase")} h="40px" borderRadius="0" _hover={{ bg: "gray.200" }}>+</Button>
            <Button variant="solid" bg="black" color="white" size="sm" flex="1" onClick={addToCartHandler} textTransform="uppercase" h="40px" borderRadius="0">
              Thêm vào giỏ hàng
            </Button>
          </HStack>
          <HStack spacing={2}>
            <Button
              variant="solid"
              bg="black"
              color="white"
              size="sm"
              onClick={() => toast({ title: "Liên hệ để mua hàng", status: "info", duration: 2000, isClosable: true })}
              textTransform="uppercase"
              h="40px"
              borderRadius="0"
            >
              Liên hệ mua hàng
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Heart />}
              onClick={addToWishlistHandler}
              textTransform="uppercase"
              h="40px"
              borderRadius="0"
            >
              Yêu thích
            </Button>
          </HStack>
          <Text fontSize="md" whiteSpace="pre-wrap" mt={4}>
            {product.description || "Không có mô tả."}
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
};

export default ProductDetail;