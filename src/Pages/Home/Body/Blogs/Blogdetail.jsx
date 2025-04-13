import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  VStack,
  useToast,
  Container,
  Divider,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Flex,
  BreadcrumbLink,
  useBreakpointValue,
} from "@chakra-ui/react";
import axiosInstance from "../../../../Api/axiosInstance";
import useDocumentTitle from "../../../../hook/useDocumentTitle";
import { useParams, Link } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const toast = useToast();
  const BASE_URL = "http://localhost:8080"; // Base URL của backend

  // Sử dụng useDocumentTitle để cập nhật tiêu đề trang
  useDocumentTitle(blog ? `${blog.title} - LITTLEUSA` : "Đang tải bài viết...");

  // Responsive font sizes và spacing
  const headingSize = useBreakpointValue({ base: "md", md: "lg", lg: "xl" }); // Giảm kích thước trên mobile và tablet
  const textSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });
  const breadcrumbFontSize = useBreakpointValue({ base: "xs", md: "sm", lg: "md" }); // Responsive cho Breadcrumb
  const breadcrumbSpacing = useBreakpointValue({ base: "4px", md: "8px" }); // Khoảng cách giữa các item trong Breadcrumb

  useEffect(() => {
    fetchBlogDetail();
  }, [id]);

  const fetchBlogDetail = async () => {
    try {
      const response = await axiosInstance.get(`/api/blogs/${id}`);
      console.log("Blog detail from API:", response.data);
      setBlog(response.data);
    } catch {
      toast({
        title: "Lỗi",
        description: "Không thể tải chi tiết bài viết.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  // Hàm định dạng ngày giờ
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Hàm xử lý ký tự đặc biệt, bao gồm non-breaking space
  const cleanText = (text) => {
    if (typeof text !== "string") return text;
    return text.replace(/\u00A0/g, " ");
  };

  // Hàm thêm base URL vào các URL ảnh trong nội dung
  const addBaseUrlToImage = (url) => {
    if (!url) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `${BASE_URL}${url}`;
  };

  // Hàm render nội dung từ EditorJS
  const renderContent = (content) => {
    if (!content) {
      return <Text color="gray.600">Bài viết không có nội dung.</Text>;
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
      console.log("Parsed blog content:", parsedContent);
    } catch (error) {
      console.error("Error parsing blog content:", error);
      return <Text color="gray.600">Không thể hiển thị nội dung bài viết.</Text>;
    }

    if (!parsedContent.blocks || !Array.isArray(parsedContent.blocks)) {
      console.error("Invalid content format, expected blocks array:", parsedContent);
      return <Text color="gray.600">Nội dung bài viết không hợp lệ.</Text>;
    }

    if (parsedContent.blocks.length === 0) {
      return <Text color="gray.600">Bài viết không có nội dung.</Text>;
    }

    return parsedContent.blocks.map((block, index) => {
      switch (block.type) {
        case "header":
          return (
            <Heading
              key={index}
              as={`h${block.data.level}`}
              size={block.data.level === 1 ? headingSize : block.data.level === 2 ? "lg" : "md"}
              mt={4}
              mb={2}
              color="var(--primary-color)"
            >
              {cleanText(block.data.text)}
            </Heading>
          );
        case "paragraph":
          return (
            <Text key={index} fontSize={textSize} color="gray.800" mb={4}>
              {cleanText(block.data.text)}
            </Text>
          );
        case "list":
          return block.data.style === "ordered" ? (
            <Box as="ol" pl={4} mb={4} key={index}>
              {block.data.items.map((item, i) => (
                <Text as="li" key={i} fontSize={textSize} color="gray.800">
                  {cleanText(item.content)}
                </Text>
              ))}
            </Box>
          ) : (
            <Box as="ul" pl={4} mb={4} key={index}>
              {block.data.items.map((item, i) => (
                <Text as="li" key={i} fontSize={textSize} color="gray.800">
                  {cleanText(item.content)}
                </Text>
              ))}
            </Box>
          );
        case "image":
          return (
            <Image
              key={index}
              src={addBaseUrlToImage(block.data.url)}
              alt={block.data.caption || "Blog image"}
              maxW="50%"
              my={4}
              boxShadow="sm"
              mx="auto"
              objectFit="cover"
            />
          );
        default:
          return null;
      }
    });
  };

  if (!blog) {
    return (
      <Container maxW="container.lg" py={8}>
        <Text textAlign="center" fontSize="lg" color="gray.600">
          Đang tải bài viết...
        </Text>
      </Container>
    );
  }

  return (
    <Box py={{ base: 4, md: 8, lg: 20 }} px={{ base: 2, md: 4, lg: 8 }} mx="auto" w={{ base: "95%", md: "90%", lg: "80%" }}>
      {/* Breadcrumb */}
      <Breadcrumb
        spacing={breadcrumbSpacing} // Responsive spacing
        separator="/"
        mb={{ base: 4, md: 6 }}
        fontSize={breadcrumbFontSize} // Responsive font size
        flexWrap="wrap" // Cho phép xuống dòng trên mobile
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Trang chủ
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/blogs">
            Bài viết
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink noOfLines={1}>{blog.title}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Flex direction="column" align="center" gap={{ base: 4, md: 6 }} w="100%">
        <Heading
          as="h2"
          size={headingSize} // Kích thước đã được điều chỉnh cho mobile và tablet
          color="var(--primary-color)"
          textAlign={{ base: "left", md: "left" }}
          w="100%"
        >
          {blog.title}
        </Heading>
        <Text fontSize={textSize} color="gray.500" w="100%" textAlign="left">
          {formatDate(blog.createdAt)} | {blog.authorUsername}
        </Text>
        {blog.thumbnail && (
          <Image
            src={`${BASE_URL}${blog.thumbnail}`}
            alt={blog.title}
            maxW="100%"
            maxH={{ base: "300px", md: "400px", lg: "550px" }}
            objectFit="cover"
            boxShadow="sm"
            mx="auto"
          />
        )}
        {/* Hiển thị nội dung bài viết */}
        <Box w="100%" fontSize={textSize} lineHeight="tall" mx="auto">
          {renderContent(blog.content)}
        </Box>
      </Flex>
    </Box>
  );
};

export default BlogDetail;