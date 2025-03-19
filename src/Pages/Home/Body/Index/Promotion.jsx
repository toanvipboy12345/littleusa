import React from "react";
import { Box, Flex, Text, Image, Button } from "@chakra-ui/react";
import bannergt01 from "../../../../Assets/Images/bannergt01.avif"; // Hình ảnh cặp đôi đi dạo
import bannergt02 from "../../../../Assets/Images/bannergt02.avif"; // Hình ảnh cặp đôi đứng

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
            ml={{ base: "0"}} 
          >
            <Text fontSize={{ base: "2rem", md: "2.5rem" }} fontWeight="bold" mb="20px"  ml={{ base: "0", md: "40px" }} >
              ADORABLE DREAMS
            </Text>
            <Text fontSize={{ base: "0.9rem", md: "1rem" }} lineHeight="1.6" mb="20px"  ml={{ base: "0", md: "40px" }} >
              This collection brings together Levents' dreamy spirit with Hello Kitty's
              timeless adorableness. Designed for dreamers who find beauty in the little
              things, it serves as a gentle reminder that love, friendship, and imagination
              are the true colors of life.
            </Text>
            <Button
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
          <Box flex="1" textAlign={{ base: "center", md: "left" }} mb={{ base: "20px", md: "0" }}>
            <Text
              fontSize={{ base: "1.5rem", md: "1.8rem" }}
              fontWeight="bold"
              mb="10px"
            >
              ƯU ĐÃI MUA SẮM ĐẶC BIỆT
            </Text>
            <Text fontSize={{ base: "1rem", md: "1.2rem" }} mb="15px">
              Giảm đến 50% | Voucher 30.000đ | Tặng thêm TÚI TOTE CANVAS
            </Text>
            <Button
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