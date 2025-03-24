import React, { useState, useEffect, useRef } from "react";
import { Box, Heading, Text, Image, Spinner } from "@chakra-ui/react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules"; // Thêm Autoplay module
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
      const response = await axiosInstance.get("/api/statistics/top-variants", {
        params: {
          startDate: "2025-01-01",
          endDate: "2025-03-31",
        },
      });
      if (Array.isArray(response.data)) {
        setTopVariants(response.data);
      } else {
        console.error("API did not return an array:", response.data);
        setTopVariants([]);
      }
    } catch (error) {
      console.error("Error fetching top variants:", error);
      setTopVariants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopVariants();
  }, []);

  return (
    <Box as="section" bg="transparent" py="30px" mt={2}>
      <Box maxW={{ base: "90%", md: "80%" }} mx="auto">
        <Heading size={{ base: "md", md: "lg" }} mb={6} textAlign="center" color="gray.800">
          Sản Phẩm Bán Chạy
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
              modules={[Navigation, Autoplay]} // Thêm Autoplay vào modules
              spaceBetween={2}
              slidesPerView={7}
              navigation
              loop={true} // Giữ vòng lặp
              autoplay={{ // Thêm cấu hình autoplay
                delay: 2000, // 2 giây
                disableOnInteraction: false, // Tiếp tục autoplay sau khi người dùng tương tác
              }}
            >
              {topVariants.map((variant, index) => {
                const name = variant?.name ? variant.name.toLowerCase().replace(/\s+/g, "-") : "unknown-product";
                const slug = `${name}`;
                const key = variant.id ?? `variant-${index}`;

                return (
                  <SwiperSlide key={key}>
                    <Link to={`/products/${variant.productId}/${slug}`}>
                      <Box
                        overflow="hidden"
                        transition="transform 0.2s ease"
                        _hover={{ bg: "gray.100" }}
                      >
                        <Image
                          src={`${imageBaseUrl}${variant.mainImage}`}
                          alt={variant.name || "Product"}
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
                            {variant.name || "Unnamed Product"}
                          </Heading>
                          <Box mt={{ base: 1, md: 1 }} display="flex" alignItems="center" gap={2}>
                            {variant.discountRate === 0 ? (
                              <Text color="gray.800" fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                                {variant.price?.toLocaleString("vi-VN") || "0"} đ
                              </Text>
                            ) : (
                              <>
                                <Text fontWeight="bold" fontSize={{ base: "sm", md: "sm" }}>
                                  {variant.discountPrice?.toLocaleString("vi-VN") || "0"} đ
                                </Text>
                                <Text color="gray.500" textDecoration="line-through" fontSize={{ base: "sm", md: "sm" }}>
                                  {variant.price?.toLocaleString("vi-VN") || "0"} đ
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
  );
};

export default TopVariantsSlider;