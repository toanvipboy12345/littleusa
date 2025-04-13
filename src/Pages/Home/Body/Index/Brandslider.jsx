import React, { useState, useEffect } from "react";
import { Box, Text, Image } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import axios from "../../../../Api/axiosInstance";

const Brandslider = () => {
  const baseUrl = "http://localhost:8080";
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách brands từ API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("/api/brands");
        const fetchedBrands = response.data;
        if (fetchedBrands.length < 7) {
          setBrands([...fetchedBrands, ...fetchedBrands]); // Nhân đôi tạm thời
        } else {
          setBrands(fetchedBrands);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <Box
      as="section"
      id="brand-slider"
      w="100%"
      mx="auto"
      my={5}
      bg="white"
    >
      {loading ? (
        <Text textAlign="center">Đang tải...</Text>
      ) : brands.length === 0 ? (
        <Text textAlign="center">Không có thương hiệu nào.</Text>
      ) : (
        <Swiper
          modules={[Autoplay]}
          spaceBetween={0}
          autoplay={{
            delay: 1, // Giữ delay nhỏ để speed hoạt động
            disableOnInteraction: false,
          }}
          speed={7000} // Nhanh hơn một chút (7 giây thay vì 10 giây)
          loop={true} // Lặp vô hạn
          breakpoints={{
            320: { slidesPerView: 3 }, // Từ 320px: 2 slide
            640: { slidesPerView: 4 }, // Từ 640px: 4 slide
            1024: { slidesPerView: 8 }, // Từ 1024px: 7 slide
          }}
          style={{
            "--swiper-transition-timing-function": "linear", // Chuyển động mượt mà
          }}
        >
          {brands.map((brand, index) => (
            <SwiperSlide key={`${brand.id}-${index}`}>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Image
                  src={`${baseUrl}${brand.image}`}
                  alt={brand.name}
                  maxH={{ base: "80px", md: "100px", lg: "120px" }} // Responsive chiều cao
                  maxW="100%" // Giới hạn chiều rộng
                  objectFit="contain"
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Box>
  );
};

export default Brandslider;