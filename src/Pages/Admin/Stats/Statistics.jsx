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
  Flex,
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
  const [topProductsData, setTopProductsData] = useState([]);
  const [topVariantsData, setTopVariantsData] = useState([]);

  // Bộ lọc
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Ví dụ: "2025-04-12"
  });
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

  const fetchTopProductsData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/statistics/top-products`, {
        params: {
          startDate,
          endDate,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching top products data:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchTopVariantsData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/statistics/top-variants`, {
        params: {
          startDate,
          endDate,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching top variants data:", error);
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
      const topProducts = await fetchTopProductsData();
      const topVariants = await fetchTopVariantsData();

      setTimeRevenueData(timeData);
      setBrandRevenueData(brandData);
      setPaymentMethodRevenueData(paymentMethodData);
      setSupplierTransactionData(supplierTransactionData);
      setTopProductsData(topProducts);
      setTopVariantsData(topVariants);
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

  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  // Biểu đồ đường (Doanh thu theo thời gian)
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

  // Biểu đồ Polar Area (Doanh thu theo thương hiệu)
  const brandChartData = {
    labels: brandRevenueData.map((item) => item.label),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: brandRevenueData.map((item) => item.value),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",  // Đỏ
          "rgba(54, 162, 235, 0.6)",  // Xanh dương
          "rgba(255, 206, 86, 0.6)",  // Vàng
          "rgba(75, 192, 192, 0.6)",  // Xanh lam
          "rgba(153, 102, 255, 0.6)", // Tím
          "rgba(255, 159, 64, 0.6)",  // Cam
          "rgba(201, 203, 207, 0.6)", // Xám
          "rgba(255, 99, 132, 0.6)",  // Lặp lại màu đỏ
          "rgba(54, 162, 235, 0.6)",  // Lặp lại màu xanh dương
          "rgba(255, 206, 86, 0.6)",  // Lặp lại màu vàng
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(201, 203, 207, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const brandChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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

  // Biểu đồ tròn (Doanh thu theo phương thức thanh toán)
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

  const paymentMethodChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw.toLocaleString()} VNĐ`,
        },
      },
    },
  };

  // Biểu đồ cột (Tổng số tiền giao dịch với nhà cung cấp)
  const supplierTransactionChartData = {
    labels: supplierTransactionData.map((item) => item.supplierName),
    datasets: [
      {
        label: "",
        data: supplierTransactionData.map((item) => item.totalTransactionAmount),
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

  const supplierTransactionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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

  // Biểu đồ Polar Area (Top 10 sản phẩm có doanh thu cao nhất)
  const topProductsChartData = {
    labels: topProductsData.map((item) => item.name),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: topProductsData.map((item) => item.revenue),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
          "rgba(201, 203, 207, 0.5)",
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
          "rgba(201, 203, 207, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const topProductsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const quantitySold = topProductsData[index]?.quantitySold || 0;
            return `${context.label}: ${context.raw.toLocaleString()} VNĐ (Bán: ${quantitySold})`;
          },
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

  // Biểu đồ Pie (Top 10 biến thể sản phẩm có doanh thu cao nhất)
  const topVariantsChartData = {
    labels: topVariantsData.map((item) => item.name),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: topVariantsData.map((item) => item.revenue),
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(201, 203, 207, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(201, 203, 207, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const topVariantsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const quantitySold = topVariantsData[index]?.quantitySold || 0;
            return `${context.label}: ${context.raw.toLocaleString()} VNĐ (Bán: ${quantitySold})`;
          },
        },
      },
    },
  };

  // Hàm render chú thích (Legend) cho các biểu đồ Pie và Polar Area
  const renderLegend = (labels, data, colors, items) => {
    return (
      <VStack align="start" spacing={2} w="100%">
        {labels.map((label, index) => {
          const quantitySold = items && items[index]?.quantitySold ? items[index].quantitySold : null;
          return (
            <HStack key={index} spacing={2}>
              <Box w="12px" h="12px" bg={colors[index]} borderRadius="3px" />
              <Text fontSize="sm">
                {label}: {data[index]?.toLocaleString()} VNĐ
                {quantitySold !== null ? ` (Bán: ${quantitySold})` : ""}
              </Text>
            </HStack>
          );
        })}
      </VStack>
    );
  };

  // Chiều cao cố định cho container của mỗi tab
  const tabContainerHeight = "650px";

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
          <TabList
            flexWrap="wrap"
            gap={2}
          >
            <Tab
              flexShrink={0}
              minW={{ base: "150px", md: "auto" }}
              fontSize={{ base: "sm", md: "md" }}
              whiteSpace="normal"
              py={2}
              px={4}
            >
              Doanh thu theo thời gian
            </Tab>
            <Tab
              flexShrink={0}
              minW={{ base: "150px", md: "auto" }}
              fontSize={{ base: "sm", md: "md" }}
              whiteSpace="normal"
              py={2}
              px={4}
            >
              Doanh thu theo thương hiệu
            </Tab>
            <Tab
              flexShrink={0}
              minW={{ base: "150px", md: "auto" }}
              fontSize={{ base: "sm", md: "md" }}
              whiteSpace="normal"
              py={2}
              px={4}
            >
              Doanh thu theo phương thức thanh toán
            </Tab>
            <Tab
              flexShrink={0}
              minW={{ base: "150px", md: "auto" }}
              fontSize={{ base: "sm", md: "md" }}
              whiteSpace="normal"
              py={2}
              px={4}
            >
              Giao dịch với nhà cung cấp
            </Tab>
            <Tab
              flexShrink={0}
              minW={{ base: "150px", md: "auto" }}
              fontSize={{ base: "sm", md: "md" }}
              whiteSpace="normal"
              py={2}
              px={4}
            >
              Top 10 sản phẩm
            </Tab>
            <Tab
              flexShrink={0}
              minW={{ base: "150px", md: "auto" }}
              fontSize={{ base: "sm", md: "md" }}
              whiteSpace="normal"
              py={2}
              px={4}
            >
              Top 10 biến thể
            </Tab>
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
                h={tabContainerHeight}
                maxH="80vh"
                overflowY="auto"
              >
                {loading ? (
                  <Spinner size="lg" />
                ) : timeLabels.length > 0 ? (
                  <Box
                    height={{ base: "400px", md: "600px" }}
                    w={{ base: "100%", md: "95%" }}
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
                h={tabContainerHeight}
                maxH="80vh"
                overflowY="auto"
              >
                {loading ? (
                  <Spinner size="lg" />
                ) : brandRevenueData.length > 0 ? (
                  <HStack
                    spacing={4}
                    align="center"
                    justify="space-between"
                    flexWrap={{ base: "wrap", md: "nowrap" }}
                  >
                    <Box
                      height={{ base: "400px", md: "500px" }}
                      w={{ base: "100%", md: "50%" }}
                      maxW={{ base: "300px", md: "500px" }}
                      minW="300px"
                    >
                      <PolarArea data={brandChartData} options={brandChartOptions} />
                    </Box>
                    <Box
                      w={{ base: "100%", md: "40%" }}
                      maxH={{ base: "auto", md: "500px" }}
                      overflowY="auto"
                      p={2}
                    >
                      {renderLegend(
                        brandChartData.labels,
                        brandChartData.datasets[0].data,
                        brandChartData.datasets[0].backgroundColor
                      )}
                    </Box>
                  </HStack>
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
                h={tabContainerHeight}
                maxH="80vh"
                overflowY="auto"
              >
                {loading ? (
                  <Spinner size="lg" />
                ) : paymentMethodRevenueData.length > 0 ? (
                  <HStack
                    spacing={4}
                    align="center"
                    justify="space-around"
                    flexWrap={{ base: "wrap", md: "nowrap" }}
                  >
                    <Box
                      height={{ base: "400px", md: "500px" }}
                      w={{ base: "100%", md: "50%" }}
                      maxW={{ base: "300px", md: "500px" }}
                      minW="300px"
                    >
                      <Pie data={paymentMethodChartData} options={paymentMethodChartOptions} />
                    </Box>
                    <Box
                      w={{ base: "100%", md: "40%" }}
                      maxH={{ base: "auto", md: "500px" }}
                      overflowY="auto"
                      p={2}
                    >
                      {renderLegend(
                        paymentMethodChartData.labels,
                        paymentMethodChartData.datasets[0].data,
                        paymentMethodChartData.datasets[0].backgroundColor
                      )}
                    </Box>
                  </HStack>
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
                h={tabContainerHeight}
                maxH="80vh"
                overflowY="auto"
              >
                {loading ? (
                  <Spinner size="lg" />
                ) : supplierTransactionData.length > 0 ? (
                  <Box
                    height={{ base: "400px", md: "600px" }}
                    w={{ base: "100%", md: "95%" }}
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

            {/* Tab 5: Biểu đồ Polar Area - Top 10 sản phẩm có doanh thu cao nhất */}
            <TabPanel>
              <Box
                p={4}
                bg={chartBg}
                borderWidth="1px"
                borderColor={chartBorder}
                borderRadius="md"
                boxShadow="sm"
                w="100%"
                h={tabContainerHeight}
                maxH="80vh"
                overflowY="auto"
              >
                {loading ? (
                  <Spinner size="lg" />
                ) : topProductsData.length > 0 ? (
                  <HStack
                    spacing={4}
                    align="center"
                    justify="space-around"
                    flexWrap={{ base: "wrap", md: "nowrap" }}
                  >
                    <Box
                      height={{ base: "400px", md: "500px" }}
                      w={{ base: "100%", md: "50%" }}
                      maxW={{ base: "300px", md: "500px" }}
                      minW="300px"
                    >
                      <PolarArea data={topProductsChartData} options={topProductsChartOptions} />
                    </Box>
                    <Box
                      w={{ base: "100%", md: "40%" }}
                      maxH={{ base: "auto", md: "500px" }}
                      overflowY="auto"
                      p={2}
                    >
                      {renderLegend(
                        topProductsChartData.labels,
                        topProductsChartData.datasets[0].data,
                        topProductsChartData.datasets[0].backgroundColor,
                        topProductsData
                      )}
                    </Box>
                  </HStack>
                ) : (
                  <Text>Không có dữ liệu để hiển thị.</Text>
                )}
              </Box>
            </TabPanel>

            {/* Tab 6: Biểu đồ Pie - Top 10 biến thể sản phẩm có doanh thu cao nhất */}
            <TabPanel>
              <Box
                p={4}
                bg={chartBg}
                borderWidth="1px"
                borderColor={chartBorder}
                borderRadius="md"
                boxShadow="sm"
                w="100%"
                h={tabContainerHeight}
                maxH="80vh"
                overflowY="auto"
              >
                {loading ? (
                  <Spinner size="lg" />
                ) : topVariantsData.length > 0 ? (
                  <HStack
                    spacing={4}
                    align="center"
                    justify="space-around"
                    flexWrap={{ base: "wrap", md: "nowrap" }}
                  >
                    <Box
                      height={{ base: "400px", md: "500px" }}
                      w={{ base: "100%", md: "50%" }}
                      maxW={{ base: "300px", md: "500px" }}
                      minW="300px"
                    >
                      <Pie data={topVariantsChartData} options={topVariantsChartOptions} />
                    </Box>
                    <Box
                      w={{ base: "100%", md: "40%" }}
                      maxH={{ base: "auto", md: "500px" }}
                      overflowY="auto"
                      p={2}
                    >
                      {renderLegend(
                        topVariantsChartData.labels,
                        topVariantsChartData.datasets[0].data,
                        topVariantsChartData.datasets[0].backgroundColor,
                        topVariantsData
                      )}
                    </Box>
                  </HStack>
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