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
import logo from "../../../Assets/Images/logo.jpg";
import { UserContext } from "../../../context/UserContext";
import Sidebar from "./Sidebar";
import CartDrawer from "../../Home/Body/Cart/CartDrawer";
import { useCart } from "../../../context/CartContext";
import SearchDrawer from "./SearchDrawer";

const Header = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { user, handleLogout } = useContext(UserContext);
  const [showAccountNav, setShowAccountNav] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems, fetchCart } = useCart();
  const hasFetched = useRef(false);
  const [isScrolled, setIsScrolled] = useState(false); // State để theo dõi cuộn trang

  // Chỉ gọi fetchCart khi mount lần đầu nếu có user hoặc cartToken
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

  // Lắng nghe sự kiện cartUpdated để cập nhật giỏ hàng
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCart();
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [fetchCart]);

  // Xử lý sự kiện cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true); // Ẩn header-top khi cuộn quá 50px
      } else {
        setIsScrolled(false); // Hiển thị header-top khi cuộn về đầu trang
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
        display={{ base: "none", md: "flex" }} // Luôn hiển thị trên md, không dùng display: none
        h={isScrolled ? "0px" : "40px"} // Thu nhỏ chiều cao khi ẩn
        opacity={isScrolled ? 0 : 1} // Làm mờ khi ẩn
        overflow="hidden" // Ẩn nội dung khi chiều cao = 0
        transition="height 0.3s ease, opacity 0.3s ease" // Hiệu ứng mượt mà
      >
        <Flex align="center" justify="center" p="10px" fontWeight="bold" mx="auto" color="white">
          MIỄN PHÍ VẬN CHUYỂN VỚI ĐƠN HÀNG 700.000₫ - KHÔNG ÁP DỤNG ĐƠN SALE
        </Flex>
      </Box>

      <Box className="header-main" py="25px" boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)">
        <Flex
          justify={{ base: "space-between", lg: "center" }}
          align="center"
          w={{ base: "100%", md: "80%" }}
          mx="auto"
          gap={{ base: "10px", md: "20px" }}
        >
          <Flex justify="space-between" align="center" w="100%">
            <Box display={{ base: "flex", md: "none" }} flex="0" px={{ base: "10px", md: "0" }}>
              <IconButton
                icon={<MenuIcon />}
                aria-label="Menu"
                onClick={() => setShowSidebar(!showSidebar)}
                variant="ghost"
                color="var(--primary-color)"
              />
            </Box>

            <Box
              flex={{ base: "0", md: "0" }}
              textAlign={{ base: "left", lg: "center" }}
              minW={{ base: "auto", md: "150px" }}
              mx={{ base: "0", lg: "auto" }}
              display="flex"
              justifyContent={{ base: "flex-start", lg: "center" }}
            >
              <RouterLink to="/">
                <Image
                  src={logo}
                  alt="Logo"
                  maxW={{ base: "150px", md: "180px" }}
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
              <Flex align="center" gap="20px">
                <Button as={RouterLink} to="/product" variant="ghost" color="var(--primary-color)" _hover={{ color: "var(--hover-color)", transform: "scale(1.1)" }} transition="all 0.2s ease-in-out">
                  Sản phẩm
                </Button>
                <Button as={RouterLink} to="/about-us" variant="ghost" color="var(--primary-color)" _hover={{ color: "var(--hover-color)", transform: "scale(1.1)" }} transition="all 0.2s ease-in-out">
                  Về chúng tôi
                </Button>
                <Button as={RouterLink} to="/brands" variant="ghost" color="var(--primary-color)" _hover={{ color: "var(--hover-color)", transform: "scale(1.1)" }} transition="all 0.2s ease-in-out">
                  Thương hiệu
                </Button>
                <Button as={RouterLink} to="/promotions" variant="ghost" color="var(--primary-color)" _hover={{ color: "var(--hover-color)", transform: "scale(1.1)" }} transition="all 0.2s ease-in-out">
                  Khuyến mãi
                </Button>
                <Button as={RouterLink} to="/contact" variant="ghost" color="var(--primary-color)" _hover={{ color: "var(--hover-color)", transform: "scale(1.1)" }} transition="all 0.2s ease-in-out">
                  Liên hệ
                </Button>
                <Button as={RouterLink} to="/blog" variant="ghost" color="var(--primary-color)" _hover={{ color: "var(--hover-color)", transform: "scale(1.1)" }} transition="all 0.2s ease-in-out">
                  Bài viết
                </Button>
              </Flex>
            </Box>

            <Box flex={{ base: "0", md: "0" }} minW={{ base: "auto", md: "150px" }} px={{ base: "10px", md: "0" }}>
              <Flex align="center" justify="flex-end" gap={{ base: "0", md: "10px" }}>
                <IconButton
                  icon={<Search />}
                  aria-label="Search"
                  variant="ghost"
                  color="var(--primary-color)"
                  display={{ base: "none", md: "flex" }}
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
                <Box display={{ base: "none", md: "flex" }}>
                  <Menu>
                    <MenuButton as={Button} variant="outline" color="var(--primary-color)" leftIcon={<User />}>
                      {user && user.firstName ? `${user.firstName} ${user.lastName || ""}` : "Tài khoản"}
                    </MenuButton>
                    <MenuList>
                      {user ? (
                        <>
                          <MenuItem as={RouterLink} to ="/account">Trang tài khoản</MenuItem>
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
          fetchCart(); // Cập nhật giỏ hàng khi đóng Drawer
        }}
      />
      <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </Box>
  );
};

export default Header;