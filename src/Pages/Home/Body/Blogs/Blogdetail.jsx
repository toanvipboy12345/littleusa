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
} from "@chakra-ui/react";
import axiosInstance from "../../../../Api/axiosInstance";
import { useParams, Link } from "react-router-dom";

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const toast = useToast();
    const BASE_URL = "http://localhost:8080";

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

    // Hàm xử lý ký tự &nbsp;
    const cleanText = (text) => {
        if (typeof text !== "string") return text;
        return text.replace(/&nbsp;/g, " ");
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
                            size={block.data.level === 1 ? "xl" : block.data.level === 2 ? "lg" : "md"}
                            mt={4}
                            mb={2}
                            color="var(--primary-color)"
                        >
                            {cleanText(block.data.text)}
                        </Heading>
                    );
                case "paragraph":
                    return (
                        <Text key={index} fontSize="md" color="gray.800" mb={4}>
                            {cleanText(block.data.text)}
                        </Text>
                    );
                case "list":
                    return block.data.style === "ordered" ? (
                        <Box as="ol" pl={4} mb={4} key={index}>
                            {block.data.items.map((item, i) => (
                                <Text as="li" key={i} fontSize="md" color="gray.800">
                                    {cleanText(item.content)}
                                </Text>
                            ))}
                        </Box>
                    ) : (
                        <Box as="ul" pl={4} mb={4} key={index}>
                            {block.data.items.map((item, i) => (
                                <Text as="li" key={i} fontSize="md" color="gray.800">
                                    {cleanText(item.content)}
                                </Text>
                            ))}
                        </Box>
                    );
                case "image":
                    return (
                        <Image
                            key={index}
                            src={block.data.url}
                            alt={block.data.caption || "Blog image"}
                            maxW="100%"
                            my={4}
                            borderRadius="md"
                            boxShadow="sm"
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
        <VStack spacing={6} align="start">
            <Heading as="h1" w={{ base: "100%", md: "80%" }} mx="auto" size="xl" color="var(--primary-color)">
                {blog.title}
            </Heading>
            <Text fontSize="sm" color="gray.500" w={{ base: "100%", md: "80%" }} mx="auto">
                {formatDate(blog.createdAt)} |  {blog.authorUsername}
            </Text>
            {blog.thumbnail && (
                <Image
                    src={`${BASE_URL}${blog.thumbnail}`}
                    alt={blog.title}
                    maxW={{ base: "100%", md: "80%" }}
                    objectFit="cover"
                    mx="auto"
                />
            )}
            {/* Hiển thị nội dung bài viết */}
            <Box w={{ base: "100%", md: "80%" }} fontSize="md" lineHeight="tall" mx="auto">
                {renderContent(blog.content)}
            </Box>
            
        </VStack>

        </Box>
    );
};

export default BlogDetail;