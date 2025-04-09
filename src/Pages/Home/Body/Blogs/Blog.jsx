import React, { useState, useEffect } from "react";
import {
  Box,
  SimpleGrid,
  VStack,
  Text,
  Image,
  Heading,
  useToast,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import axiosInstance from "../../../../Api/axiosInstance";
import { Link } from "react-router-dom";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const toast = useToast();
  const BASE_URL = "http://localhost:8080";

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axiosInstance.get("/api/blogs");
      console.log("Blogs from API:", response.data);
      const publishedBlogs = response.data.filter((blog) => blog.isPublished);
      setBlogs(publishedBlogs);
    } catch {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách bài viết.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <Box py={{ base: 4, md: 8, lg: 20 }} px={{ base: 2, md: 4, lg: 8 }} mx="auto" w={{ base: "95%", md: "90%", lg: "80%" }}>

      <Breadcrumb 
        spacing="8px" 
        separator="/" 
        mb={{ base: 4, md: 6 }}
        fontSize={{ base: "sm", md: "md" }}
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Trang chủ
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Bài viết</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {blogs.length === 0 ? (
        <Text 
          textAlign="center" 
          fontSize={{ base: "md", md: "lg" }} 
          color="gray.600"
          py={8}
        >
          Hiện tại chưa có bài viết nào.
        </Text>
      ) : (
        <SimpleGrid 
          columns={{ base: 1, sm: 2, lg: 3 }} 
          spacing={{ base: 4, md: 6, lg: 8 }}
        >
          {blogs.map((blog) => (
            <Box
              as={Link}
              to={`/blog/${blog.id}`}
              key={blog.id}
              borderWidth="1px"
              borderColor="gray.200"
              overflow="hidden"
              bg="white"
              boxShadow="sm"
              borderRadius="md"
              transition="all 0.3s ease"
              _hover={{
                boxShadow: "md",
                transform: "translateY(-4px)",
                textDecoration: "none",
              }}
            >
              {blog.thumbnail ? (
                <Image
                  src={`${BASE_URL}${blog.thumbnail}`}
                  alt={blog.title}
                  h={{ base: "150px", md: "200px" }}
                  w="100%"
                  objectFit="cover"
                  borderTopRadius="md"
                />
              ) : (
                <Box 
                  h={{ base: "150px", md: "200px" }} 
                  w="100%" 
                  bg="gray.100" 
                  borderTopRadius="md"
                />
              )}
              <VStack 
                p={{ base: 3, md: 4 }} 
                align="start" 
                spacing={{ base: 2, md: 3 }}
              >
                <Text 
                  fontSize={{ base: "xs", md: "sm" }} 
                  color="gray.500"
                >
                  {formatDate(blog.createdAt)}
                </Text>
                <Heading 
                  as="h3" 
                  size={{ base: "sm", md: "md" }} 
                  color="var(--primary-color)"
                  noOfLines={2}
                >
                  {blog.title}
                </Heading>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Blogs;