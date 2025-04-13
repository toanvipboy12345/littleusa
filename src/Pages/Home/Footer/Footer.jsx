/* eslint-disable no-unused-vars */
import React, { useState, useContext, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Image,
  List,
  ListItem,
  Link,
  IconButton,
  Button,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import {
  Phone,
  Mail,
  Facebook,
  Instagram,
  Heart,
  ArrowUp,
  X,
  MessageSquare,
  Minimize2,
  Maximize2,
} from "react-feather";
import { motion, AnimatePresence } from "framer-motion";
import bocongthuong from "../../../Assets/Images/bocongthuong.png";
import { UserContext } from "../../../context/UserContext";
import axiosInstance from "../../../Api/axiosInstance";
import { Link as RouterLink } from "react-router-dom";
import ChatBot from "./ChatBox";

const MotionBox = motion(Box);

const Footer = () => {
  const [isWishlistVisible, setIsWishlistVisible] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [policyBlogs, setPolicyBlogs] = useState([]);
  const { user } = useContext(UserContext);
  const sidebarRef = useRef(null);
  const toast = useToast();

  const motionBoxWidth = useBreakpointValue({
    base: "350px",
    md: "450px",
    lg: "600px",
  });

  const imageSize = useBreakpointValue({
    base: "80px",
    md: "100px",
    lg: "100px",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axiosInstance.get("/api/blogs");
      const filteredBlogs = response.data.filter(
        (blog) =>
          blog.isPublished && blog.title.toUpperCase().includes("CHÍNH SÁCH")
      );
      setPolicyBlogs(filteredBlogs);
    } catch (error) {
      setPolicyBlogs([]);
    }
  };

  const fetchWishlist = async () => {
    try {
      const wishlistToken = localStorage.getItem("wishlistToken");
      const params = user ? { userId: user.id } : { wishlistToken };

      const response = await axiosInstance.get("/api/wishlist", { params });
      setWishlist(response.data);
      setIsWishlistVisible(true);
    } catch (error) {
      setWishlist([]);
      setIsWishlistVisible(true);
    }
  };

  const handleWishlistToggle = () => {
    if (isWishlistVisible) {
      setIsWishlistVisible(false);
    } else {
      fetchWishlist();
    }
  };

  const handleWishlistClose = () => {
    setIsWishlistVisible(false);
  };

  const handleChatToggle = () => {
    setIsChatVisible(!isChatVisible);
  };

  const handleChatClose = () => {
    setIsChatVisible(false);
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDeleteWishlistItem = async (id) => {
    try {
      await axiosInstance.delete(`/api/wishlist/delete?id=${id}`);
      setWishlist(wishlist.filter((item) => item.id !== id));
      toast({
        title: "Thành công",
        description: "Đã xóa sản phẩm khỏi danh sách yêu thích.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa sản phẩm khỏi danh sách yêu thích.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
    if (!isSidebarMinimized) {
      setIsWishlistVisible(false);
      setIsChatVisible(false);
    }
  };

  return (
    <Box position="relative">
      <Box
        position="fixed"
        right="0"
        top={isSidebarMinimized ? "auto" : "50%"}
        bottom={isSidebarMinimized ? "20px" : "auto"}
        transform={isSidebarMinimized ? "none" : "translateY(-50%)"}
        display="flex"
        flexDirection="row"
        zIndex="1000"
        transition="all 0.3s ease"
      >
        <AnimatePresence>
          {(isWishlistVisible || isChatVisible) && !isSidebarMinimized && (
            <>
              {isWishlistVisible && (
                <MotionBox
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: motionBoxWidth, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  bg="white"
                  borderTopLeftRadius="8px"
                  borderBottomLeftRadius="8px"
                  borderRight="1px solid"
                  borderColor="gray.300"
                  display="flex"
                  flexDirection="column"
                  p={3}
                  overflowY="auto"
                  boxShadow="0 8px 20px rgba(0, 0, 0, 0.2)"
                >
                  <Flex justify="space-between" align="center" w="100%" mb={4}>
                    <Text fontSize="lg" fontWeight="bold">
                      Sản phẩm yêu thích
                    </Text>
                    <IconButton
                      icon={<X />}
                      size="sm"
                      variant="ghost"
                      onClick={handleWishlistClose}
                      aria-label="Đóng danh sách yêu thích"
                    />
                  </Flex>

                  {wishlist.length === 0 ? (
                    <Text textAlign="center" fontSize="sm" color="gray.500">
                      Bạn không có hàng hóa nào trong danh sách yêu thích
                    </Text>
                  ) : (
                    <Box w="100%">
                      {wishlist.map((item) => (
                        <Flex key={item.id} align="flex-start" mb={4} w="100%">
                          <Image
                            src={`http://localhost:8080${item.mainImage}`}
                            alt={item.productName}
                            boxSize={imageSize}
                            objectFit="cover"
                            mr={3}
                          />
                          <Box flex="1">
                            <Text
                              fontSize={{ base: "xs", md: "md" }}
                              fontWeight="bold"
                              isTruncated
                            >
                              {item.productName} - {item.color}
                            </Text>
                            <Flex align="center" w="100%" justify="flex-start">
                              {item.discountPrice ? (
                                <>
                                  <Text
                                    fontSize={{ base: "xs", md: "md" }}
                                    fontWeight="bold"
                                    mr={2}
                                  >
                                    {item.discountPrice.toLocaleString("vi-VN")}{" "}
                                    VND
                                  </Text>
                                  <Text
                                    fontSize={{ base: "xs", md: "md" }}
                                    color="gray.500"
                                    textDecoration="line-through"
                                  >
                                    {item.price.toLocaleString("vi-VN")} VND
                                  </Text>
                                </>
                              ) : (
                                <Text
                                  fontSize={{ base: "xs", md: "md" }}
                                  fontWeight="bold"
                                >
                                  {item.price.toLocaleString("vi-VN")} VND
                                </Text>
                              )}
                            </Flex>
                            <Button
                              size="sm"
                              colorScheme="red"
                              mt={2}
                              onClick={() => handleDeleteWishlistItem(item.id)}
                            >
                              Xóa
                            </Button>
                          </Box>
                        </Flex>
                      ))}
                    </Box>
                  )}
                </MotionBox>
              )}
              {isChatVisible && (
                <ChatBot isOpen={isChatVisible} onClose={handleChatClose} />
              )}
            </>
          )}
        </AnimatePresence>

        <Box
          ref={sidebarRef}
          bg="white"
          borderRadius="8px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          width={
            isSidebarMinimized
              ? { base: "50px", sm: "60px", md: "70px" }
              : { base: "40px", sm: "50px", md: "62px" }
          }
          height={
            isSidebarMinimized
              ? { base: "50px", sm: "60px", md: "70px" }
              : "auto"
          }
          boxShadow="0 8px 20px rgba(0, 0, 0, 0.2)"
          transition="all 0.3s ease"
        >
          {isSidebarMinimized ? (
            <Box
              p={{ base: "8px", sm: "10px", md: "15px" }}
              _hover={{
                bg: "gray.100",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onClick={toggleSidebar}
            >
              <Maximize2
                size={{ base: 20, sm: 24, md: 28 }}
                color="gray"
                _hover={{ color: "gray.600" }}
              />
            </Box>
          ) : (
            <>
              <Box
                p={{ base: "8px", sm: "10px", md: "15px" }}
                borderBottom="1px solid"
                borderColor="gray.300"
                _hover={{
                  bg: "pink.100",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                }}
                onClick={handleWishlistToggle}
              >
                <Heart
                  size={{ base: 20, sm: 24, md: 28 }}
                  color="gray"
                  _hover={{ color: "pink.600" }}
                />
              </Box>
              <Box
                p={{ base: "8px", sm: "10px", md: "15px" }}
                borderBottom="1px solid"
                borderColor="gray.300"
                _hover={{
                  bg: "blue.100",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={handleChatToggle}
              >
                <MessageSquare
                  size={{ base: 20, sm: 24, md: 28 }}
                  color="gray"
                  _hover={{ color: "blue.600" }}
                />
              </Box>
              <Box
                p={{ base: "8px", sm: "10px", md: "15px" }}
                borderBottom="1px solid"
                borderColor="gray.300"
                _hover={{
                  bg: "green.100",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <Facebook
                  size={{ base: 20, sm: "24", md: 28 }}
                  color="gray"
                  _hover={{ color: "green.600" }}
                />
              </Box>
              <Box
                p={{ base: "8px", sm: "10px", md: "15px" }}
                borderBottom="1px solid"
                borderColor="gray.300"
                _hover={{
                  bg: "purple.100",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <Instagram
                  size={{ base: 20, sm: "24", md: 28 }}
                  color="gray"
                  _hover={{ color: "purple.600" }}
                />
              </Box>
              <Box
                p={{ base: "8px", sm: "10px", md: "15px" }}
                borderBottom="1px solid"
                borderColor="gray.300"
                _hover={{
                  bg: "yellow.100",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={handleScrollToTop}
              >
                <ArrowUp
                  size={{ base: 20, sm: "24", md: 28 }}
                  color="gray"
                  _hover={{ color: "yellow.600" }}
                />
              </Box>
              <Box
                p={{ base: "8px", sm: "10px", md: "10px" }}
                _hover={{
                  bg: "gray.100",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  borderBottomLeftRadius: "8px",
                  borderBottomRightRadius: "8px",
                }}
                onClick={toggleSidebar}
              >
                <Minimize2
                  size={{ base: 20, sm: "24", md: 28 }}
                  color="gray"
                  _hover={{ color: "gray.600" }}
                />
              </Box>
            </>
          )}
        </Box>
      </Box>

      <Box as="footer" bg="var(--primary-color)" py="30px">
        <Box
          w={{ base: "100%", md: "90%", lg: "80%" }}
          mx="auto"
          px={{ base: "20px", md: "50px", lg: 0 }}
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="flex-start"
            w="100%"
            gap={{ base: "30px", md: "0" }}
          >
            <Box
              flex="1"
              textAlign={{ base: "center", md: "left" }}
              mb={{ base: "20px", md: "0" }}
              w={{ base: "100%", md: "auto" }}
            >
              <Text
                fontSize="xl"
                fontWeight="bold"
                mb="15px"
                color="var(--text-color)"
              >
                VỀ CHÚNG TÔI
              </Text>
              <Text fontSize="md" color="var(--text-color)">
                <strong>LITTLE USA</strong> luôn đặt sự hài lòng của khách hàng
                lên hàng đầu, shop chỉ phân phối các sản phẩm Global Brand chính
                hãng. Để đáp ứng tốt nhu cầu của khách hàng, shop luôn cập nhật
                mẫu mã đa dạng, số lượng lớn, đa số các sản phẩm đều có sẵn,
                không mất thời gian đợi order của khách hàng.
              </Text>
              <Image
                src={bocongthuong}
                alt="Logo"
                w="140px"
                h="auto"
                mx={{ base: "auto", md: "0" }}
                opacity="0.8"
              />
            </Box>

            <Box
              flex="1"
              textAlign={{ base: "center", md: "center" }}
              mb={{ base: "20px", md: "0" }}
              w={{ base: "100%", md: "auto" }}
            >
              <Text
                fontSize="xl"
                fontWeight="bold"
                mb="15px"
                color="var(--text-color)"
              >
                HỖ TRỢ KHÁCH HÀNG
              </Text>
              <List spacing="10px" pl="0">
                {policyBlogs.length > 0 ? (
                  policyBlogs.map((blog) => (
                    <ListItem key={blog.id}>
                      <Link
                        as={RouterLink}
                        to={`/blog/${blog.id}`}
                        color="var(--text-color)"
                        _hover={{
                          color: "var(--text-color)",
                          textDecoration: "underline",
                        }}
                        cursor="pointer"
                        fontSize="sm"
                      >
                        {blog.title}
                      </Link>
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <Text color="var(--text-color)" fontSize="sm">
                      Chưa có chính sách nào được đăng.
                    </Text>
                  </ListItem>
                )}
              </List>
            </Box>

            <Box
              flex="1"
              textAlign={{ base: "center", md: "right" }}
              w={{ base: "100%", md: "auto" }}
            >
              <Text
                fontSize="xl"
                fontWeight="bold"
                mb="15px"
                color="var(--text-color)"
              >
                CHĂM SÓC KHÁCH HÀNG
              </Text>
              <Box mb="10px">
                <Flex
                  align="center"
                  justify={{ base: "center", md: "flex-end" }}
                  mb="5px"
                >
                  <Phone
                    size={20}
                    color="var(--text-color)"
                    opacity="0.8"
                    mr="15px"
                  />
                  <Text fontSize="sm" color="var(--text-color)" ml="2">
                    0211.3301.747
                  </Text>
                </Flex>
                <Flex
                  align="center"
                  justify={{ base: "center", md: "flex-end" }}
                >
                  <Mail
                    size={20}
                    color="var(--text-color)"
                    opacity="0.8"
                    mr="15px"
                  />
                  <Text fontSize="sm" color="var(--text-color)" ml="2">
                    littleusaapp@gmail.com
                  </Text>
                </Flex>
              </Box>
              <Flex
                justify={{ base: "center", md: "flex-end" }}
                mt="10px"
                gap="15px"
              >
                <Facebook
                  size={25}
                  color="var(--text-color)"
                  opacity="0.8"
                  cursor="pointer"
                  _hover={{ opacity: 1, transition: "all 0.3s ease" }}
                />
                <Instagram
                  size={25}
                  color="var(--text-color)"
                  opacity="0.8"
                  cursor="pointer"
                  _hover={{ opacity: 1, transition: "all 0.3s ease" }}
                />
              </Flex>
            </Box>
          </Flex>

          <Box textAlign="center" mt="20px" fontSize="xs">
            <Text color="var(--text-color)" opacity="0.7">
              Copyright © 2025 Powered by LITTLEUSA™
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;