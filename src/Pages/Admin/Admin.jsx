import React, { useContext, useEffect, useState } from "react";
import ProductManagement from "../Admin/ProductManagement/ProductManagement";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import BrandManagement from "../Admin/BrandManagement/BrandManagement";
import CategoryManagement from "../Admin/CategoryManagement/CategoryManagement";
import CouponManagement from "../Admin/CouponManagement/CouponManagement";
import ShippingMethodManagement from "../Admin/ShippingMethodManagement/ShippingMethodManagement";
import OrderManagement from "./OrderManagement/OrderManagement";
import PurchaseOrderManagement from "../Admin/PurchaseOrderManagement/PurchaseOrderManagement";
import AddPurchaseOrder from "../Admin/PurchaseOrderManagement/AddPurchaseOrder";
import SupplierManagement from "../Admin/SupplierManagement/SupplierManagement";
import UserManagement from "../Admin/UserManagement/UserManagement";
import Dashboard from "../Admin/stats/Dashboard";
import Statistics from "../Admin/Stats/Statistics";
import Notifications from "../Admin/NotificationsManagement/Notifications";
import BlogsManagement from "../Admin/BlogsManagement/BlogsManagement";
import {
  Box,
  Flex,
  Text,
  Button,
  IconButton,
  VStack,
  useColorMode,
  Input,
  InputGroup,
  InputLeftElement,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import {
  BarChart2,
  Users,
  ShoppingCart,
  Bell,
  Sun,
  Moon,
  Search,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Tag,
  Folder,
  Package,
  Percent,
  Truck,
  Activity,
  File,
  PlusSquare,
  List,
  UserCheck,
} from "react-feather";

const Admin = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useContext(UserContext);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const titles = {
      dashboard: "Trang chủ",
      products: "Quản lý sản phẩm",
      suppliers: "Quản lý nhà cung cấp",
      brands: "Quản lý thương hiệu",
      categories: "Quản lý danh mục",
      coupons: "Quản lý mã giảm giá",
      shippingMethods: "Quản lý đơn vị vận chuyển",
      users: "Khách hàng",
      orders: "Đơn hàng",
      statistics: "Thống kê",
      notifications: "Thông báo",
      addPurchaseOrder: "Nhập hàng",
      purchaseOrders: "Danh sách hóa đơn",
      blogs: "Quản lý bài viết",
    };
    document.title = titles[activeMenu] || "Admin - Dashboard";
  }, [activeMenu]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <Box><Dashboard /></Box>;
      case "products":
        return <Box><ProductManagement /></Box>;
      case "suppliers":
        return <Box><SupplierManagement /></Box>;
      case "users":
        return <Box><UserManagement /></Box>;
      case "orders":
        return <Box><OrderManagement /></Box>;
      case "statistics":
        return <Box><Statistics /></Box>;
      case "notifications":
        return <Box><Notifications /></Box>;
      case "brands":
        return <Box><BrandManagement /></Box>;
      case "categories":
        return <Box><CategoryManagement /></Box>;
      case "coupons":
        return <Box><CouponManagement /></Box>;
      case "shippingMethods":
        return <Box><ShippingMethodManagement /></Box>;
      case "addPurchaseOrder":
        return <Box><AddPurchaseOrder /></Box>;
      case "purchaseOrders":
        return <Box><PurchaseOrderManagement /></Box>;
      case "blogs":
        return <Box><BlogsManagement /></Box>;
      default:
        return <Box>Dashboard Document</Box>;
    }
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const renderMenuItem = (menuKey, label, icon, isLogout = false) => (
    <Button
      onClick={() => {
        if (isLogout) {
          handleLogout();
        }
        handleMenuClick(menuKey);
      }}
      w="full"
      justifyContent={isSidebarCollapsed ? "center" : "start"}
      borderRadius={0}
      px={isSidebarCollapsed ? 0 : 4}
      py={6}
      leftIcon={isSidebarCollapsed ? undefined : icon}
      borderLeft={activeMenu === menuKey ? "4px solid var(--primary-color)" : "none"}
      bg={activeMenu === menuKey ? "gray.100" : "transparent"}
      color={activeMenu === menuKey ? "primary.500" : isLogout ? "red.500" : "gray.600"}
      _dark={{
        color: activeMenu === menuKey ? "white" : isLogout ? "red.400" : "gray.300",
        bg: activeMenu === menuKey ? "gray.700" : "transparent",
      }}
      _hover={{ bg: "gray.100", transform: "scale(1.02)", transition: "transform 0.2s ease" }}
      transition="background 0.5s ease, color 0.5s ease, border-color 0.5s ease" // Transition cho dark/light mode
    >
      {isSidebarCollapsed ? icon : label}
    </Button>
  );

  const renderSubMenuItem = (menuKey, label, icon) => (
    <Button
      onClick={() => handleMenuClick(menuKey)}
      w="full"
      justifyContent="start"
      borderRadius={0}
      px={4}
      py={6}
      leftIcon={isSidebarCollapsed ? icon : icon}
      borderLeft={activeMenu === menuKey ? "4px solid var(--primary-color)" : "none"}
      bg={activeMenu === menuKey ? "gray.100" : "transparent"}
      color={activeMenu === menuKey ? "primary.500" : "gray.600"}
      _dark={{
        color: activeMenu === menuKey ? "white" : "gray.300",
        bg: activeMenu === menuKey ? "gray.700" : "transparent",
      }}
      _hover={{ bg: "gray.100", transform: "scale(1.02)", transition: "transform 0.2s ease" }}
      transition="background 0.5s ease, color 0.5s ease, border-color 0.5s ease" // Transition cho dark/light mode
    >
      {isSidebarCollapsed ? null : label}
    </Button>
  );

  return (
    <Flex
      h="100vh"
      bg="gray.50"
      color="gray.800"
      _dark={{ bg: "gray.900", color: "white" }}
      transition="background 0.5s ease, color 0.5s ease" // Transition cho dark/light mode
    >
      {/* Sidebar */}
      <Box
        w={isSidebarCollapsed ? "60px" : "250px"}
        minH="100vh"
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        _dark={{ bg: "gray.800", borderColor: "gray.700" }}
        transition="width 0.3s ease-in-out, background 0.5s ease, border-color 0.5s ease" // Transition cho sidebar và dark/light mode
        overflow="hidden"
        position="fixed"
        zIndex={1000}
      >
        <VStack align="stretch" spacing={0} p={isSidebarCollapsed ? 2 : 4}>
          <Flex justify="space-between" align="center" mb={4}>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="gray.800"
              _dark={{ color: "white" }}
              display={isSidebarCollapsed ? "none" : "block"}
              transition="color 0.5s ease" // Transition cho dark/light mode
            >
              ADMIN
            </Text>
            <IconButton
              icon={isSidebarCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
              aria-label="Toggle Sidebar"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              variant="outline"
              borderColor="gray.300"
              color="gray.600"
              _dark={{ borderColor: "gray.600", color: "gray.300", _hover: { bg: "gray.700" } }}
              _hover={{ bg: "gray.100" }}
              transition="background 0.5s ease, color 0.5s ease, border-color 0.5s ease" // Transition cho dark/light mode
            />
          </Flex>

          {/* Menu items with Accordion */}
          <Accordion allowMultiple>
            {/* Dashboard */}
            {renderMenuItem("dashboard", "Dashboard", <BarChart2 size={20} />)}

            {/* Nhóm Quản lý sản phẩm */}
            <AccordionItem border="none">
              <AccordionButton px={isSidebarCollapsed ? 0 : 4} py={6}>
                {isSidebarCollapsed ? (
                  <Package size={20} />
                ) : (
                  <Box flex="1" textAlign="left" fontWeight="bold" color="gray.600" _dark={{ color: "gray.300" }}>
                    Quản lý sản phẩm
                  </Box>
                )}
                {!isSidebarCollapsed && <AccordionIcon />}
              </AccordionButton>
              <AccordionPanel pb={0} px={isSidebarCollapsed ? 0 : 6}>
                {renderSubMenuItem("products", "Sản phẩm", <Package size={20} />)}
                {renderSubMenuItem("brands", "Thương hiệu", <Tag size={20} />)}
                {renderSubMenuItem("categories", "Danh mục", <Folder size={20} />)}
              </AccordionPanel>
            </AccordionItem>

            {/* Nhóm Nhập hàng */}
            <AccordionItem border="none">
              <AccordionButton px={isSidebarCollapsed ? 0 : 4} py={6}>
                {isSidebarCollapsed ? (
                  <PlusSquare size={20} />
                ) : (
                  <Box flex="1" textAlign="left" fontWeight="bold" color="gray.600" _dark={{ color: "gray.300" }}>
                    Nhập hàng
                  </Box>
                )}
                {!isSidebarCollapsed && <AccordionIcon />}
              </AccordionButton>
              <AccordionPanel pb={0} px={isSidebarCollapsed ? 0 : 6}>
                {renderSubMenuItem("suppliers", "Nhà cung cấp", <UserCheck size={20} />)}
                {renderSubMenuItem("addPurchaseOrder", "Nhập hàng", <PlusSquare size={20} />)}
                {renderSubMenuItem("purchaseOrders", "Hóa đơn nhập hàng", <List size={20} />)}
              </AccordionPanel>
            </AccordionItem>

            {/* Nhóm Đơn hàng & Vận chuyển */}
            <AccordionItem border="none">
              <AccordionButton px={isSidebarCollapsed ? 0 : 4} py={6}>
                {isSidebarCollapsed ? (
                  <ShoppingCart size={20} />
                ) : (
                  <Box flex="1" textAlign="left" fontWeight="bold" color="gray.600" _dark={{ color: "gray.300" }}>
                    Đơn hàng & Vận chuyển
                  </Box>
                )}
                {!isSidebarCollapsed && <AccordionIcon />}
              </AccordionButton>
              <AccordionPanel pb={0} px={isSidebarCollapsed ? 0 : 6}>
                {renderSubMenuItem("orders", "Đơn hàng", <ShoppingCart size={20} />)}
                {renderSubMenuItem("shippingMethods", "Vận chuyển", <Truck size={20} />)}
                {renderSubMenuItem("coupons", "Mã giảm giá", <Percent size={20} />)}
              </AccordionPanel>
            </AccordionItem>

            {/* Nhóm Người dùng & Nội dung */}
            <AccordionItem border="none">
              <AccordionButton px={isSidebarCollapsed ? 0 : 4} py={6}>
                {isSidebarCollapsed ? (
                  <Users size={20} />
                ) : (
                  <Box flex="1" textAlign="left" fontWeight="bold" color="gray.600" _dark={{ color: "gray.300" }}>
                    Người dùng & Nội dung
                  </Box>
                )}
                {!isSidebarCollapsed && <AccordionIcon />}
              </AccordionButton>
              <AccordionPanel pb={0} px={isSidebarCollapsed ? 0 : 6}>
                {renderSubMenuItem("users", "Người dùng", <Users size={20} />)}
                {renderSubMenuItem("blogs", "Bài viết", <File size={20} />)}
                {renderSubMenuItem("notifications", "Thông báo", <Bell size={20} />)}
              </AccordionPanel>
            </AccordionItem>

            {/* Nhóm Thống kê */}
            <AccordionItem border="none">
              <AccordionButton px={isSidebarCollapsed ? 0 : 4} py={6}>
                {isSidebarCollapsed ? (
                  <Activity size={20} />
                ) : (
                  <Box flex="1" textAlign="left" fontWeight="bold" color="gray.600" _dark={{ color: "gray.300" }}>
                    Thống kê
                  </Box>
                )}
                {!isSidebarCollapsed && <AccordionIcon />}
              </AccordionButton>
              <AccordionPanel pb={0} px={isSidebarCollapsed ? 0 : 6}>
                {renderSubMenuItem("statistics", "Thống kê", <Activity size={20} />)}
              </AccordionPanel>
            </AccordionItem>

            {/* Đăng xuất */}
            {renderMenuItem("logout", "Đăng xuất", <LogOut size={20} />, true)}
          </Accordion>
        </VStack>
      </Box>

      {/* Main content */}
      <Flex
        flex="1"
        direction="column"
        ml={isSidebarCollapsed ? "60px" : "250px"}
        transition="margin 0.3s ease-in-out" // Transition cho sidebar
      >
        {/* Header */}
        <Flex
          as="header"
          p={4}
          borderBottom="1px"
          borderColor="gray.200"
          align="center"
          justify="space-between"
          position="sticky"
          top={0}
          bg="white"
          _dark={{ borderColor: "gray.700", bg: "gray.800" }}
          zIndex={999}
          transition="background 0.5s ease, border-color 0.5s ease" // Transition cho dark/light mode
        >
          <IconButton
            icon={<BarChart2 size={20} />}
            aria-label="Toggle Sidebar"
            display={{ base: "inline-flex", md: "none" }}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            variant="ghost"
            color="gray.600"
            _dark={{ color: "gray.300" }}
            transition="color 0.5s ease" // Transition cho dark/light mode
          />
          <Flex align="center" gap={2}>
            <IconButton
              icon={<Users size={20} />}
              aria-label="User Profile"
              variant="ghost"
              color="gray.600"
              _dark={{ color: "gray.300" }}
              transition="color 0.5s ease" // Transition cho dark/light mode
            />
            <Text
              fontWeight="bold"
              mr={2}
              transition="color 0.5s ease" // Transition cho dark/light mode
            >
              {user?.firstName || "Admin"}
            </Text>
          </Flex>
          <Flex align="center" gap={4}>
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <Search size={16} color="gray.500" _dark={{ color: "gray.400" }} />
              </InputLeftElement>
              <Input
                placeholder="Tìm kiếm..."
                variant="outline"
                borderColor="gray.300"
                _dark={{ borderColor: "gray.600" }}
                _focus={{ borderColor: "primary.500", boxShadow: "0 0 0 1px var(--primary-color)" }}
                transition="border-color 0.5s ease" // Transition cho dark/light mode
              />
            </InputGroup>
            <IconButton
              icon={<Bell size={20} />}
              aria-label="Notifications"
              variant="ghost"
              color="gray.600"
              _dark={{ color: "gray.300" }}
              position="relative"
              transition="color 0.5s ease" // Transition cho dark/light mode
            >
              <Box
                position="absolute"
                top="-8px"
                right="-8px"
                bg="red.500"
                color="white"
                borderRadius="full"
                px={2}
                fontSize="xs"
                transition="background 0.5s ease, color 0.5s ease" // Transition cho dark/light mode
              >
                3+
              </Box>
            </IconButton>
            <IconButton
              icon={colorMode === "light" ? <Sun size={20} /> : <Moon size={20} />}
              aria-label="Toggle Dark Mode"
              onClick={toggleColorMode}
              variant="ghost"
              color="gray.600"
              _dark={{ color: "gray.300" }}
              transition="color 0.5s ease" // Transition cho dark/light mode
            />
          </Flex>
        </Flex>

        {/* Dynamic content */}
        <Box
          flex="1"
          p={4}
          overflowY="auto"
          bg="gray.50"
          _dark={{ bg: "gray.900" }}
          transition="background 0.5s ease" // Transition cho dark/light mode
        >
          {renderContent()}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Admin;