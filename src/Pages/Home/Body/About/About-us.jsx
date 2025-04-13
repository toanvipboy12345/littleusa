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
import { Phone, Mail, MapPin } from "react-feather";
import { useEffect, useState } from "react";
import axios from "../../../../Api/axiosInstance";

const About = () => {
  // State to hold the about data
  const [aboutData, setAboutData] = useState({
    introduction: [],
    contact: { phone: "", email: "", address: "", mapEmbedUrl: "" },
  });
  // State to handle loading
  const [isLoading, setIsLoading] = useState(true);
  // State to handle errors
  const [error, setError] = useState(null);

  // Fetch about data from the API
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/about");
        setAboutData({
          introduction: response.data.introduction || [],
          contact: response.data.contact || {
            phone: "",
            email: "",
            address: "",
            mapEmbedUrl: "",
          },
        });
      } catch (err) {
        setError("Không thể tải thông tin. Vui lòng thử lại sau.");
        console.error("Error fetching about data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <Box
        py={{ base: 4, md: 8, lg: 20 }}
        px={{ base: 2, md: 4, lg: 8 }}
        mx="auto"
        w={{ base: "95%", md: "90%", lg: "80%" }}
      >
        <Text>Đang tải...</Text>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box
        py={{ base: 4, md: 8, lg: 20 }}
        px={{ base: 2, md: 4, lg: 8 }}
        mx="auto"
        w={{ base: "95%", md: "90%", lg: "80%" }}
      >
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box
      py={{ base: 4, md: 8, lg: 20 }}
      px={{ base: 2, md: 4, lg: 8 }}
      mx="auto"
      w={{ base: "95%", md: "90%", lg: "80%" }}
    >
      {/* Breadcrumb */}
      <Breadcrumb mb={6} fontSize="sm">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Trang chủ
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Về chúng tôi</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Main Heading */}
      <Heading
        as="h1"
        size={{ base: "lg", md: "xl" }}
        mb={6}
        color="var(--primary-color)"
        fontFamily="heading"
      >
        Giới thiệu về chúng tôi
      </Heading>

      {/* Introduction Content */}
      <VStack spacing={6} align="start" mb={6}>
        {aboutData.introduction.length > 0 ? (
          aboutData.introduction.map((text, index) => (
            <Text
              key={index}
              fontSize={{ base: "md", md: "lg" }}
              color="gray.700"
            >
              {text}
            </Text>
          ))
        ) : (
          <Text fontSize={{ base: "md", md: "lg" }} color="gray.700">
            Chưa có thông tin giới thiệu.
          </Text>
        )}
      </VStack>

      {/* Contact Information */}
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
        {aboutData.contact.phone && (
          <HStack spacing={3}>
            <Phone size={20} color="var(--primary-color)" />
            <Text fontSize="md" fontWeight="medium">
              {aboutData.contact.phone}
            </Text>
          </HStack>
        )}
        {aboutData.contact.email && (
          <HStack spacing={3}>
            <Mail size={20} color="var(--primary-color)" />
            <Text fontSize="md" fontWeight="medium">
              {aboutData.contact.email}
            </Text>
          </HStack>
        )}
      </VStack>

      {/* Map and Address */}
      {aboutData.contact.address && (
        <HStack spacing={3} mb={4}>
          <MapPin size={20} color="var(--primary-color)" />
          <Text fontSize="md" color="gray.700">
            {aboutData.contact.address}
          </Text>
        </HStack>
      )}
      {aboutData.contact.mapEmbedUrl && (
        <Flex justify="center" mb={10}>
          <Box
            as="iframe"
            src={aboutData.contact.mapEmbedUrl}
            width={{ base: "100%" }}
            height="400px"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Flex>
      )}

      {/* Divider */}
      <Divider borderColor="gray.300" mb={6} />

      {/* Closing Text */}
      <Text fontSize="md" textAlign="center" color="gray.600">
        Cảm ơn bạn đã ghé thăm! Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu
        hỏi nào.
      </Text>
    </Box>
  );
};

export default About;