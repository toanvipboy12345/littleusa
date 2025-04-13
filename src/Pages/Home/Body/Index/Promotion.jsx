import React from "react";
import { Box, Flex, Text, Image, Button } from "@chakra-ui/react";
import bannergt01 from "../../../../Assets/Images/bannergt01.avif"; // Hình ảnh cặp đôi đi dạo
import bannergt02 from "../../../../Assets/Images/bannergt02.avif"; // Hình ảnh cặp đôi đứng
import { Link } from "react-router-dom"; // Thêm import Link

const Promotion = () => {
  return (
    <Box as="section" bg="transparent" py="30px">
      {/* Container */}
      <Box
        maxW={{ base: "90%", md: "80%" }}
        mx="auto" // Căn giữa theo chiều ngang
      >
        {/* Section 1 */}
        <Flex
          direction={{ base: "column", md: "row" }} // Responsive layout
          align="center"
          justify="space-between"
          mb={{ base: "20px", md: "40px" }}
        >
          {/* Left Side: Banner Image 1 */}
          <Box flex="1" textAlign="center" mb={{ base: "20px", md: "0" }}>
            <Image src={bannergt01} alt="Banner Image 1" w="100%" h="auto" />
          </Box>

          {/* Right Side: Text Content */}
          <Box
            flex="1"
            textAlign={{ base: "center", md: "left" }}
            ml={{ base: "0" }}
          >
            <Text
              fontSize={{ base: "2rem", md: "2.5rem" }}
              fontWeight="bold"
              mb="20px"
              ml={{ base: "0", md: "40px" }}
            >
              AUTHENTIC BRANDS
            </Text>
            <Text
              fontSize={{ base: "0.9rem", md: "1rem" }}
              lineHeight="1.6"
              mb="20px"
              ml={{ base: "0", md: "40px" }}
            >
              LITTLE USA luôn đặt sự hài lòng của khách hàng lên hàng đầu, shop chỉ phân phối các sản phẩm Global Brand chính hãng. Để đáp ứng tốt nhu cầu của khách hàng, shop luôn cập nhật mẫu mã đa dạng, số lượng lớn, đa số các sản phẩm đều có sẵn, không mất thời gian đợi order của khách hàng.
            </Text>
            <Button
              as={Link} // Sử dụng Link thay vì Button
              to="/product" // Chuyển hướng với query parameter hasDiscount=true
              variant="outline"
              ml={{ base: "0", md: "40px" }}
            >
              Khám Phá Ngay
            </Button>
          </Box>
        </Flex>

        {/* Section 2 */}
        <Flex
          direction={{ base: "column-reverse", md: "row" }} // Reverse order on mobile
          align="center"
          justify="space-between"
        >
          {/* Left Side: Text Content */}
          <Box
            flex="1"
            textAlign={{ base: "center", md: "left" }}
            mb={{ base: "20px", md: "0" }}
          >
            <Text
              fontSize={{ base: "2rem", md: "2.5rem" }}
              fontWeight="bold"
              mb="10px"
            >
              ƯU ĐÃI MUA SẮM ĐẶC BIỆT
            </Text>
            <Text fontSize={{ base: "1rem", md: "1.2rem" }} mb="15px">
              Giảm đến 20% | Voucher 30.000đ | Miễn phí vận chuyển cho đơn hàng từ 1.000.000đ
            </Text>
            <Button
              as={Link} // Sử dụng Link thay vì Button
              to="/product?hasDiscount=true" // Chuyển hướng với query parameter hasDiscount=true
              variant="outline"
            >
              Khám Phá Ngay
            </Button>
          </Box>
          {/* Right Side: Banner Image 2 */}
          <Box flex="1" textAlign="center">
            <Image src={bannergt02} alt="Banner Image 2" w="100%" h="auto" />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Promotion;