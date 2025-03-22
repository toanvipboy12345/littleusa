import React, { useState, useEffect } from "react";
import axiosInstance from "../../../Api/axiosInstance";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Select,
  Input,
  Text,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import { Line, Pie, PolarArea, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  RadialLinearScale,
} from "chart.js";

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  RadialLinearScale
);

const Statistics = () => {
  const [loading, setLoading] = useState(false);
  const [timeRevenueData, setTimeRevenueData] = useState([]);
  const [brandRevenueData, setBrandRevenueData] = useState([]);
  const [paymentMethodRevenueData, setPaymentMethodRevenueData] = useState([]);
  const [supplierTransactionData, setSupplierTransactionData] = useState([]);

  // Bộ lọc
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-03-31");
  const [groupBy, setGroupBy] = useState("month");

  // Màu sắc cho biểu đồ
  const chartBg = useColorModeValue("white", "gray.800");
  const chartBorder = useColorModeValue("gray.200", "gray.600");

  // Hàm lấy dữ liệu từ API
  const fetchRevenueData = async (type) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/statistics/revenue`, {
        params: {
          type,
          startDate,
          endDate,
          groupBy: type === "time" ? groupBy : undefined,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${type} revenue data:`, error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchSupplierTransactionData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/statistics/supplier-transactions`, {
        params: {
          startDate,
          endDate,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching supplier transaction data:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Lấy dữ liệu khi component mount hoặc khi bộ lọc thay đổi
  useEffect(() => {
    const fetchAllData = async () => {
      const timeData = await fetchRevenueData("time");
      const brandData = await fetchRevenueData("brand");
      const paymentMethodData = await fetchRevenueData("paymentMethod");
      const supplierTransactionData = await fetchSupplierTransactionData();

      setTimeRevenueData(timeData);
      setBrandRevenueData(brandData);
      setPaymentMethodRevenueData(paymentMethodData);
      setSupplierTransactionData(supplierTransactionData);
    };

    fetchAllData();
  }, [startDate, endDate, groupBy]);

  // Hàm tạo danh sách đầy đủ các nhãn thời gian (ngày, tuần, tháng, năm) giữa startDate và endDate
  const generateTimeLabels = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const labels = [];

    if (groupBy === "month") {
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      let current = new Date(start);
      while (current <= end) {
        const year = current.getFullYear();
        const month = current.getMonth();
        labels.push({ label: `${year}-${String(month + 1).padStart(2, "0")}`, displayLabel: monthNames[month] });
        current.setMonth(current.getMonth() + 1);
      }
    } else if (groupBy === "year") {
      let current = start.getFullYear();
      while (current <= end.getFullYear()) {
        labels.push({ label: `${current}`, displayLabel: `${current}` });
        current++;
      }
    } else if (groupBy === "week") {
      let current = new Date(start);
      while (current <= end) {
        const year = current.getFullYear();
        const week = getWeekNumber(current);
        labels.push({ label: `${year}-${week}`, displayLabel: `Week ${week} ${year}` });
        current.setDate(current.getDate() + 7);
      }
    } else if (groupBy === "day") {
      let current = new Date(start);
      while (current <= end) {
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, "0");
        const day = String(current.getDate()).padStart(2, "0");
        labels.push({ label: `${year}-${month}-${day}`, displayLabel: `${year}-${month}-${day}` });
        current.setDate(current.getDate() + 1);
      }
    }

    return labels;
  };

  // Hàm tính số tuần trong năm (theo chuẩn ISO)
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  // Xử lý dữ liệu cho biểu đồ đường (Doanh thu theo thời gian)
  const timeLabels = generateTimeLabels();
  const timeData = timeLabels.map((time) => {
    const found = timeRevenueData.find((item) => item.label === time.label);
    return found ? found.value : 0;
  });

  const timeChartData = {
    labels: timeLabels.map((time) => time.displayLabel),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: timeData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const timeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw.toLocaleString()} VNĐ`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value.toLocaleString()} VNĐ`,
        },
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  };

  // Dữ liệu cho biểu đồ Polar Area (Doanh thu theo thương hiệu)
  const brandChartData = {
    labels: brandRevenueData.map((item) => item.label),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: brandRevenueData.map((item) => item.value),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const polarAreaChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw.toLocaleString()} VNĐ`,
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value.toLocaleString()} VNĐ`,
        },
      },
    },
  };

  // Dữ liệu cho biểu đồ tròn (Doanh thu theo phương thức thanh toán)
  const paymentMethodChartData = {
    labels: paymentMethodRevenueData.map((item) => item.label),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: paymentMethodRevenueData.map((item) => item.value),
        backgroundColor: [
          "rgba(255, 159, 64, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ],
        borderColor: [
          "rgba(255, 159, 64, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw.toLocaleString()} VNĐ`,
        },
      },
    },
  };

  // Dữ liệu cho biểu đồ cột (Tổng số tiền giao dịch với nhà cung cấp)
  const supplierTransactionChartData = {
    labels: supplierTransactionData.map((item) => item.supplierName),
    datasets: [
      {
        label: "Tổng số tiền (VNĐ)",
        data: supplierTransactionData.map((item) => item.totalTransactionAmount),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // Màu đỏ
          "rgba(54, 162, 235, 0.6)", // Màu xanh dương
          "rgba(255, 206, 86, 0.6)", // Màu vàng
          "rgba(75, 192, 192, 0.6)", // Màu xanh lam
          "rgba(153, 102, 255, 0.6)", // Màu tím
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const supplierTransactionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw.toLocaleString()} VNĐ`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value.toLocaleString()} VNĐ`,
        },
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  };

  return (
    <Box p={{ base: 4, md: 6 }} mx="auto" w="100%">
      <VStack spacing={6} align="stretch">
        {/* Bộ lọc */}
        <HStack spacing={4} flexWrap="wrap">
          <Box>
            <Text mb={2}>Từ ngày:</Text>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Box>
          <Box>
            <Text mb={2}>Đến ngày:</Text>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Box>
          <Box>
            <Text mb={2}>Nhóm theo:</Text>
            <Select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
              <option value="day">Ngày</option>
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </Select>
          </Box>
        </HStack>

        {/* Tabs chứa các biểu đồ */}
        <Tabs variant="enclosed">
          <TabList>
            <Tab>Doanh thu theo thời gian</Tab>
            <Tab>Doanh thu theo thương hiệu</Tab>
            <Tab>Doanh thu theo phương thức thanh toán</Tab>
            <Tab>Giao dịch với nhà cung cấp</Tab>
          </TabList>

          <TabPanels>
            {/* Tab 1: Biểu đồ đường - Doanh thu theo thời gian */}
            <TabPanel>
              <Box
                p={4}
                bg={chartBg}
                borderWidth="1px"
                borderColor={chartBorder}
                borderRadius="md"
                boxShadow="sm"
                w="100%"
              >
                <Text fontSize="xl" fontWeight="bold" mb={4}>
                  Doanh thu theo thời gian
                </Text>
                {loading ? (
                  <Spinner size="lg" />
                ) : timeLabels.length > 0 ? (
                  <Box
                    height={{ base: "400px", md: "600px" }}
                    w={{ base: "100%", md: "85%" }}
                    minW="300px"
                    mx="auto"
                  >
                    <Line data={timeChartData} options={timeChartOptions} />
                  </Box>
                ) : (
                  <Text>Không có dữ liệu để hiển thị.</Text>
                )}
              </Box>
            </TabPanel>

            {/* Tab 2: Biểu đồ Polar Area - Doanh thu theo thương hiệu */}
            <TabPanel>
              <Box
                p={4}
                bg={chartBg}
                borderWidth="1px"
                borderColor={chartBorder}
                borderRadius="md"
                boxShadow="sm"
                w="100%"
              >
                <Text fontSize="xl" fontWeight="bold" mb={4}>
                  Doanh thu theo thương hiệu
                </Text>
                {loading ? (
                  <Spinner size="lg" />
                ) : brandRevenueData.length > 0 ? (
                  <Box
                    height={{ base: "400px", md: "600px" }}
                    w={{ base: "100%", md: "85%" }}
                    maxW={{ base: "300px", md: "500px" }}
                    minW="300px"
                    mx="auto"
                  >
                    <PolarArea data={brandChartData} options={polarAreaChartOptions} />
                  </Box>
                ) : (
                  <Text>Không có dữ liệu để hiển thị.</Text>
                )}
              </Box>
            </TabPanel>

            {/* Tab 3: Biểu đồ tròn - Doanh thu theo phương thức thanh toán */}
            <TabPanel>
              <Box
                p={4}
                bg={chartBg}
                borderWidth="1px"
                borderColor={chartBorder}
                borderRadius="md"
                boxShadow="sm"
                w="100%"
              >
                <Text fontSize="xl" fontWeight="bold" mb={4}>
                  Doanh thu theo phương thức thanh toán
                </Text>
                {loading ? (
                  <Spinner size="lg" />
                ) : paymentMethodRevenueData.length > 0 ? (
                  <Box
                    height={{ base: "400px", md: "600px" }}
                    w={{ base: "100%", md: "85%" }}
                    maxW={{ base: "300px", md: "500px" }}
                    minW="300px"
                    mx="auto"
                  >
                    <Pie data={paymentMethodChartData} options={pieChartOptions} />
                  </Box>
                ) : (
                  <Text>Không có dữ liệu để hiển thị.</Text>
                )}
              </Box>
            </TabPanel>

            {/* Tab 4: Biểu đồ cột - Tổng số tiền giao dịch với nhà cung cấp */}
            <TabPanel>
              <Box
                p={4}
                bg={chartBg}
                borderWidth="1px"
                borderColor={chartBorder}
                borderRadius="md"
                boxShadow="sm"
                w="100%"
              >
                <Text fontSize="xl" fontWeight="bold" mb={4}>
                  Tổng số tiền giao dịch với nhà cung cấp
                </Text>
                {loading ? (
                  <Spinner size="lg" />
                ) : supplierTransactionData.length > 0 ? (
                  <Box
                    height={{ base: "400px", md: "600px" }}
                    w={{ base: "100%", md: "85%" }}
                    minW="300px"
                    mx="auto"
                  >
                    <Bar data={supplierTransactionChartData} options={supplierTransactionChartOptions} />
                  </Box>
                ) : (
                  <Text>Không có dữ liệu để hiển thị.</Text>
                )}
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default Statistics;