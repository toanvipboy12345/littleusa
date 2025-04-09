import { Link } from "react-router-dom";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { Phone, Mail, MapPin } from "react-feather"; // Thêm MapPin từ react-feather

const About = () => {
  return (
    <Box py={{ base: 4, md: 8, lg: 20 }} px={{ base: 2, md: 4, lg: 8 }} mx="auto" w={{ base: "95%", md: "90%", lg: "80%" }}>

      {/* Breadcrumb */}
      <Breadcrumb mb={6} fontSize="sm">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Trang chủ
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Giới thiệu về chúng tôi</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Tiêu đề chính */}
      <Heading
        as="h1"
        size={{ base: "lg", md: "xl" }}
        mb={6}
        color="var(--primary-color)"
        fontFamily="heading"
      >
        Giới thiệu về chúng tôi
      </Heading>

      {/* Nội dung giới thiệu */}
      <VStack spacing={6} align="start" mb={10}>
        <Text fontSize={{ base: "md", md: "lg" }} color="gray.700">
          Chào mừng bạn đến với <strong>LITTLE USA</strong>! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Text>
        <Text fontSize={{ base: "md", md: "lg" }} color="gray.700">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Hãy cùng chúng tôi khám phá thế giới thời trang đầy màu sắc và phong cách!
        </Text>
      </VStack>

      {/* Thông tin liên hệ */}
      <Heading
        as="h2"
        size={{ base: "md", md: "lg" }}
        mb={4}
        color="var(--primary-color)"
        fontFamily="heading"
      >
        Thông tin liên hệ
      </Heading>
      <VStack spacing={4} align="start" mb={5}>
        <HStack spacing={3}>
          <Phone size={20} color="var(--primary-color)" />
          <Text fontSize="md" fontWeight="medium">
            0211.3301.747
          </Text>
        </HStack>
        <HStack spacing={3}>
          <Mail size={20} color="var(--primary-color)" />
          <Text fontSize="md" fontWeight="medium">
          Littleusaapp@gmail.com
          </Text>
        </HStack>
      </VStack>

      {/* Bản đồ */}
      <HStack spacing={3} mb={4}>
        <MapPin size={20} color="var(--primary-color)" /> {/* Thêm icon MapPin */}
        <Text fontSize="md" color="gray.700">
          41A Đ. Phú Diễn, Phú Diễn, Bắc Từ Liêm, Hà Nội
        </Text>
      </HStack>
      <Flex justify="center" mb={10}>
        <Box
          as="iframe"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.863352664136!2d105.7686153147633!3d21.02614088599347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab145bf89c1d%3A0x8e6b9b1a9e6b1a1!2s41A%20%C4%90.%20Ph%C3%BA%20Di%E1%BB%85n%2C%20Ph%C3%BA%20Di%E1%BB%85n%2C%20B%E1%BA%AFc%20T%E1%BB%AB%20Li%C3%AAm%2C%20H%C3%A0%20N%E1%BB%99i%2C%20Vi%E1%BB%87t%20Nam!5e0!3m2!1svi!2s!4v1696931234567!5m2!1svi!2s"
          width={{ base: "100%" }}
          height="400px"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Flex>

      {/* Divider */}
      <Divider borderColor="gray.300" mb={6} />

      {/* Lời kết */}
      <Text fontSize="md" textAlign="center" color="gray.600">
        Cảm ơn bạn đã ghé thăm! Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào.
      </Text>
    </Box>
  );
};

export default About;