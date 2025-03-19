import React from "react";
import { Box, Flex, Text, Image, List, ListItem, Link } from "@chakra-ui/react";
import { Phone, Mail, Facebook, Instagram } from "react-feather"; // Import các icon từ react-feather
import bocongthuong from "../../../Assets/Images/bocongthuong.png";

const Footer = () => {
  return (
    <Box as="footer" bg="var(--primary-color)" py="30px">
      {/* Container */}
      <Box
        w={{ base: "100%", md: "90%", lg: "80%" }} // Đặt width 80% trên màn hình lớn
        mx="auto" // Căn giữa theo chiều ngang
        px={{ base: "20px", md: "50px", lg: 0 }} // Padding responsive
      >
        {/* Row */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between" // Phân bổ không gian giữa các cột
          align="flex-start"
          w="100%" // Đảm bảo Flex chiếm hết chiều ngang của Box cha
          gap={{ base: "30px", md: "0" }} // Tăng khoảng cách giữa các cột trên mobile
        >
          {/* Column 1: About Us */}
          <Box
            flex="1"
            textAlign={{ base: "center", md: "left" }} // Responsive textAlign
            mb={{ base: "20px", md: "0" }}
            w={{ base: "100%", md: "auto" }} // Chiều rộng 100% trên mobile
          >
            <Text
              fontSize="xl" // Tăng kích thước font để nổi bật hơn
              fontWeight="bold"
              mb="15px"
              color="var(--text-color)" // Văn bản trắng
            >
              VỀ CHÚNG TÔI
            </Text>
            <Text
              fontSize="sm"
              mb="15px"
              color="var(--text-color)" // Văn bản trắng
              lineHeight="1.5" // Tăng khoảng cách dòng để dễ đọc hơn
            >
              - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text>
            <Image
              src={bocongthuong}
              alt="Logo"
              w="140px"
              h="auto"
              mx={{ base: "auto", md: "0" }} // Căn giữa trên mobile, sát trái trên desktop
              opacity="0.8" // Thêm độ trong suốt nhẹ để logo không quá nổi
            />
          </Box>

          {/* Column 2: Customer Support */}
          <Box
            flex="1"
            textAlign={{ base: "center", md: "center" }} // Responsive textAlign
            mb={{ base: "20px", md: "0" }}
            w={{ base: "100%", md: "auto" }} // Chiều rộng 100% trên mobile
          >
            <Text
              fontSize="xl" // Tăng kích thước font để nổi bật hơn
              fontWeight="bold"
              mb="15px"
              color="var(--text-color)" // Văn bản trắng
            >
              HỖ TRỢ KHÁCH HÀNG
            </Text>
            <List spacing="10px" pl="0">
              <ListItem>
                <Link
                  color="var(--text-color)" // Văn bản trắng cho liên kết
                  _hover={{
                    color: "var(--text-color)", // Giữ màu trắng khi hover
                    textDecoration: "underline", // Thêm gạch chân khi hover
                  }}
                  cursor="pointer"
                  fontSize="sm"
                >
                  Hướng dẫn mua hàng
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  color="var(--text-color)" // Văn bản trắng cho liên kết
                  _hover={{
                    color: "var(--text-color)", // Giữ màu trắng khi hover
                    textDecoration: "underline", // Thêm gạch chân khi hover
                  }}
                  cursor="pointer"
                  fontSize="sm"
                >
                  Chính sách đổi sản phẩm
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  color="var(--text-color)" // Văn bản trắng cho liên kết
                  _hover={{
                    color: "var(--text-color)", // Giữ màu trắng khi hover
                    textDecoration: "underline", // Thêm gạch chân khi hover
                  }}
                  cursor="pointer"
                  fontSize="sm"
                >
                  Chính sách vận chuyển
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  color="var(--text-color)" // Văn bản trắng cho liên kết
                  _hover={{
                    color: "var(--text-color)", // Giữ màu trắng khi hover
                    textDecoration: "underline", // Thêm gạch chân khi hover
                  }}
                  cursor="pointer"
                  fontSize="sm"
                >
                  Chính sách bảo mật
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  color="var(--text-color)" // Văn bản trắng cho liên kết
                  _hover={{
                    color: "var(--text-color)", // Giữ màu trắng khi hover
                    textDecoration: "underline", // Thêm gạch chân khi hover
                  }}
                  cursor="pointer"
                  fontSize="sm"
                >
                  Chính sách ký gửi
                </Link>
              </ListItem>
            </List>
          </Box>

          {/* Column 3: Contact Info */}
          <Box
            flex="1"
            textAlign={{ base: "center", md: "right" }} // Responsive textAlign
            w={{ base: "100%", md: "auto" }} // Chiều rộng 100% trên mobile
          >
            <Text
              fontSize="xl" // Tăng kích thước font để nổi bật hơn
              fontWeight="bold"
              mb="15px"
              color="var(--text-color)" // Văn bản trắng
            >
              CHĂM SÓC KHÁCH HÀNG
            </Text>
            <Box mb="10px">
              <Flex
                align="center"
                justify={{ base: "center", md: "flex-end" }} // Responsive justify
                mb="5px"
              >
                <Phone
                  size={20} // Kích thước icon
                  color="var(--text-color)" // Màu trắng
                  opacity="0.8" // Thêm độ trong suốt nhẹ cho icon
                  mr="15px" // Tăng margin-right để tạo khoảng cách với văn bản
                />
                <Text
                  fontSize="sm"
                  color="var(--text-color)" // Văn bản trắng
                  ml="2" // Thêm margin-left nhẹ cho văn bản để cân đối
                >
                  0935.483.679
                </Text>
              </Flex>
              <Flex
                align="center"
                justify={{ base: "center", md: "flex-end" }} // Responsive justify
              >
                <Mail
                  size={20} // Kích thước icon
                  color="var(--text-color)" // Màu trắng
                  opacity="0.8" // Thêm độ trong suốt nhẹ cho icon
                  mr="15px" // Tăng margin-right để tạo khoảng cách với văn bản
                />
                <Text
                  fontSize="sm"
                  color="var(--text-color)" // Văn bản trắng
                  ml="2" // Thêm margin-left nhẹ cho văn bản để cân đối
                >
                  theairsg@gmail.com
                </Text>
              </Flex>
            </Box>
            <Flex
              justify={{ base: "center", md: "flex-end" }} // Responsive justify
              mt="10px"
              gap="10px" // Thêm khoảng cách giữa các icon
            >
              <Facebook
                size={25} // Kích thước icon
                color="var(--text-color)" // Màu trắng
                opacity="0.8" // Thêm độ trong suốt nhẹ cho icon
                cursor="pointer"
                _hover={{
                  opacity: 1, // Tăng độ trong suốt khi hover
                  transform: "scale(1.1)", // Phóng to nhẹ khi hover
                  transition: "all 0.3s ease", // Thêm transition cho hiệu ứng
                }}
              />
              <Instagram
                size={25} // Kích thước icon
                color="var(--text-color)" // Màu trắng
                opacity="0.8" // Thêm độ trong suốt nhẹ cho icon
                cursor="pointer"
                _hover={{
                  opacity: 1, // Tăng độ trong suốt khi hover
                  transform: "scale(1.1)", // Phóng to nhẹ khi hover
                  transition: "all 0.3s ease", // Thêm transition cho hiệu ứng
                }}
              />
            </Flex>
          </Box>
        </Flex>

        {/* Copyright */}
        <Box textAlign="center" mt="20px" fontSize="xs">
          <Text
            color="var(--text-color)" // Văn bản trắng
            opacity="0.7" // Thêm độ trong suốt nhẹ cho copyright
          >
            Copyright © 2025 Powered by THEAIRSAIGON™
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;