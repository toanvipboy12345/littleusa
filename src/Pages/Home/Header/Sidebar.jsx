import React, { useContext } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Box,
  Flex,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  ChevronRight,
  ChevronDown,
  Package,
  Info,
  Star,
  Percent,
  Mail,
  Book,
  User as UserIcon,
  Clock,
  Heart,
  LogOut,
  Search as SearchIcon,
} from "react-feather";
import { UserContext } from "../../../context/UserContext"; // Import UserContext

const Sidebar = ({ showSidebar, closeSidebar, showAccountNav, setShowAccountNav }) => {
  const { user, handleLogout } = useContext(UserContext); // Sử dụng useContext trong Sidebar

  return (
    <Drawer isOpen={showSidebar} placement="left" onClose={closeSidebar}>
      <DrawerOverlay />
      <DrawerContent>
        {/* Nội dung của Sidebar */}
        <Box p="20px">
          {/* Phần header-top trong sidebar */}
          <Box mb="20px" bg="var(--primary-color)" p="10px">
            <Flex
              align="center"
              justify="center"
              fontWeight="bold"
              color="var(--text-color)"
            >
              MIỄN PHÍ VẬN CHUYỂN VỚI ĐƠN HÀNG 700.000₫, KHÔNG ÁP DỤNG ĐƠN SALE
            </Flex>
          </Box>

          {/* Thanh tìm kiếm */}
          <Box mb="20px">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="var(--primary-color)" />
              </InputLeftElement>
              <Input
                placeholder="Tìm kiếm..."
                variant="outline"
                borderColor="var(--primary-color)"
                _focus={{ borderColor: "var(--hover-color)" }}
                onChange={(e) => console.log(e.target.value)} // Bạn có thể thay bằng logic tìm kiếm thực tế
              />
            </InputGroup>
          </Box>

          {/* Nav chính */}
          <Flex direction="column" gap="10px">
            <Button
              as={RouterLink}
              to="/product"
              variant="ghost"
              justifyContent="space-between"
              rightIcon={<Package />}
              onClick={closeSidebar}
            >
              Sản phẩm
            </Button>
            <Button
              as={RouterLink}
              to="/about"
              variant="ghost"
              justifyContent="space-between"
              rightIcon={<Info />}
              onClick={closeSidebar}
            >
              Về chúng tôi
            </Button>
            <Button
              as={RouterLink}
              to="/brands"
              variant="ghost"
              justifyContent="space-between"
              rightIcon={<Star />}
              onClick={closeSidebar}
            >
              Thương hiệu
            </Button>
            <Button
              as={RouterLink}
              to="/promotions"
              variant="ghost"
              justifyContent="space-between"
              rightIcon={<Percent />}
              onClick={closeSidebar}
            >
              Khuyến mãi
            </Button>
            <Button
              as={RouterLink}
              to="/contact"
              variant="ghost"
              justifyContent="space-between"
              rightIcon={<Mail />}
              onClick={closeSidebar}
            >
              Liên hệ
            </Button>
            <Button
              as={RouterLink}
              to="/blog"
              variant="ghost"
              justifyContent="space-between"
              rightIcon={<Book />}
              onClick={closeSidebar}
            >
              Bài viết
            </Button>

            {/* Nav tài khoản */}
            <Button
              variant="ghost"
              justifyContent="space-between"
              rightIcon={showAccountNav ? <ChevronDown /> : <ChevronRight />}
              onClick={() => setShowAccountNav(!showAccountNav)}
            >
              {user && user.firstName
                ? `${user.firstName} ${user.lastName || ""}`
                : "Tài khoản"}
            </Button>

            {/* Submenu tài khoản */}
            {showAccountNav && (
              <Box pl="20px" display="flex" flexDirection="column" gap="10px">
                {user ? (
                  <>
                    <Button
                      as={RouterLink}
                      to="/account"
                      variant="ghost"
                      justifyContent="space-between"
                      rightIcon={<UserIcon />}
                      onClick={closeSidebar}
                    >
                      Trang tài khoản
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/order-history"
                      variant="ghost"
                      justifyContent="space-between"
                      rightIcon={<Clock />}
                      onClick={closeSidebar}
                    >
                      Lịch sử đơn hàng
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/wishlist"
                      variant="ghost"
                      justifyContent="space-between"
                      rightIcon={<Heart />}
                      onClick={closeSidebar}
                    >
                      Sản phẩm yêu thích
                    </Button>
                    <Button
                      variant="ghost"
                      justifyContent="space-between"
                      rightIcon={<LogOut />}
                      onClick={() => {
                        handleLogout();
                        closeSidebar();
                      }}
                    >
                      Đăng xuất
                    </Button>
                  </>
                ) : (
                  <Button
                    as={RouterLink}
                    to="/Login"
                    variant="ghost"
                    justifyContent="space-between"
                    rightIcon={<UserIcon />}
                    onClick={closeSidebar}
                  >
                    Đăng nhập
                  </Button>
                )}
              </Box>
            )}
          </Flex>
        </Box>
      </DrawerContent>
    </Drawer>
  );
};

export default Sidebar;