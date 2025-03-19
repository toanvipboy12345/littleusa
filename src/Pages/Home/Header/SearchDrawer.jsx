import React, { useState, useEffect } from "react";
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Input,
    VStack,
    Text,
    Box,
    Image,
    Grid,
    GridItem,
    Spinner,
} from "@chakra-ui/react"; // Sử dụng Chakra UI v2.x
import { Link } from "react-router-dom";
import axios from "../../../Api/axiosInstance";
import { AlertCircle } from "react-feather";

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const SearchDrawer = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const baseURL = axios.defaults.baseURL || "http://localhost:8080";

    const fetchSearchResults = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(`/api/product-dto/search?keyword=${encodeURIComponent(query)}`);
            setTimeout(() => {
                const shuffledResults = shuffleArray(response.data || []);
                setSearchResults(shuffledResults);
                setIsLoading(false);
            }, 500);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults([]);
            setIsLoading(false);
        }
    };
    // Hàm tạo slug từ tên sản phẩm và màu sắc
    const createProductSlug = (name, color) => {
        const normalizedName = name
            ?.trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-") || "unknown-product";
        const normalizedColor = color
            ?.trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-") || "unknown-color";
        return `${normalizedName}-${normalizedColor}`;
    };
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchSearchResults(searchQuery);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleClose = () => {
        setSearchQuery("");
        setSearchResults([]);
        onClose();
    };

    return (
        <Drawer isOpen={isOpen} placement="bottom" onClose={handleClose} size="full">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader
                    bg="var(--primary-color)"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Text color="white">Tìm kiếm sản phẩm</Text>
                    <DrawerCloseButton size="md" mr={4} color="white" />
                </DrawerHeader>
                <DrawerBody p={6} height="100%" minHeight="0">
                    <Input
                        placeholder="Nhập từ khóa tìm kiếm (ví dụ: NEW ERA)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        mb={4}
                        size="lg"
                        focusBorderColor="var(--primary-color)"
                    />
                    {isLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
                            <Spinner thickness="3px" speed="0.65s" emptyColor="gray.200" size="xl" />
                        </Box>
                    ) : searchResults.length > 0 ? (
                        <VStack spacing={4} align="stretch">
                            <Grid
                                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                                gap={4}
                                justifyContent="center" // Căn giữa các item trong lưới
                            >
                                {searchResults.map((product) => (
                                    <GridItem key={product.variantId} justifySelf="center">
                                        <Link
                                            to={`/products/${product.productId}/${createProductSlug(product.name, product.color)}`}
                                            style={{ textDecoration: "none" }}
                                            onClick={onClose} // Thêm onClick để gọi onClose khi nhấp vào link
                                        >
                                            <Box
                                                p={4}
                                                overflow="hidden"
                                                boxShadow="sm"
                                                width="100%"
                                                maxWidth="400px"
                                                _hover={{ transform: "scale(1.05)", bg: "gray.100", transition: "transform 0.2s ease" }}
                                            >
                                                <Box display="flex" alignItems="center" gap={4}>
                                                    <Image
                                                        src={`${baseURL}${product.mainImage}`}
                                                        alt={product.name || "Product"}
                                                        boxSize={{ base: "80px", md: "100px", lg: "120px" }}
                                                        objectFit="cover"
                                                        fallbackSrc={`${baseURL}/path/to/fallback-image.jpg`}
                                                    />
                                                    <Box flex="1">
                                                        <Text
                                                            fontSize="md"
                                                            fontWeight="bold"
                                                            whiteSpace="normal"
                                                            wordBreak="break-word"
                                                            width="100%"
                                                            sx={{
                                                                overflow: "visible",
                                                                textOverflow: "unset",
                                                                WebkitLineClamp: "unset",
                                                            }}
                                                        >
                                                            {product.name}
                                                        </Text>
                                                        {product.discountRate && product.discountRate > 0 ? (
                                                            <Box
                                                                display="flex"
                                                                flexDirection={{ base: "column", lg: "row" }}
                                                                alignItems="flex-start"
                                                                width="100%"
                                                                gap={{ base: 2, lg: 2 }}
                                                            >
                                                                <Text
                                                                    fontSize="sm"
                                                                    color="gray.500"
                                                                    textDecoration="line-through"
                                                                    whiteSpace="normal"
                                                                    wordBreak="break-word"
                                                                    width="auto"
                                                                >
                                                                    {product.price} VNĐ
                                                                </Text>
                                                                <Text
                                                                    fontSize="sm"
                                                                    color="red.500"
                                                                    fontWeight="bold"
                                                                    whiteSpace="normal"
                                                                    wordBreak="break-word"
                                                                    width="auto"
                                                                >
                                                                    {product.discountPrice} VNĐ
                                                                </Text>
                                                            </Box>
                                                        ) : (
                                                            <Text
                                                                fontSize="sm"
                                                                whiteSpace="normal"
                                                                wordBreak="break-word"
                                                                width="100%"
                                                                textAlign="left"
                                                            >
                                                                Giá: {product.discountPrice || product.price} VNĐ
                                                            </Text>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Link>
                                    </GridItem>
                                ))}
                            </Grid>
                        </VStack>
                    ) : searchQuery ? (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="100%"
                            width="100%"
                            flexDirection="column"
                            gap={4}
                        >
                            <AlertCircle size={48} />
                            <Text>Không tìm thấy sản phẩm nào phù hợp.</Text>
                        </Box>
                    ) : null}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default SearchDrawer;