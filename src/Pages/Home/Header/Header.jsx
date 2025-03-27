import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { Search, User, ShoppingCart, Menu as MenuIcon } from "react-feather";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../../Assets/Images/logo.jpg";
import { UserContext } from "../../../context/UserContext";
import Sidebar from "./Sidebar";
import CartDrawer from "../../Home/Body/Cart/CartDrawer";
import { useCart } from "../../../context/CartContext";
import SearchDrawer from "./SearchDrawer";
import axiosInstance from "../../../Api/axiosInstance";
import { ChevronDown } from "react-feather";

const MotionBox = motion(Box);

const Header = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { user, handleLogout } = useContext(UserContext);
  const [showAccountNav, setShowAccountNav] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems, fetchCart } = useCart();
  const hasFetched = useRef(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      const storedCartToken = localStorage.getItem("cartToken");
      const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      if (storedUser || storedCartToken) {
        fetchCart();
      }
      hasFetched.current = true;
    }
  }, [fetchCart]);

  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCart();
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [fetchCart]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeSidebar = () => {
    setShowSidebar(false);
    setShowAccountNav(false);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      w="100%"
      sx={{ position: "sticky", top: "0", background: "white", zIndex: "sticky" }}
      as="header"
    >
      <Box
        className="header-top"
        bg="var(--primary-color)"
        display={{ base: "none", md: "none", lg: "flex" }}
        h={isScrolled ? "0px" : "40px"}
        opacity={isScrolled ? 0 : 1}
        overflow="hidden"
        transition="height 0.3s ease, opacity 0.3s ease"
      >
        <Flex align="center" justify="center" p="10px" fontWeight="bold" mx="auto" color="white">
          MIỄN PHÍ VẬN CHUYỂN VỚI ĐƠN HÀNG TỪ 1.000.000₫
        </Flex>
      </Box>

      <Box className="header-main" py="25px" boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)" position="relative">
        <Flex
          justify="space-between"
          align="center"
          w={{ base: "100%", md: "100%", lg: "80%" }}
          mx="auto"
          gap={{ base: "10px", md: "10px", lg: "20px" }}
        >
          <Flex justify="space-between" align="center" w="100%">
            <Box display={{ base: "flex", md: "flex", lg: "none" }} flex="0" px={{ base: "10px", md: "10px" }}>
              <IconButton
                icon={<MenuIcon />}
                aria-label="Menu"
                onClick={() => setShowSidebar(!showSidebar)}
                variant="ghost"
                color="var(--primary-color)"
              />
            </Box>

            <Box
              flex={{ base: "0", md: "0", lg: "0" }}
              textAlign="center"
              minW={{ base: "auto", md: "auto", lg: "150px" }}
              mx={{ base: "auto", md: "auto", lg: "auto" }}
              display="flex"
              justifyContent="center"
            >
              <RouterLink to="/">
                <Image
                  src={logo}
                  alt="Logo"
                  maxW={{ base: "150px", md: "150px", lg: "180px" }}
                  h="auto"
                  objectFit="contain"
                />
              </RouterLink>
            </Box>

            <Box
              flex="1"
              display={{ base: "none", md: "none", lg: "flex" }}
              justifyContent="center"
              alignItems="center"
              gap="20px"
            >
              <Flex align="center" gap="20px" position="relative">
                <Button
                  as={RouterLink}
                  to="/product"
                  variant="ghost"
                  color="var(--primary-color)"
                  position="relative"
                  _hover={{
                    color: "var(--hover-color)",
                  }}
                  sx={{
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: "-2px",
                      left: "50%",
                      width: "0%",
                      height: "2px",
                      backgroundColor: "var(--hover-color)",
                      transition: "width 0.3s ease, left 0.3s ease",
                    },
                    "&:hover::after": {
                      width: "100%",
                      left: "0%",
                    },
                  }}
                  transition="color 0.2s ease-in-out"
                >
                  Sản phẩm
                </Button>
                <Button
                  as={RouterLink}
                  to="/about-us"
                  variant="ghost"
                  color="var(--primary-color)"
                  position="relative"
                  _hover={{
                    color: "var(--hover-color)",
                  }}
                  sx={{
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: "-2px",
                      left: "50%",
                      width: "0%",
                      height: "2px",
                      backgroundColor: "var(--hover-color)",
                      transition: "width 0.3s ease, left 0.3s ease",
                    },
                    "&:hover::after": {
                      width: "100%",
                      left: "0%",
                    },
                  }}
                  transition="color 0.2s ease-in-out"
                >
                  Về chúng tôi
                </Button>
                <Button
                  as={RouterLink}
                  to="/brands"
                  variant="ghost"
                  color="var(--primary-color)"
                  position="relative"
                  _hover={{
                    color: "var(--hover-color)",
                  }}
                  sx={{
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: "-2px",
                      left: "50%",
                      width: "0%",
                      height: "2px",
                      backgroundColor: "var(--hover-color)",
                      transition: "width 0.3s ease, left 0.3s ease",
                    },
                    "&:hover::after": {
                      width: "100%",
                      left: "0%",
                    },
                  }}
                  transition="color 0.2s ease-in-out"
                >
                  Thương hiệu
                </Button>
                <Button
                  as={RouterLink}
                  to="/promotions"
                  variant="ghost"
                  color="var(--primary-color)"
                  position="relative"
                  _hover={{
                    color: "var(--hover-color)",
                  }}
                  sx={{
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: "-2px",
                      left: "50%",
                      width: "0%",
                      height: "2px",
                      backgroundColor: "var(--hover-color)",
                      transition: "width 0.3s ease, left 0.3s ease",
                    },
                    "&:hover::after": {
                      width: "100%",
                      left: "0%",
                    },
                  }}
                  transition="color 0.2s ease-in-out"
                >
                  Khuyến mãi
                </Button>
                <Box
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                >
                  <Button
                    as={RouterLink}
                    to="/product" // Chỉ định đường dẫn mặc định
                    variant="ghost"
                    color="var(--primary-color)"
                    position="relative"
                    display="flex"
                    alignItems="center"
                    _hover={{
                      color: "var(--hover-color)",
                    }}
                    sx={{
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: "-2px",
                        left: "50%",
                        width: "0%",
                        height: "2px",
                        backgroundColor: "var(--hover-color)",
                        transition: "width 0.3s ease, left 0.3s ease",
                      },
                      "&:hover::after": {
                        width: "100%",
                        left: "0%",
                      },
                    }}
                    transition="color 0.2s ease-in-out"
                  >
                    Danh mục
                    <ChevronDown size={16} strokeWidth={3} style={{ marginLeft: "4px" }} />
                  </Button>
                  <AnimatePresence>
                    {isCategoriesOpen && (
                      <MotionBox
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        position="absolute"
                        top="110%"
                        right={0}
                        w="100vw"
                        transform="translateX(-50%)"
                        left="50%"
                        bg="white"
                        boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
                        zIndex="10"
                        py={2}
                      >
                        <Flex
                          justify="center"
                          align="center"
                          gap={4}
                          px={4}
                          flexWrap="wrap"
                        >
                          {categories.map((category) => (
                            <Box
                              key={category.id}
                              as={RouterLink}
                              to={`/product?category=${encodeURIComponent(category.name)}`}
                              px={3}
                              py={6}
                              transition="all 0.2s ease-in-out"
                              _hover={{ color: "var(--hover-color)" }}
                            >
                              <Text fontSize="md" fontWeight="bold" textTransform="uppercase">
                                {category.name}
                              </Text>
                            </Box>
                          ))}
                        </Flex>
                      </MotionBox>
                    )}
                  </AnimatePresence>
                </Box>
                <Button
                  as={RouterLink}
                  to="/blogs"
                  variant="ghost"
                  color="var(--primary-color)"
                  position="relative"
                  _hover={{
                    color: "var(--hover-color)",
                  }}
                  sx={{
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: "-2px",
                      left: "50%",
                      width: "0%",
                      height: "2px",
                      backgroundColor: "var(--hover-color)",
                      transition: "width 0.3s ease, left 0.3s ease",
                    },
                    "&:hover::after": {
                      width: "100%",
                      left: "0%",
                    },
                  }}
                  transition="color 0.2s ease-in-out"
                >
                  Bài viết
                </Button>
              </Flex>
            </Box>

            <Box flex={{ base: "0", md: "0", lg: "0" }} minW={{ base: "auto", md: "auto", lg: "150px" }} px={{ base: "10px", md: "10px" }}>
              <Flex align="center" justify="flex-end" gap={{ base: "0", md: "0", lg: "10px" }}>
                <IconButton
                  icon={<Search />}
                  aria-label="Search"
                  variant="ghost"
                  color="var(--primary-color)"
                  display={{ base: "none", md: "none", lg: "flex" }}
                  sx={{ "&:hover": { bg: "transparent", color: "var(--primary-color)" } }}
                  onClick={() => setIsSearchOpen(true)}
                />
                <IconButton
                  icon={<ShoppingCart />}
                  aria-label="Giỏ hàng"
                  variant="ghost"
                  color="var(--primary-color)"
                  sx={{ "&:hover": { bg: "transparent", color: "var(--hover-color)" } }}
                  position="relative"
                  onClick={() => setIsCartOpen(true)}
                >
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    bg="red.500"
                    color="white"
                    borderRadius="full"
                    px="2px"
                    py="1px"
                  >
                    {totalItems || 0}
                  </Text>
                </IconButton>
                <Box display={{ base: "none", md: "none", lg: "flex" }}>
                  <Menu>
                    <MenuButton as={Button} variant="outline" color="var(--primary-color)" leftIcon={<User />}>
                      {user && user.firstName ? `${user.firstName} ${user.lastName || ""}` : "Tài khoản"}
                    </MenuButton>
                    <MenuList>
                      {user ? (
                        <>
                          <MenuItem as={RouterLink} to="/account">Trang tài khoản</MenuItem>
                          <MenuItem as={RouterLink} to="/order">Lịch sử đơn hàng</MenuItem>
                          <MenuItem>Sản phẩm yêu thích</MenuItem>
                          <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                        </>
                      ) : (
                        <MenuItem as={RouterLink} to="/Login">Đăng nhập</MenuItem>
                      )}
                    </MenuList>
                  </Menu>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Box>

      <Sidebar
        showSidebar={showSidebar}
        closeSidebar={closeSidebar}
        user={user}
        handleLogout={handleLogout}
        showAccountNav={showAccountNav}
        setShowAccountNav={setShowAccountNav}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => {
          setIsCartOpen(false);
          fetchCart();
        }}
      />
      <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </Box>
  );
};

export default Header;