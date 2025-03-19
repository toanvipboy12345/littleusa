import React from "react";
import { Box } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import banner2 from "../../../../assets/Images/banner2.jpeg";
import banner3 from "../../../../assets/Images/banner3.jpeg";
import banner4 from "../../../../assets/Images/banner4.jpeg";

const Banner = () => {
  return (
    <Box as="section" id="banner" w="100%" mx="auto" px={{ base: "10px", md: "0" }}>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active",
        }}
        loop={true}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        style={{ width: "100%" }}
      >
        <SwiperSlide>
          <Box as="img" src={banner2} alt="Second slide" w="100%" h="auto" objectFit="cover" />
        </SwiperSlide>
        <SwiperSlide>
          <Box as="img" src={banner3} alt="Third slide" w="100%" h="auto" objectFit="cover" />
        </SwiperSlide>
        <SwiperSlide>
          <Box as="img" src={banner4} alt="Fourth slide" w="100%" h="auto" objectFit="cover" />
        </SwiperSlide>
      </Swiper>
    </Box>
  );
};

export default Banner;