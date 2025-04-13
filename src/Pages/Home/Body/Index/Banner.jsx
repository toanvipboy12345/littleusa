// import React from "react";
// import { Box } from "@chakra-ui/react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Autoplay } from "swiper/modules";

// // Import Swiper styles
// import "swiper/css";
// import "swiper/css/pagination";
// import banner2 from "../../../../assets/Images/banner2.jpeg";
// import banner3 from "../../../../assets/Images/banner3.jpeg";
// import banner4 from "../../../../assets/Images/banner4.jpeg";

// const Banner = () => {
//   return (
//     <Box as="section" id="banner" w="100%" mx="auto" px={{ base: "10px", md: "0" }}>
//       <Swiper
//         modules={[Pagination, Autoplay]}
//         spaceBetween={30}
//         slidesPerView={1}
//         pagination={{
//           clickable: true,
//           bulletClass: "swiper-pagination-bullet",
//           bulletActiveClass: "swiper-pagination-bullet-active",
//         }}
//         loop={true}
//         autoplay={{ delay: 2000, disableOnInteraction: false }}
//         style={{ width: "100%" }}
//       >
//         <SwiperSlide>
//           <Box as="img" src={banner2} alt="Second slide" w="100%" h="auto" objectFit="cover" />
//         </SwiperSlide>
//         <SwiperSlide>
//           <Box as="img" src={banner3} alt="Third slide" w="100%" h="auto" objectFit="cover" />
//         </SwiperSlide>
//         <SwiperSlide>
//           <Box as="img" src={banner4} alt="Fourth slide" w="100%" h="auto" objectFit="cover" />
//         </SwiperSlide>
//       </Swiper>
//     </Box>
//   );
// };

// export default Banner;
import React, { useState, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react"; // Đảm bảo import Text từ @chakra-ui/react
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Banner = () => {
  const baseUrl = "http://localhost:8080/api/uploads";
  const [banners, setBanners] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Hàm lấy danh sách banner
  const fetchBanners = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/banners");
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  // Gọi lần đầu khi component mount
  useEffect(() => {
    fetchBanners();
  }, []);

  // Lắng nghe sự kiện storage để refresh
  useEffect(() => {
    const handleStorageChange = () => {
      setLastRefresh(Date.now()); // Trigger refresh
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Gọi lại API khi lastRefresh thay đổi
  useEffect(() => {
    fetchBanners();
  }, [lastRefresh]);

  return (
    <Box as="section" id="banner" w="100%" mx="auto" px={{ base: "0", md: "0" }}>
      {banners.length > 0 ? (
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
          }}
          loop={banners.length > 1} // Chỉ loop nếu có nhiều hơn 1 banner
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          style={{ width: "100%" }}
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={index}>
              <Box
                as="img"
                src={`${baseUrl}/${banner}`}
                alt={`Slide ${index + 1}`}
                w="100%"
                h="auto"
                objectFit="cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Text textAlign="center" color="gray.500">
          Chưa có banner nào được tải lên.
        </Text>
      )}
    </Box>
  );
};

export default Banner;