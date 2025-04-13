import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Image,
  Heading,
  useToast,
  SimpleGrid,
  Flex,
  Link as ChakraLink,
} from "@chakra-ui/react";
import axiosInstance from "../../../../Api/axiosInstance";
import { Link } from "react-router-dom";

const BlogListView = () => {
  const [blogs, setBlogs] = useState([]);
  const toast = useToast();
  const BASE_URL = "http://localhost:8080";

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axiosInstance.get("/api/blogs");
      const publishedBlogs = response.data
        .filter((blog) => blog.isPublished)
        .filter((blog) => !blog.title.toUpperCase().includes("CHÍNH SÁCH"));
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
    <Box
      py={{ base: 4, md: 8, lg: 12 }}
      px={{ base: 2, md: 4, lg: 0 }}
      mx="auto"
      w={{ base: "95%", md: "90%", lg: "80%" }}
    >
      {/* Tiêu đề "BÀI VIẾT" */}
      <Heading
        as="h1"
        fontSize={{ base: "2rem", md: "2.5rem" }}
        mb={{ base: 4, md: 6 }}
        textTransform="uppercase"
        fontWeight="bold"
      >
        BÀI Viết
      </Heading>

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
        <>
          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 3 }} // 1 cột trên mobile, 2 cột trên tablet, 3 cột trên desktop
            spacing={{ base: 3, md: 4 }} // Khoảng cách giữa các bài viết
          >
            {blogs.map((blog) => (
              <Box
                as={Link}
                to={`/blog/${blog.id}`}
                key={blog.id}
                boxShadow="sm"
                transition="all 0.3s ease"
                _hover={{
                  boxShadow: "md",
                  transform: "translateY(-4px)",
                  textDecoration: "none",
                }}
                display="flex"
                flexDirection="row" // Luôn giữ layout listview trên mọi thiết bị
                overflow="hidden"
                alignItems="center" // Căn giữa theo chiều dọc
              >
                {blog.thumbnail ? (
                  <Image
                    src={`${BASE_URL}${blog.thumbnail}`}
                    alt={blog.title}
                    w={{ base: "40%", md: "40%" }} // Giữ width 40% trên mọi thiết bị
                    h="auto" // Chiều cao tự động
                    objectFit="contain" // Giữ tỷ lệ gốc
                    objectPosition="center" // Căn giữa hình ảnh
                  />
                ) : (
                  <Box
                    w={{ base: "40%", md: "40%" }} // Giữ width 40% trên mọi thiết bị
                    h="auto"
                    bg="gray.100"
                  />
                )}
                <VStack
                  p={{ base: 2, md: 3 }} // Giảm padding
                  align="start"
                  spacing={{ base: 1, md: 2 }} // Giảm khoảng cách giữa các phần tử
                  flex="1"
                >
                  <Heading
                    as="h3"
                    size={{ base: "xs", md: "sm" }} // Giảm kích thước tiêu đề
                    color="var(--primary-color)"
                    noOfLines={2}
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    {blog.title}
                  </Heading>
                  <Text
                    fontSize={{ base: "2xs", md: "xs" }} // Giảm kích thước ngày
                    color="gray.500"
                  >
                    {formatDate(blog.createdAt)}
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>

          {/* Liên kết "Xem thêm" */}
          <Flex justify="center" mt={6}>
            <ChakraLink
              as={Link}
              to="/blogs" // Điều chỉnh đường dẫn nếu cần
              color="var(--primary-color)"
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="medium"
              _hover={{ textDecoration: "underline" }}
            >
              Xem các tin bài khác {">>"}
            </ChakraLink>
          </Flex>
        </>
      )}
    </Box>
  );
};

export default BlogListView;