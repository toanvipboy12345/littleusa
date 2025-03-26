
// import React, { useContext, useEffect, useState } from "react";
// import ProductManagement from "../Admin/ProductManagement/ProductManagement";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../../context/UserContext";
// import BrandManagement from "../Admin/BrandManagement/BrandManagement";
// import CategoryManagement from "../Admin/CategoryManagement/CategoryManagement";
// import CouponManagement from "../Admin/CouponManagement/CouponManagement";
// import ShippingMethodManagement from "../Admin/ShippingMethodManagement/ShippingMethodManagement";
// import OrderManagement from "./OrderManagement/OrderManagement";
// import PurchaseOrderManagement from "../Admin/PurchaseOrderManagement/PurchaseOrderManagement";
// import AddPurchaseOrder from "../Admin/PurchaseOrderManagement/AddPurchaseOrder";
// import SupplierManagement from "../Admin/SupplierManagement/SupplierManagement";
// import UserManagement from "../Admin/UserManagement/UserManagement";
// import Dashboard from "../Admin/stats/Dashboard";
// import Statistics from "../Admin/Stats/Statistics";
// import Notifications from "../Admin/NotificationsManagement/Notifications";
// import BlogsManagement from "../Admin/BlogsManagement/BlogsManagement";
// import {
//   Box,
//   Flex,
//   Text,
//   Button,
//   IconButton,
//   VStack,
//   useColorMode,
//   Input,
//   InputGroup,
//   InputLeftElement,
// } from "@chakra-ui/react";
// import {
//   BarChart2,
//   Users,
//   ShoppingCart,
//   Bell,
//   Sun,
//   Moon,
//   Search,
//   LogOut,
//   ChevronRight,
//   ChevronLeft,
//   Tag,
//   Folder,
//   Package,
//   Percent,
//   Truck,
//   Activity,
//   FileText,
//   PlusSquare,
//   List,
//   UserCheck,
// } from "react-feather";

// const Admin = () => {
//   const navigate = useNavigate();
//   const { user, handleLogout } = useContext(UserContext);
//   const [activeMenu, setActiveMenu] = useState("dashboard");
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
//   const { colorMode, toggleColorMode } = useColorMode();

//   // Thay đổi document title khi activeMenu thay đổi (không bao gồm logout)
//   useEffect(() => {
//     const titles = {
//       dashboard: "Trang chủ",
//       products: "Quản lý sản phẩm",
//       suppliers: "Quản lý nhà cung cấp",
//       brands: "Quản lý thương hiệu",
//       categories: "Quản lý danh mục",
//       coupons: "Quản lý mã giảm giá",
//       shippingMethods: "Quản lý đơn vị vận chuyển",
//       users: "Khách hàng",
//       orders: "Đơn hàng",
//       statistics: "Thống kê",
//       notifications: "Thông báo",
//       addPurchaseOrder: "Nhập hàng",
//       purchaseOrders: "Danh sách hóa đơn",
//     };
//     document.title = titles[activeMenu] || "Admin - Dashboard";
//   }, [activeMenu]);


//   useEffect(() => {
//     if (!user || user.role !== "admin") {
//       navigate("/");
//     }
//   }, [user, navigate]);

//   const renderContent = () => {
//     switch (activeMenu) {
//       case "dashboard":
//         return <Box><Dashboard/></Box>;
//       case "products":
//         return (
//           <Box>
//             <ProductManagement />
//           </Box>
//         );
//       case "suppliers":
//         return (
//           <Box>
//             <SupplierManagement />
//           </Box>
//         );
//       case "users":
//         return (
//           <Box>
//             <UserManagement />
//           </Box>
//         );
//       case "orders":
//         return (
//           <Box>
//             <OrderManagement />
//           </Box>
//         );
//       case "statistics":
//         return (
//           <Box>
//             <Statistics />
//           </Box>
//         );
//       case "notifications":
//         return (
//           <Box>
//             <Notifications />
//           </Box>
//         );
//       case "brands":
//         return (
//           <Box>
//             <BrandManagement />
//           </Box>
//         );
//       case "categories":
//         return (
//           <Box>
//             <CategoryManagement />
//           </Box>
//         );
//       case "coupons":
//         return (
//           <Box>
//             <CouponManagement />
//           </Box>
//         );
//       case "shippingMethods":
//         return (
//           <Box>
//             <ShippingMethodManagement />
//           </Box>
//         );
//       case "addPurchaseOrder":
//         return (
//           <Box>
//             <AddPurchaseOrder />
//           </Box>
//         );
//       case "purchaseOrders":
//         return (
//           <Box>
//             <PurchaseOrderManagement />
//           </Box>
//         );
//       default:
//         return <Box>Dashboard Document</Box>;
//     }
//   };

//   const handleMenuClick = (menu) => {
//     setActiveMenu(menu);
//   };

//   return (
//     <Flex
//       h="100vh"
//       bg="gray.50"
//       color="gray.800"
//       _dark={{ bg: "gray.900", color: "white" }}
//     >
//       {/* Sidebar */}
//       <Box
//         w={isSidebarCollapsed ? "60px" : "250px"}
//         minH="100vh"
//         bg="white"
//         borderRight="1px"
//         borderColor="gray.200"
//         _dark={{ bg: "gray.800", borderColor: "gray.700" }}
//         transition="all 0.3s ease-in-out"
//         overflow="hidden"
//         position="fixed"
//         zIndex={1000}
//       >
//         <VStack align="stretch" spacing={0} p={isSidebarCollapsed ? 2 : 4}>
//           <Flex justify="space-between" align="center" mb={4}>
//             <Text
//               fontSize="xl"
//               fontWeight="bold"
//               color="gray.800"
//               _dark={{ color: "white" }}
//               display={isSidebarCollapsed ? "none" : "block"}
//             >
//               ADMIN
//             </Text>
//             <IconButton
//               icon={isSidebarCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
//               aria-label="Toggle Sidebar"
//               onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
//               variant="outline"
//               borderColor="gray.300"
//               color="gray.600"
//               _dark={{ borderColor: "gray.600", color: "gray.300", _hover: { bg: "gray.700", borderColor: "gray.400" } }}
//               _hover={{ bg: "gray.100", borderColor: "gray.500" }}
//             />
//           </Flex>

//           {/* Menu items */}
//           <Button
//             onClick={() => handleMenuClick("dashboard")}
//             w="full"
//             justifyContent={isSidebarCollapsed ? "center" : "start"}
//             borderRadius={0}
//             px={isSidebarCollapsed ? 0 : undefined}
//             leftIcon={<BarChart2 size={20} />}
//             bg={activeMenu === "dashboard" ? "primary.500" : "transparent"}
//             color={activeMenu === "dashboard" ? "white" : "gray.600"}
//             _dark={{
//               color: activeMenu === "dashboard" ? "white" : "gray.300",
//               _hover: { bg: "gray.700", color: "white" },
//               _active: { bg: "primary.500", color: "white" },
//             }}
//             _hover={{ bg: "gray.100", color: "gray.800" }}
//             _active={{ bg: "primary.500", color: "white" }}
//           >
//             {isSidebarCollapsed ? null : "Dashboard"}
//           </Button>
//           <Button
//             onClick={() => handleMenuClick("products")}
//             w="full"
//             justifyContent={isSidebarCollapsed ? "center" : "start"}
//             borderRadius={0}
//             px={isSidebarCollapsed ? 0 : undefined}
//             leftIcon={<Package size={20} />}
//             bg={activeMenu === "products" ? "primary.500" : "transparent"}
//             color={activeMenu === "products" ? "white" : "gray.600"}
//             _dark={{
//               color: activeMenu === "products" ? "white" : "gray.300",
//               _hover: { bg: "gray.700", color: "white" },
//               _active: { bg: "primary.500", color: "white" },
//             }}
//             _hover={{ bg: "gray.100", color: "gray.800" }}
//             _active={{ bg: "primary.500", color: "white" }}
//           >
//             {isSidebarCollapsed ? null : "Sản phẩm"}
//           </Button>
//           <Button
//             onClick={() => handleMenuClick("suppliers")}
//             w="full"
//             justifyContent={isSidebarCollapsed ? "center" : "start"}
//             borderRadius={0}
//             px={isSidebarCollapsed ? 0 : undefined}
//             leftIcon={<UserCheck size={20} />}
//             bg={activeMenu === "suppliers" ? "primary.500" : "transparent"}
//             color={activeMenu === "suppliers" ? "white" : "gray.600"}
//             _dark={{
//               color: activeMenu === "suppliers" ? "white" : "gray.300",
//               _hover: { bg: "gray.700", color: "white" },
//               _active: { bg: "primary.500", color: "white" },
//             }}
//             _hover={{ bg: "gray.100", color: "gray.800" }}
//             _active={{ bg: "primary.500", color: "white" }}
//           >
//             {isSidebarCollapsed ? null : "Quản lý nhà cung cấp"}
//           </Button>
//           <Button
//             onClick={() => handleMenuClick("addPurchaseOrder")}
//             w="full"
//             justifyContent={isSidebarCollapsed ? "center" : "start"}
//             borderRadius={0}
//             px={isSidebarCollapsed ? 0 : undefined}
//             leftIcon={<PlusSquare size={20} />}
//             bg={activeMenu === "addPurchaseOrder" ? "primary.500" : "transparent"}
//             color={activeMenu === "addPurchaseOrder" ? "white" : "gray.600"}
//             _dark={{
//               color: activeMenu === "addPurchaseOrder" ? "white" : "gray.300",
//               _hover: { bg: "gray.700", color: "white" },
//               _active: { bg: "primary.500", color: "white" },
//             }}
//             _hover={{ bg: "gray.100", color: "gray.800" }}
//             _active={{ bg: "primary.500", color: "white" }}
//           >
//             {isSidebarCollapsed ? null : "Nhập hàng"}
//           </Button>
//           <Button
//             onClick={() => handleMenuClick("purchaseOrders")}
//             w="full"
//             justifyContent={isSidebarCollapsed ? "center" : "start"}
//             borderRadius={0}
//             px={isSidebarCollapsed ? 0 : undefined}
//             leftIcon={<List size={20} />}
//             bg={activeMenu === "purchaseOrders" ? "primary.500" : "transparent"}
//             color={activeMenu === "purchaseOrders" ? "white" : "gray.600"}
//             _dark={{
//               color: activeMenu === "purchaseOrders" ? "white" : "gray.300",
//               _hover: { bg: "gray.700", color: "white" },
//               _active: { bg: "primary.500", color: "white" },
//             }}
//             _hover={{ bg: "gray.100", color: "gray.800" }}
//             _active={{ bg: "primary.500", color: "white" }}
//           >
//             {isSidebarCollapsed ? null : "Danh sách hóa đơn"}
//           </Button>
//           <Button
//             onClick={() => handleMenuClick("brands")}
//             w="full"
//             justifyContent={isSidebarCollapsed ? "center" : "start"}
//             borderRadius={0}
//             px={isSidebarCollapsed ? 0 : undefined}
//             leftIcon={<Tag size={20} />}
//             bg={activeMenu === "brands" ? "primary.500" : "transparent"}
//             color={activeMenu === "brands" ? "white" : "gray.600"}
//             _dark={{
//               color: activeMenu === "brands" ? "white" : "gray.300",
//               _hover: { bg: "gray.700", color: "white" },
//               _active: { bg: "primary.500", color: "white" },
//             }}
//             _hover={{ bg: "gray.100", color: "gray.800" }}
//             _active={{ bg: "primary.500", color: "white" }}
//           >
//             {isSidebarCollapsed ? null : "Thương hiệu"}
//           </Button>
//           <Button
//             onClick={() => handleMenuClick("categories")}
//             w="full"
//             justifyContent={isSidebarCollapsed ? "center" : "start"}
//             borderRadius={0}
//             px={isSidebarCollapsed ? 0 : undefined}
//             leftIcon={<Folder size={20} />}
//             bg={activeMenu === "categories" ? "primary.500" : "transparent"}
//             color={activeMenu === "categories" ? "white" : "gray.600"}
//             _dark={{
//               color: activeMenu === "categories" ? "white" : "gray.300",
//               _hover: { bg: "gray.700", color: "white" },
//               _active: { bg: "primary.500", color: "white" },
//             }}
//             _hover={{ bg: "gray.100", color: "gray.800" }}
//             _active={{ bg: "primary.500", color: "white" }}
//           >
//             {isSidebarCollapsed ? null : "Danh mục"}
//           </Button>
//           <Button
//             onClick={() => handleMenuClick("coupons")}
//             w="full"
//             justifyContent={isSidebarCollapsed ? "center" : "start"}
//             borderRadius={0}
//             px={isSidebarCollapsed ? 0 : undefined}
//             leftIcon={<Percent size={20} />}
//             bg={activeMenu === "coupons" ? "primary.500" : "transparent"}
//             color={activeMenu === "coupons" ? "white" : "gray.600"}
//             _dark={{
//               color: activeMenu === "coupons" ? "white" : "gray.300",
//               _hover: { bg: "gray.700", color: "white" },
//               _active: { bg: "primary.500", color: "white" },
//             }}
//             _hover={{ bg: "gray.100", color: "gray.800" }}
//             _active={{ bg: "primary.500", color: "white" }}
//           >
//             {isSidebarCollapsed ? null : "Mã giảm giá"}
//           </Button>
//           <Button
//             onClick={() => handleMenuClick("shippingMethods")}
//             w="full"
//             justifyContent={isSidebarCollapsed ? "center" : "start"}
//             borderRadius={0}
//             px={isSidebarCollapsed ? 0 : undefined}
//             leftIcon={<Truck size={20} />}
//             bg={activeMenu === "shippingMethods" ? "primary.500" : "transparent"}
//             color={activeMenu === "shippingMethods" ? "white" : "gray.600"}
//             _dark={{
//               color: activeMenu === "shippingMethods" ? "white" : "gray.300",
//               _hover: { bg: "gray.700", color: "white" },
//               _active: { bg: "primary.500", color: "white" },
//             }}
//             _hover={{ bg: "gray.100", color: "gray.800" }}
//             _active={{ bg: "primary.500", color: "white" }}
//           >
//             {isSidebarCollapsed ? null : "Đơn vị vận chuyển"}
//           </Button>
//           <Button
//             onClick={() => handleMenuClick("users")}
//             w="full"
//             justifyContent={isSidebarCollapsed ? "center" : "start"}
//             borderRadius={0}
//             px={isSidebarCollapsed ? 0 : undefined}
//             leftIcon={<Users size={20} />}
//             bg={activeMenu === "users" ? "primary.500" : "transparent"}
//             color={activeMenu === "users" ? "white" : "gray.600"}
//             _dark={{
//               color: activeMenu === "users" ? "white" : "gray.300",
//               _hover: { bg: "gray.700", color: "white" },
//               _active: { bg: "primary.500", color: "white" },
//             }}
//             _hover={{ bg: "gray.100", color: "gray.800" }}
//             _active={{ bg: "primary.500", color: "white" }}
//           >
//             {isSidebarCollapsed ? null : "Người dùng"}
//           </Button>
//           <Button
//             onClick={() => handleMenuClick("orders")}
//             w="full"
//             justifyContent={isSidebarCollapsed ? "center" : "start"}
//             borderRadius={0}
//             px={isSidebarCollapsed ? 0 : undefined}
//             leftIcon={<ShoppingCart size={20} />}
//             bg={activeMenu === "orders" ? "primary.500" : "transparent"}
//             color={activeMenu === "orders" ? "white" : "gray.600"}
//             _dark={{
//               color: activeMenu === "orders" ? "white" : "gray.300",
//               _hover: { bg: "gray.700", color: "white" },
//               _active: { bg: "primary.500", color: "white" },
//             }}
//             _hover={{ bg: "gray.100", color: "gray.800" }}
//             _active={{ bg: "primary.500", color: "white" }}
//           >
//             {isSidebarCollapsed ? null : "Đơn hàng"}
//           </Button>
//           <Button
//             onClick={() => handleMenuClick("statistics")}
//             w="full"
//             justifyContent={isSidebarCollapsed ? "center" : "start"}
//             borderRadius={0}
//             px={isSidebarCollapsed ? 0 : undefined}
//             leftIcon={<Activity size={20} />}
//             bg={activeMenu === "statistics" ? "primary.500" : "transparent"}
//             color={activeMenu === "statistics" ? "white" : "gray.600"}
//             _dark={{
//               color: activeMenu === "statistics" ? "white" : "gray.300",
//               _hover: { bg: "gray.700", color: "white" },
//               _active: { bg: "primary.500", color: "white" },
//             }}
//             _hover={{ bg: "gray.100", color: "gray.800" }}
//             _active={{ bg: "primary.500", color: "white" }}
//           >
//             {isSidebarCollapsed ? null : "Thống kê"}
//           </Button>
//           <Button
//             onClick={() => handleMenuClick("notifications")}
//             w="full"
//             justifyContent={isSidebarCollapsed ? "center" : "start"}
//             borderRadius={0}
//             px={isSidebarCollapsed ? 0 : undefined}
//             leftIcon={<Bell size={20} />}
//             bg={activeMenu === "notifications" ? "primary.500" : "transparent"}
//             color={activeMenu === "notifications" ? "white" : "gray.600"}
//             _dark={{
//               color: activeMenu === "notifications" ? "white" : "gray.300",
//               _hover: { bg: "gray.700", color: "white" },
//               _active: { bg: "primary.500", color: "white" },
//             }}
//             _hover={{ bg: "gray.100", color: "gray.800" }}
//             _active={{ bg: "primary.500", color: "white" }}
//           >
//             {isSidebarCollapsed ? null : "Thông báo"}
//           </Button>
//           <Button
//             onClick={() => {
//               handleMenuClick("logout");
//               handleLogout();
//             }}
//             w="full"
//             justifyContent={isSidebarCollapsed ? "center" : "start"}
//             borderRadius={0}
//             px={isSidebarCollapsed ? 0 : undefined}
//             leftIcon={<LogOut size={20} />}
//             bg={activeMenu === "logout" ? "primary.500" : "transparent"}
//             color={activeMenu === "logout" ? "white" : "red.500"}
//             _dark={{
//               color: activeMenu === "logout" ? "white" : "red.400",
//               _hover: { bg: "gray.700", color: "white" },
//               _active: { bg: "primary.500", color: "white" },
//             }}
//             _hover={{ bg: "gray.100", color: "red.700" }}
//             _active={{ bg: "primary.500", color: "white" }}
//           >
//             {isSidebarCollapsed ? null : "Đăng xuất"}
//           </Button>
//         </VStack>
//       </Box>

//       {/* Main content */}
//       <Flex
//         flex="1"
//         direction="column"
//         ml={isSidebarCollapsed ? "60px" : "250px"}
//         transition="margin 0.3s ease-in-out"
//       >
//         {/* Header */}
//         <Flex
//           as="header"
//           p={4}
//           borderBottom="1px"
//           borderColor="gray.200"
//           align="center"
//           justify="space-between"
//           position="sticky"
//           top={0}
//           bg="white"
//           _dark={{ borderColor: "gray.700", bg: "gray.800" }}
//           zIndex={999}
//         >
//           <IconButton
//             icon={<BarChart2 size={20} />}
//             aria-label="Toggle Sidebar"
//             display={{ base: "inline-flex", md: "none" }}
//             onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
//             variant="ghost"
//             color="gray.600"
//             _dark={{ color: "gray.300" }}
//           />
//           <Flex align="center" gap={2}>
//             <IconButton
//               icon={<Users size={20} />}
//               aria-label="User Profile"
//               variant="ghost"
//               color="gray.600"
//               _dark={{ color: "gray.300" }}
//             />
//             <Text fontWeight="bold" mr={2}>
//               {user?.firstName || "Admin"}
//             </Text>
//           </Flex>
//           <Flex align="center" gap={4}>
//             <InputGroup maxW="300px">
//               <InputLeftElement pointerEvents="none">
//                 <Search
//                   size={16}
//                   color="gray.500"
//                   _dark={{ color: "gray.400" }}
//                 />
//               </InputLeftElement>
//               <Input
//                 placeholder="Tìm kiếm..."
//                 variant="outline"
//                 borderColor="gray.300"
//                 _dark={{ borderColor: "gray.600" }}
//                 _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
//               />
//             </InputGroup>
//             <IconButton
//               icon={<Bell size={20} />}
//               aria-label="Notifications"
//               variant="ghost"
//               color="gray.600"
//               _dark={{ color: "gray.300" }}
//               position="relative"
//             >
//               <Box
//                 position="absolute"
//                 top="-8px"
//                 right="-8px"
//                 bg="red.500"
//                 color="white"
//                 borderRadius="full"
//                 px={2}
//                 fontSize="xs"
//               >
//                 3+
//               </Box>
//             </IconButton>
//             <IconButton
//               icon={colorMode === "light" ? <Sun size={20} /> : <Moon size={20} />}
//               aria-label="Toggle Dark Mode"
//               onClick={toggleColorMode}
//               variant="ghost"
//               color="gray.600"
//               _dark={{ color: "gray.300" }}
//             />
//           </Flex>
//         </Flex>

//         {/* Dynamic content */}
//         <Box
//           flex="1"
//           p={4}
//           overflowY="auto"
//           bg="gray.50"
//           _dark={{ bg: "gray.900" }}
//         >
//           {renderContent()}
//         </Box>
//       </Flex>
//     </Flex>
//   );
// };

// export default Admin;
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
import BlogsManagement from "../Admin/BlogsManagement/BlogsManagement"; // Thêm import BlogsManagement
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
  FileText,
  PlusSquare,
  List,
  UserCheck,
  File, // Thêm icon File cho BlogsManagement
} from "react-feather";

const Admin = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useContext(UserContext);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const { colorMode, toggleColorMode } = useColorMode();

  // Thay đổi document title khi activeMenu thay đổi (không bao gồm logout)
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
      blogs: "Quản lý bài viết", // Thêm title cho BlogsManagement
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
        return <Box><Dashboard/></Box>;
      case "products":
        return (
          <Box>
            <ProductManagement />
          </Box>
        );
      case "suppliers":
        return (
          <Box>
            <SupplierManagement />
          </Box>
        );
      case "users":
        return (
          <Box>
            <UserManagement />
          </Box>
        );
      case "orders":
        return (
          <Box>
            <OrderManagement />
          </Box>
        );
      case "statistics":
        return (
          <Box>
            <Statistics />
          </Box>
        );
      case "notifications":
        return (
          <Box>
            <Notifications />
          </Box>
        );
      case "brands":
        return (
          <Box>
            <BrandManagement />
          </Box>
        );
      case "categories":
        return (
          <Box>
            <CategoryManagement />
          </Box>
        );
      case "coupons":
        return (
          <Box>
            <CouponManagement />
          </Box>
        );
      case "shippingMethods":
        return (
          <Box>
            <ShippingMethodManagement />
          </Box>
        );
      case "addPurchaseOrder":
        return (
          <Box>
            <AddPurchaseOrder />
          </Box>
        );
      case "purchaseOrders":
        return (
          <Box>
            <PurchaseOrderManagement />
          </Box>
        );
      case "blogs": // Thêm case cho BlogsManagement
        return (
          <Box>
            <BlogsManagement />
          </Box>
        );
      default:
        return <Box>Dashboard Document</Box>;
    }
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <Flex
      h="100vh"
      bg="gray.50"
      color="gray.800"
      _dark={{ bg: "gray.900", color: "white" }}
    >
      {/* Sidebar */}
      <Box
        w={isSidebarCollapsed ? "60px" : "250px"}
        minH="100vh"
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        _dark={{ bg: "gray.800", borderColor: "gray.700" }}
        transition="all 0.3s ease-in-out"
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
              _dark={{ borderColor: "gray.600", color: "gray.300", _hover: { bg: "gray.700", borderColor: "gray.400" } }}
              _hover={{ bg: "gray.100", borderColor: "gray.500" }}
            />
          </Flex>

          {/* Menu items */}
          <Button
            onClick={() => handleMenuClick("dashboard")}
            w="full"
            justifyContent={isSidebarCollapsed ? "center" : "start"}
            borderRadius={0}
            px={isSidebarCollapsed ? 0 : undefined}
            leftIcon={<BarChart2 size={20} />}
            bg={activeMenu === "dashboard" ? "primary.500" : "transparent"}
            color={activeMenu === "dashboard" ? "white" : "gray.600"}
            _dark={{
              color: activeMenu === "dashboard" ? "white" : "gray.300",
              _hover: { bg: "gray.700", color: "white" },
              _active: { bg: "primary.500", color: "white" },
            }}
            _hover={{ bg: "gray.100", color: "gray.800" }}
            _active={{ bg: "primary.500", color: "white" }}
          >
            {isSidebarCollapsed ? null : "Dashboard"}
          </Button>
          <Button
            onClick={() => handleMenuClick("products")}
            w="full"
            justifyContent={isSidebarCollapsed ? "center" : "start"}
            borderRadius={0}
            px={isSidebarCollapsed ? 0 : undefined}
            leftIcon={<Package size={20} />}
            bg={activeMenu === "products" ? "primary.500" : "transparent"}
            color={activeMenu === "products" ? "white" : "gray.600"}
            _dark={{
              color: activeMenu === "products" ? "white" : "gray.300",
              _hover: { bg: "gray.700", color: "white" },
              _active: { bg: "primary.500", color: "white" },
            }}
            _hover={{ bg: "gray.100", color: "gray.800" }}
            _active={{ bg: "primary.500", color: "white" }}
          >
            {isSidebarCollapsed ? null : "Sản phẩm"}
          </Button>
          <Button
            onClick={() => handleMenuClick("suppliers")}
            w="full"
            justifyContent={isSidebarCollapsed ? "center" : "start"}
            borderRadius={0}
            px={isSidebarCollapsed ? 0 : undefined}
            leftIcon={<UserCheck size={20} />}
            bg={activeMenu === "suppliers" ? "primary.500" : "transparent"}
            color={activeMenu === "suppliers" ? "white" : "gray.600"}
            _dark={{
              color: activeMenu === "suppliers" ? "white" : "gray.300",
              _hover: { bg: "gray.700", color: "white" },
              _active: { bg: "primary.500", color: "white" },
            }}
            _hover={{ bg: "gray.100", color: "gray.800" }}
            _active={{ bg: "primary.500", color: "white" }}
          >
            {isSidebarCollapsed ? null : "Quản lý nhà cung cấp"}
          </Button>
          <Button
            onClick={() => handleMenuClick("addPurchaseOrder")}
            w="full"
            justifyContent={isSidebarCollapsed ? "center" : "start"}
            borderRadius={0}
            px={isSidebarCollapsed ? 0 : undefined}
            leftIcon={<PlusSquare size={20} />}
            bg={activeMenu === "addPurchaseOrder" ? "primary.500" : "transparent"}
            color={activeMenu === "addPurchaseOrder" ? "white" : "gray.600"}
            _dark={{
              color: activeMenu === "addPurchaseOrder" ? "white" : "gray.300",
              _hover: { bg: "gray.700", color: "white" },
              _active: { bg: "primary.500", color: "white" },
            }}
            _hover={{ bg: "gray.100", color: "gray.800" }}
            _active={{ bg: "primary.500", color: "white" }}
          >
            {isSidebarCollapsed ? null : "Nhập hàng"}
          </Button>
          <Button
            onClick={() => handleMenuClick("purchaseOrders")}
            w="full"
            justifyContent={isSidebarCollapsed ? "center" : "start"}
            borderRadius={0}
            px={isSidebarCollapsed ? 0 : undefined}
            leftIcon={<List size={20} />}
            bg={activeMenu === "purchaseOrders" ? "primary.500" : "transparent"}
            color={activeMenu === "purchaseOrders" ? "white" : "gray.600"}
            _dark={{
              color: activeMenu === "purchaseOrders" ? "white" : "gray.300",
              _hover: { bg: "gray.700", color: "white" },
              _active: { bg: "primary.500", color: "white" },
            }}
            _hover={{ bg: "gray.100", color: "gray.800" }}
            _active={{ bg: "primary.500", color: "white" }}
          >
            {isSidebarCollapsed ? null : "Danh sách hóa đơn"}
          </Button>
          <Button
            onClick={() => handleMenuClick("brands")}
            w="full"
            justifyContent={isSidebarCollapsed ? "center" : "start"}
            borderRadius={0}
            px={isSidebarCollapsed ? 0 : undefined}
            leftIcon={<Tag size={20} />}
            bg={activeMenu === "brands" ? "primary.500" : "transparent"}
            color={activeMenu === "brands" ? "white" : "gray.600"}
            _dark={{
              color: activeMenu === "brands" ? "white" : "gray.300",
              _hover: { bg: "gray.700", color: "white" },
              _active: { bg: "primary.500", color: "white" },
            }}
            _hover={{ bg: "gray.100", color: "gray.800" }}
            _active={{ bg: "primary.500", color: "white" }}
          >
            {isSidebarCollapsed ? null : "Thương hiệu"}
          </Button>
          <Button
            onClick={() => handleMenuClick("categories")}
            w="full"
            justifyContent={isSidebarCollapsed ? "center" : "start"}
            borderRadius={0}
            px={isSidebarCollapsed ? 0 : undefined}
            leftIcon={<Folder size={20} />}
            bg={activeMenu === "categories" ? "primary.500" : "transparent"}
            color={activeMenu === "categories" ? "white" : "gray.600"}
            _dark={{
              color: activeMenu === "categories" ? "white" : "gray.300",
              _hover: { bg: "gray.700", color: "white" },
              _active: { bg: "primary.500", color: "white" },
            }}
            _hover={{ bg: "gray.100", color: "gray.800" }}
            _active={{ bg: "primary.500", color: "white" }}
          >
            {isSidebarCollapsed ? null : "Danh mục"}
          </Button>
          <Button
            onClick={() => handleMenuClick("coupons")}
            w="full"
            justifyContent={isSidebarCollapsed ? "center" : "start"}
            borderRadius={0}
            px={isSidebarCollapsed ? 0 : undefined}
            leftIcon={<Percent size={20} />}
            bg={activeMenu === "coupons" ? "primary.500" : "transparent"}
            color={activeMenu === "coupons" ? "white" : "gray.600"}
            _dark={{
              color: activeMenu === "coupons" ? "white" : "gray.300",
              _hover: { bg: "gray.700", color: "white" },
              _active: { bg: "primary.500", color: "white" },
            }}
            _hover={{ bg: "gray.100", color: "gray.800" }}
            _active={{ bg: "primary.500", color: "white" }}
          >
            {isSidebarCollapsed ? null : "Mã giảm giá"}
          </Button>
          <Button
            onClick={() => handleMenuClick("shippingMethods")}
            w="full"
            justifyContent={isSidebarCollapsed ? "center" : "start"}
            borderRadius={0}
            px={isSidebarCollapsed ? 0 : undefined}
            leftIcon={<Truck size={20} />}
            bg={activeMenu === "shippingMethods" ? "primary.500" : "transparent"}
            color={activeMenu === "shippingMethods" ? "white" : "gray.600"}
            _dark={{
              color: activeMenu === "shippingMethods" ? "white" : "gray.300",
              _hover: { bg: "gray.700", color: "white" },
              _active: { bg: "primary.500", color: "white" },
            }}
            _hover={{ bg: "gray.100", color: "gray.800" }}
            _active={{ bg: "primary.500", color: "white" }}
          >
            {isSidebarCollapsed ? null : "Đơn vị vận chuyển"}
          </Button>
          <Button
            onClick={() => handleMenuClick("users")}
            w="full"
            justifyContent={isSidebarCollapsed ? "center" : "start"}
            borderRadius={0}
            px={isSidebarCollapsed ? 0 : undefined}
            leftIcon={<Users size={20} />}
            bg={activeMenu === "users" ? "primary.500" : "transparent"}
            color={activeMenu === "users" ? "white" : "gray.600"}
            _dark={{
              color: activeMenu === "users" ? "white" : "gray.300",
              _hover: { bg: "gray.700", color: "white" },
              _active: { bg: "primary.500", color: "white" },
            }}
            _hover={{ bg: "gray.100", color: "gray.800" }}
            _active={{ bg: "primary.500", color: "white" }}
          >
            {isSidebarCollapsed ? null : "Người dùng"}
          </Button>
          <Button
            onClick={() => handleMenuClick("orders")}
            w="full"
            justifyContent={isSidebarCollapsed ? "center" : "start"}
            borderRadius={0}
            px={isSidebarCollapsed ? 0 : undefined}
            leftIcon={<ShoppingCart size={20} />}
            bg={activeMenu === "orders" ? "primary.500" : "transparent"}
            color={activeMenu === "orders" ? "white" : "gray.600"}
            _dark={{
              color: activeMenu === "orders" ? "white" : "gray.300",
              _hover: { bg: "gray.700", color: "white" },
              _active: { bg: "primary.500", color: "white" },
            }}
            _hover={{ bg: "gray.100", color: "gray.800" }}
            _active={{ bg: "primary.500", color: "white" }}
          >
            {isSidebarCollapsed ? null : "Đơn hàng"}
          </Button>
          <Button
            onClick={() => handleMenuClick("statistics")}
            w="full"
            justifyContent={isSidebarCollapsed ? "center" : "start"}
            borderRadius={0}
            px={isSidebarCollapsed ? 0 : undefined}
            leftIcon={<Activity size={20} />}
            bg={activeMenu === "statistics" ? "primary.500" : "transparent"}
            color={activeMenu === "statistics" ? "white" : "gray.600"}
            _dark={{
              color: activeMenu === "statistics" ? "white" : "gray.300",
              _hover: { bg: "gray.700", color: "white" },
              _active: { bg: "primary.500", color: "white" },
            }}
            _hover={{ bg: "gray.100", color: "gray.800" }}
            _active={{ bg: "primary.500", color: "white" }}
          >
            {isSidebarCollapsed ? null : "Thống kê"}
          </Button>
          <Button
            onClick={() => handleMenuClick("notifications")}
            w="full"
            justifyContent={isSidebarCollapsed ? "center" : "start"}
            borderRadius={0}
            px={isSidebarCollapsed ? 0 : undefined}
            leftIcon={<Bell size={20} />}
            bg={activeMenu === "notifications" ? "primary.500" : "transparent"}
            color={activeMenu === "notifications" ? "white" : "gray.600"}
            _dark={{
              color: activeMenu === "notifications" ? "white" : "gray.300",
              _hover: { bg: "gray.700", color: "white" },
              _active: { bg: "primary.500", color: "white" },
            }}
            _hover={{ bg: "gray.100", color: "gray.800" }}
            _active={{ bg: "primary.500", color: "white" }}
          >
            {isSidebarCollapsed ? null : "Thông báo"}
          </Button>
          <Button
            onClick={() => handleMenuClick("blogs")} // Thêm menu item cho BlogsManagement
            w="full"
            justifyContent={isSidebarCollapsed ? "center" : "start"}
            borderRadius={0}
            px={isSidebarCollapsed ? 0 : undefined}
            leftIcon={<File size={20} />}
            bg={activeMenu === "blogs" ? "primary.500" : "transparent"}
            color={activeMenu === "blogs" ? "white" : "gray.600"}
            _dark={{
              color: activeMenu === "blogs" ? "white" : "gray.300",
              _hover: { bg: "gray.700", color: "white" },
              _active: { bg: "primary.500", color: "white" },
            }}
            _hover={{ bg: "gray.100", color: "gray.800" }}
            _active={{ bg: "primary.500", color: "white" }}
          >
            {isSidebarCollapsed ? null : "Quản lý bài viết"}
          </Button>
          <Button
            onClick={() => {
              handleMenuClick("logout");
              handleLogout();
            }}
            w="full"
            justifyContent={isSidebarCollapsed ? "center" : "start"}
            borderRadius={0}
            px={isSidebarCollapsed ? 0 : undefined}
            leftIcon={<LogOut size={20} />}
            bg={activeMenu === "logout" ? "primary.500" : "transparent"}
            color={activeMenu === "logout" ? "white" : "red.500"}
            _dark={{
              color: activeMenu === "logout" ? "white" : "red.400",
              _hover: { bg: "gray.700", color: "white" },
              _active: { bg: "primary.500", color: "white" },
            }}
            _hover={{ bg: "gray.100", color: "red.700" }}
            _active={{ bg: "primary.500", color: "white" }}
          >
            {isSidebarCollapsed ? null : "Đăng xuất"}
          </Button>
        </VStack>
      </Box>

      {/* Main content */}
      <Flex
        flex="1"
        direction="column"
        ml={isSidebarCollapsed ? "60px" : "250px"}
        transition="margin 0.3s ease-in-out"
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
        >
          <IconButton
            icon={<BarChart2 size={20} />}
            aria-label="Toggle Sidebar"
            display={{ base: "inline-flex", md: "none" }}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            variant="ghost"
            color="gray.600"
            _dark={{ color: "gray.300" }}
          />
          <Flex align="center" gap={2}>
            <IconButton
              icon={<Users size={20} />}
              aria-label="User Profile"
              variant="ghost"
              color="gray.600"
              _dark={{ color: "gray.300" }}
            />
            <Text fontWeight="bold" mr={2}>
              {user?.firstName || "Admin"}
            </Text>
          </Flex>
          <Flex align="center" gap={4}>
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <Search
                  size={16}
                  color="gray.500"
                  _dark={{ color: "gray.400" }}
                />
              </InputLeftElement>
              <Input
                placeholder="Tìm kiếm..."
                variant="outline"
                borderColor="gray.300"
                _dark={{ borderColor: "gray.600" }}
                _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
              />
            </InputGroup>
            <IconButton
              icon={<Bell size={20} />}
              aria-label="Notifications"
              variant="ghost"
              color="gray.600"
              _dark={{ color: "gray.300" }}
              position="relative"
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
        >
          {renderContent()}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Admin;