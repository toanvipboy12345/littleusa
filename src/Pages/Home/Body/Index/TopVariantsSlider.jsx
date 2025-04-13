import React, { useState, useEffect, useRef } from "react";
import { Box, Heading, Text, Image, Spinner } from "@chakra-ui/react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import axiosInstance from "../../../../Api/axiosInstance";
import { Link } from "react-router-dom";

const TopVariantsSlider = () => {
  const [topVariants, setTopVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const imageBaseUrl = "http://localhost:8080";
  const swiperRef = useRef(null);

  const fetchTopVariants = async () => {
    setLoading(true);
    try {
      // Lấy ngày hiện tại theo múi giờ địa phương
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0"); // getMonth() trả về 0-11, nên +1
      const day = String(now.getDate()).padStart(2, "0");
      const currentDate = `${year}-${month}-${day}`; // Ví dụ: "2025-11-04"
      console.log("Current Date:", currentDate);

      // Thay đổi endpoint từ /top-variants sang /top-variants-quantity
      const response = await axiosInstance.get("/api/statistics/top-variants-quantity", {
        params: {
          startDate: "2025-01-01", // Ngày bắt đầu cố định
          endDate: currentDate,    // Ngày kết thúc là ngày hiện tại
        },
      });
      if (Array.isArray(response.data)) {
        setTopVariants(response.data);
      } else {
        console.error("API did not return an array:", response.data);
        setTopVariants([]);
      }
    } catch (error) {
      console.error("Error fetching top variants by quantity sold:", error);
      setTopVariants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopVariants();
  }, []);

  // Cập nhật Swiper khi thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.update(); // Cập nhật Swiper
        swiperRef.current.swiper.updateSlides(); // Cập nhật slides
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Gọi lần đầu khi component mount

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box as="section" bg="transparent" py="30px" mt={2}>
      <Box maxW={{ base: "90%", md: "80%" }} mx="auto">
        <Heading
              fontSize={{ base: "2rem", md: "2.5rem" }}
              mb={6}
          textAlign="center"
          color="gray.800"
        >
          SẢN PHẨM NỔI BẬT
        </Heading>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minH="500px">
            <Spinner size="lg" color="gray.800" />
          </Box>
        ) : topVariants.length === 0 ? (
          <Box textAlign="center" minH="500px">
            <Text fontSize="lg" color="gray.800">
              Không có sản phẩm bán chạy nào để hiển thị.
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
                width: { base: "30px", md: "40px" },
                height: { base: "30px", md: "40px" },
                borderRadius: "50%",
                background: "#000000",
                display: { base: "none", md: "flex" }, // Ẩn nút điều hướng trên mobile
              },
              "& .swiper-button-next::after, & .swiper-button-prev::after": {
                color: "white",
                fontSize: { base: "16px", md: "20px" },
              },
            }}
          >
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Autoplay]}
              navigation
              loop={true}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              onBreakpoint={(swiper, breakpointParams) => {
                console.log("Current breakpoint params:", breakpointParams); // Log để kiểm tra breakpoint
              }}
              onSwiper={(swiper) => {
                console.log("Swiper initialized:", swiper); // Log khi Swiper khởi tạo
              }}
              breakpoints={{
                0: {
                  slidesPerView: 2, // Mobile: 2 sản phẩm
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 4, // Tablet: 4 sản phẩm
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 5, // Desktop nhỏ: 5 sản phẩm
                  spaceBetween: 20,
                },
                1280: {
                  slidesPerView: 7, // Desktop lớn: 7 sản phẩm
                  spaceBetween: 20,
                },
              }}
            >
              {topVariants.map((variant, index) => {
                const name = variant?.name
                  ? variant.name.toLowerCase().replace(/\s+/g, "-")
                  : "unknown-product";
                const slug = `${name}`;
                const key = variant.id ?? `variant-${index}`;

                return (
                  <SwiperSlide
                    key={key}
                    style={{ width: "auto", maxWidth: "100%" }} // Đảm bảo slide không bị cố định kích thước
                  >
                    <Link to={`/products/${variant.productId}/${slug}`}>
                      <Box
                        overflow="hidden"
                        transition="transform 0.2s ease"
                        _hover={{ bg: "gray.100" }}
                        width="100%" // Đảm bảo Box chiếm toàn bộ chiều rộng của slide
                      >
                        <Image
                          src={`${imageBaseUrl}${variant.mainImage}`}
                          alt={variant.name || "Product"}
                          h={{ base: "120px", sm: "140px", md: "200px" }}
                          w="100%"
                          objectFit="contain"
                          mt={2}
                          loading="lazy" // Tối ưu tải hình ảnh
                        />
                        <Box
                          p={{ base: 1, sm: 2, md: 4 }}
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          textAlign="center"
                        >
                          <Heading
                            size={{ base: "xs", sm: "sm", md: "sm" }}
                            noOfLines={2}
                            textOverflow="ellipsis"
                            whiteSpace="normal"
                            overflow="hidden"
                            textTransform="uppercase"
                            mt={{ base: 1, md: 2 }}
                          >
                            {variant.name || "Unnamed Product"}
                          </Heading>
                          <Box
                            mt={{ base: 1, md: 1 }}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            gap={2}
                          >
                            {variant.discountPrice === variant.price ? (
                              <Text
                                color="gray.800"
                                fontWeight="bold"
                                fontSize={{ base: "sm", sm: "md", md: "md" }}
                              >
                                {variant.price?.toLocaleString("vi-VN") || "0"} đ
                              </Text>
                            ) : (
                              <>
                                <Text
                                  fontWeight="bold"
                                  fontSize={{ base: "sm", sm: "md", md: "sm" }}
                                >
                                  {variant.discountPrice?.toLocaleString("vi-VN") || "0"} đ
                                </Text>
                                <Text
                                  color="gray.500"
                                  textDecoration="line-through"
                                  fontSize={{ base: "xs", sm: "sm", md: "sm" }}
                                >
                                  {variant.price?.toLocaleString("vi-VN") || "0"} đ
                                </Text>
                              </>
                            )}
                          </Box>
                          <Text
                            mt={1}
                            fontSize={{ base: "xs", sm: "sm", md: "sm" }}
                            color="gray.600"
                          >
                            Đã bán: {variant.quantitySold || 0}
                          </Text>
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
  );
};

export default TopVariantsSlider;