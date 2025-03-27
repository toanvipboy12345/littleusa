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
  useColorModeValue,
  HStack,
  VStack,
  List,
  ListItem,
  ListIcon,
  Divider,
} from "@chakra-ui/react";
import {
  Package,
  Copy,
  User,
  ShoppingCart,
  Bell,
  FileText,
  Star,
} from "react-feather";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [weeklyRevenueData, setWeeklyRevenueData] = useState([]);
  const [topVariants, setTopVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chartBg = useColorModeValue("white", "gray.800");
  const chartBorder = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const statsResponse = await axiosInstance.get("/api/stats");
        setStats(statsResponse.data);

        const startDate = "2025-01-01";
        const endDate = "2025-03-31";
        const revenueResponse = await axiosInstance.get("/api/statistics/revenue", {
          params: { type: "time", startDate, endDate, groupBy: "week" },
        });
        setWeeklyRevenueData(revenueResponse.data);

        const topVariantsResponse = await axiosInstance.get("/api/statistics/top-variants", {
          params: { startDate, endDate },
        });
        setTopVariants(topVariantsResponse.data.slice(0, 10));
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const generateWeekLabels = () => {
    const start = new Date("2025-01-01");
    const end = new Date("2025-03-31");
    const labels = [];
    let current = new Date(start);

    while (current <= end) {
      const year = current.getFullYear();
      const week = getWeekNumber(current);
      labels.push({ label: `${year}-${week}`, displayLabel: `Tuần ${week} ${year}` });
      current.setDate(current.getDate() + 7);
    }
    return labels;
  };

  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const weekLabels = generateWeekLabels();
  const weekData = weekLabels.map((week) => {
    const found = weeklyRevenueData.find((item) => item.label === week.label);
    return found ? found.value : 0;
  });

  const weeklyRevenueChartData = {
    labels: weekLabels.map((week) => week.displayLabel),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: weekData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const weeklyRevenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw.toLocaleString()} VNĐ`,
        },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (value) => `${value.toLocaleString()} VNĐ` } },
      x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 0 } },
    },
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <Text color="red.500" fontSize="lg">{error}</Text>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <Text fontSize="lg">Không có dữ liệu thống kê.</Text>
      </Box>
    );
  }

  return (
    <Box p={{ base: 4, md: 6, lg: 4 }} mx="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={3}>Tổng quan</Text>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        <Box bg="blue.500" p={4} borderRadius="md" boxShadow="md" _dark={{ bg: "blue.700" }} textAlign="center" color="white">
          <Box as={Package} size={64} color="white" mb={2} display="block" mx="auto" />
          <Stat><StatNumber fontSize="3xl">{stats.totalProducts}</StatNumber><StatLabel fontSize="sm">Sản phẩm</StatLabel></Stat>
        </Box>
        <Box bg="purple.500" p={4} borderRadius="md" boxShadow="md" _dark={{ bg: "purple.700" }} textAlign="center" color="white">
          <Box as={Copy} size={64} color="white" mb={2} display="block" mx="auto" />
          <Stat><StatNumber fontSize="3xl">{stats.totalVariants}</StatNumber><StatLabel fontSize="sm">Biến thể sản phẩm</StatLabel></Stat>
        </Box>
        <Box bg="teal.500" p={4} borderRadius="md" boxShadow="md" _dark={{ bg: "teal.700" }} textAlign="center" color="white">
          <Box as={User} size={64} color="white" mb={2} display="block" mx="auto" />
          <Stat><StatNumber fontSize="3xl">{stats.totalRegularUsers}</StatNumber><StatLabel fontSize="sm">Khách hàng</StatLabel></Stat>
        </Box>
        <Box bg="red.500" p={4} borderRadius="md" boxShadow="md" _dark={{ bg: "red.700" }} textAlign="center" color="white">
          <Box as={ShoppingCart} size={64} color="white" mb={2} display="block" mx="auto" />
          <Stat><StatNumber fontSize="3xl">{stats.totalOrders}</StatNumber><StatLabel fontSize="sm">Đơn hàng</StatLabel></Stat>
        </Box>
      </SimpleGrid>

      <Box mt={2}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>Doanh thu theo tuần</Text>
        <HStack spacing={4} align="stretch" flexWrap={{ base: "wrap", md: "nowrap" }}>
          <Box
            p={4}
            bg={chartBg}
            borderWidth="1px"
            borderColor={chartBorder}
            borderRadius="md"
            boxShadow="sm"
            w={{ base: "100%", md: "70%" }}
            position="relative"
          >
            {weeklyRevenueData.length > 0 ? (
              <Line
                data={weeklyRevenueChartData}
                options={weeklyRevenueChartOptions}
                height="100%"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              />
            ) : (
              <Text>Không có dữ liệu để hiển thị.</Text>
            )}
          </Box>

          <VStack spacing={2} w={{ base: "100%", md: "30%" }} align="stretch">
            <Box
              bg="white"
              p={2}
              borderRadius="md"
              boxShadow="md"
              borderLeft="4px solid"
              borderColor="green.500"
              _dark={{ bg: "gray.900", color: "white" }}
              textAlign="center"
              h="10%"
            >
              <Text fontSize="lg" fontWeight="bold">Bạn có {stats.totalOrdersToday} đơn hàng mới</Text>
            </Box>

            <Box
              bg="white"
              p={2}
              borderRadius="md"
              boxShadow="md"
              borderLeft="4px solid"
              borderColor="yellow.500"
              _dark={{ bg: "gray.900", color: "white" }}
              textAlign="center"
              h="10%"
            >
              <Text fontSize="lg" fontWeight="bold">Bạn có {stats.totalNotificationsToday} thông báo mới</Text>
            </Box>

            <Box
              bg="white"
              px={4}
              py={2}
              borderRadius="md"
              boxShadow="md"
              borderLeft="4px solid"
              borderColor="purple.500"
              _dark={{ bg: "gray.900", color: "white" }}
            >
              <Text fontSize="lg" fontWeight="bold" textAlign="left" mb={2}>Sản phẩm bán chạy</Text>
              {topVariants.length > 0 ? (
                <List spacing={1}>
                  {topVariants.map((variant, index) => (
                    <Box key={index}>
                      <ListItem fontSize="sm" py={2}>
                        <ListIcon as={Star} color="purple.500" />
                        {variant.name}
                      </ListItem>
                      {index < topVariants.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              ) : (
                <Text fontSize="sm" textAlign="center">Không có dữ liệu</Text>
              )}
            </Box>
          </VStack>
        </HStack>
      </Box>
    </Box>
  );
};

export default Dashboard;