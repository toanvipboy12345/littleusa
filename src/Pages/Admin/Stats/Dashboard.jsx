import React, { useState, useEffect } from "react";
import axiosInstance from "../../../Api/axiosInstance";
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Spinner,
  Text,
} from "@chakra-ui/react";
import {
  Package,
  Copy, // Thay Layers bằng Copy cho Biến thể sản phẩm
  Users,
  User,
  UserCheck,
  ShoppingCart,
  FileText,
  Grid,
  Tag,
  Truck, // Sử dụng Truck cho Hình thức vận chuyển
  Percent,
} from "react-feather"; // Import các icon từ react-feather

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get("/api/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Nếu đang tải, hiển thị spinner
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  // Nếu có lỗi, hiển thị thông báo lỗi
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <Text color="red.500" fontSize="lg">
          {error}
        </Text>
      </Box>
    );
  }

  // Nếu không có dữ liệu, hiển thị thông báo
  if (!stats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <Text fontSize="lg">Không có dữ liệu thống kê.</Text>
      </Box>
    );
  }

  return (
    <Box p={{ base: 4, md: 6, lg: 8 }} mx="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Bảng điều khiển
      </Text>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {/* Tổng số sản phẩm */}
        <Box
          bg="white"
          p={4}
          borderRadius="md"
          boxShadow="md"
          borderLeft="4px solid"
          borderColor="blue.500"
          _dark={{ bg: "gray.900", color: "white", boxShadow: "md" }}
          textAlign="center"
        >
          <Box
            as={Package}
            size={54}
            color="blue.500"
            _dark={{ color: "blue.300" }}
            mb={2}
            display="block"
            mx="auto"
          />
          <Stat>
            <StatNumber fontSize="3xl">{stats.totalProducts}</StatNumber>
            <StatLabel fontSize="sm">Sản phẩm</StatLabel>
          </Stat>
        </Box>

        {/* Tổng số biến thể */}
        <Box
          bg="white"
          p={4}
          borderRadius="md"
          boxShadow="md"
          borderLeft="4px solid"
          borderColor="purple.500"
          _dark={{ bg: "gray.900", color: "white", boxShadow: "md" }}
          textAlign="center"
        >
          <Box
            as={Copy} // Thay Layers bằng Copy
            size={54}
            color="purple.500"
            _dark={{ color: "purple.300" }}
            mb={2}
            display="block"
            mx="auto"
          />
          <Stat>
            <StatNumber fontSize="3xl">{stats.totalVariants}</StatNumber>
            <StatLabel fontSize="sm">Biến thể sản phẩm</StatLabel>
          </Stat>
        </Box>


        {/* Tổng số khách hàng (role = "user") */}
        <Box
          bg="white"
          p={4}
          borderRadius="md"
          boxShadow="md"
          borderLeft="4px solid"
          borderColor="teal.500"
          _dark={{ bg: "gray.900", color: "white", boxShadow: "md" }}
          textAlign="center"
        >
          <Box
            as={User}
            size={54}
            color="teal.500"
            _dark={{ color: "teal.300" }}
            mb={2}
            display="block"
            mx="auto"
          />
          <Stat>
            <StatNumber fontSize="3xl">{stats.totalRegularUsers}</StatNumber>
            <StatLabel fontSize="sm">Khách hàng</StatLabel>
          </Stat>
        </Box>

        {/* Tổng số quản trị viên (role = "admin") */}

        {/* Tổng số đơn hàng */}
        <Box
          bg="white"
          p={4}
          borderRadius="md"
          boxShadow="md"
          borderLeft="4px solid"
          borderColor="red.500"
          _dark={{ bg: "gray.900", color: "white", boxShadow: "md" }}
          textAlign="center"
        >
          <Box
            as={ShoppingCart}
            size={54}
            color="red.500"
            _dark={{ color: "red.300" }}
            mb={2}
            display="block"
            mx="auto"
          />
          <Stat>
            <StatNumber fontSize="3xl">{stats.totalOrders}</StatNumber>
            <StatLabel fontSize="sm">Đơn hàng</StatLabel>
          </Stat>
        </Box>

      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;