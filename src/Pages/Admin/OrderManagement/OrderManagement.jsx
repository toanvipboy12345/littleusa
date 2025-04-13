/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../../Api/axiosInstance";
import {
  Box,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogFooter,
  Button,
  Input,
  Stack,
  Flex,
  Grid,
  GridItem,
  Text,
  Select,
  InputGroup,
  InputLeftElement,
  HStack,
} from "@chakra-ui/react";
import { Search, ChevronLeft, ChevronRight, Eye, Check } from "react-feather";
import { useDisclosure } from "@chakra-ui/react";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const toast = useToast();

  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/api/orders");
      if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
        setAllOrders(response.data);
      } else {
        setOrders([]);
        setAllOrders([]);
        toast({
          title: "Cảnh báo",
          description: "Dữ liệu trả về không hợp lệ.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
      setCurrentPage(1);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      setOrders([]);
      setAllOrders([]);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách đơn hàng. Vui lòng kiểm tra kết nối hoặc thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.trim().toLowerCase();
    setSearchTerm(value);

    if (value === "") {
      setOrders(allOrders);
    } else {
      const filteredOrders = allOrders.filter((order) =>
        order.orderId.toLowerCase().includes(value)
      );
      setOrders(filteredOrders);
      if (filteredOrders.length === 0) {
        toast({
          title: "Cảnh báo",
          description: "Không tìm thấy đơn hàng với mã này.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    }
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Hàm chuyển đổi trạng thái đơn hàng sang tiếng Việt
  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ xử lý";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "SHIPPED":
        return "Đã được gửi đi";
      case "DELIVERED":
        return "Đã giao thành công";
      case "CANCELLED":
        return "Đơn hàng bị hủy";
      default:
        return status;
    }
  };

  // Hàm chuyển đổi trạng thái thanh toán sang tiếng Việt
  const getPaymentStatusText = (paymentStatus) => {
    switch (paymentStatus) {
      case "PENDING":
        return "Đang chờ thanh toán";
      case "SUCCESS":
        return "Thanh toán thành công";
      case "FAILED":
        return "Thanh toán thất bại";
      default:
        return paymentStatus || "N/A";
    }
  };

  const handleUpdateStatus = async (orderId) => {
    const newStatus = statusUpdates[orderId];
    if (!["SHIPPED", "DELIVERED"].includes(newStatus)) {
      toast({
        title: "Lỗi",
        description: "Admin chỉ được cập nhật trạng thái thành SHIPPED hoặc DELIVERED.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    try {
      const response = await axiosInstance.put(`/api/orders/${orderId}/status`, {
        status: newStatus,
      });
      const updatedOrder = { ...orders.find((order) => order.orderId === orderId), status: response.data.status };
      setOrders(
        orders.map((order) =>
          order.orderId === orderId ? updatedOrder : order
        )
      );
      setAllOrders(
        allOrders.map((order) =>
          order.orderId === orderId ? updatedOrder : order
        )
      );
      setStatusUpdates((prev) => {
        const updated = { ...prev };
        delete updated[orderId];
        return updated;
      });
      toast({
        title: "Thành công",
        description: "Đã cập nhật trạng thái đơn hàng.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.customMessage || error.response?.data?.message || "Không thể cập nhật trạng thái đơn hàng.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleDetailOpen = (order) => {
    setSelectedOrder(order);
    onDetailOpen();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Box
      p={{ base: 1, md: 4 }}
      mx="auto"
      maxW={{ base: "100%", md: "100%" }}
      w="100%"
      overflowX="hidden"
    >
      <Stack spacing={{ base: 2, md: 4 }} mb={{ base: 2, md: 4 }}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "stretch", md: "center" }}
          justify="space-between"
          gap={{ base: 2, md: 4 }}
          w="100%"
        >
          <InputGroup flex={{ base: "1", md: "0 1 50%" }}>
            <InputLeftElement pointerEvents="none">
              <Search size={20} color="gray.500" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm đơn hàng theo mã..."
              value={searchTerm}
              onChange={handleSearch}
              variant="outline"
              borderColor="gray.300"
              _hover={{ borderColor: "gray.500" }}
              _focus={{
                borderColor: "gray.500",
                boxShadow: "0 0 0 1px gray.500",
              }}
              color="black"
              size={{ base: "sm", md: "md" }}
              _dark={{
                color: "white",
                _placeholder: { color: "white" },
              }}
            />
          </InputGroup>
          <HStack
            spacing={2}
            flexShrink={0}
            justify={{ base: "center", md: "flex-end" }}
          >
            <Text
              fontSize={{ base: "sm", md: "md" }}
              whiteSpace="nowrap"
              color="gray.600"
              _dark={{ color: "gray.300" }}
            >
              Hiển thị:
            </Text>
            <Select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              size={{ base: "sm", md: "md" }}
              w={{ base: "100px", md: "120px" }}
              borderColor="gray.300"
              color="gray.600"
              _dark={{
                borderColor: "gray.600",
                color: "white",
                bg: "gray.700",
              }}
              sx={{
                option: {
                  bg: "white",
                  color: "gray.600",
                  _dark: {
                    bg: "gray.700",
                    color: "white",
                  },
                },
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </Select>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              whiteSpace="nowrap"
              color="gray.600"
              _dark={{ color: "gray.300" }}
            >
              đơn hàng/trang
            </Text>
          </HStack>
        </Flex>
      </Stack>

      <Box
        overflowX={{ base: "auto", md: "visible" }}
        display={{ base: "block", md: "block" }}
        w="100%"
      >
        <Table
          variant="simple"
          size={{ base: "sm", md: "md" }}
          display={{ base: "none", md: "table" }}
          w="100%"
        >
          <Thead>
            <Tr>
              <Th>Mã đơn hàng</Th>
              <Th>Tên khách hàng</Th>
              <Th>Số điện thoại</Th>
              <Th>Tổng tiền</Th>
              <Th>Ngày tạo</Th>
              <Th>Ngày cập nhật</Th>
              <Th>Trạng thái</Th>
              <Th>Thao tác</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedOrders.map((order) => (
              <Tr key={order.orderId}>
                <Td>{order.orderId}</Td>
                <Td>{order.customerName || "N/A"}</Td>
                <Td>{order.phoneNumber || "N/A"}</Td>
                <Td>{order.totalAmount.toLocaleString()} VNĐ</Td>
                <Td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</Td>
                <Td>{order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "N/A"}</Td>
                <Td>
                  <Select
                    value={statusUpdates[order.orderId] || order.status}
                    onChange={(e) =>
                      setStatusUpdates((prev) => ({
                        ...prev,
                        [order.orderId]: e.target.value,
                      }))
                    }
                    size="sm"
                    w="200px"
                  >
                    <option value="PENDING">Đang chờ xử lý</option>
                    <option value="CONFIRMED">Đã xác nhận</option>
                    <option value="SHIPPED">Đã được gửi đi</option>
                    <option value="DELIVERED">Đã giao thành công</option>
                    <option value="CANCELLED" disabled>
                      Đơn hàng bị hủy
                    </option>
                  </Select>
                </Td>
                <Td>
                  <Flex gap={2}>
                    <IconButton
                      icon={<Check size={18} />}
                      aria-label="Cập nhật trạng thái"
                      onClick={() => handleUpdateStatus(order.orderId)}
                      variant="outline"
                      size={{ base: "xs", md: "sm" }}
                      isDisabled={!statusUpdates[order.orderId] || statusUpdates[order.orderId] === order.status}
                    />
                    <IconButton
                      icon={<Eye size={18} />}
                      aria-label="Xem chi tiết đơn hàng"
                      onClick={() => handleDetailOpen(order)}
                      variant="outline"
                      size={{ base: "xs", md: "sm" }}
                    />
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Box display={{ base: "block", md: "none" }} w="100%">
          {paginatedOrders.map((order) => (
            <Box
              key={order.orderId}
              p={3}
              mb={3}
              borderWidth="1px"
              borderRadius="md"
              bg="white"
              _dark={{ bg: "gray.800" }}
            >
              <Grid templateColumns="1fr" gap={2}>
                <GridItem>
                  <Text fontWeight="bold">Mã đơn hàng:</Text>
                  <Text fontSize="sm">{order.orderId}</Text>
                </GridItem>
                <GridItem>
                  <Text fontWeight="bold">Tên:</Text>
                  <Text fontSize="sm">{order.customerName || "N/A"}</Text>
                </GridItem>
                <GridItem>
                  <Text fontWeight="bold">SĐT:</Text>
                  <Text fontSize="sm">{order.phoneNumber || "N/A"}</Text>
                </GridItem>
                <GridItem>
                  <Text fontWeight="bold">Tổng tiền:</Text>
                  <Text fontSize="sm">{order.totalAmount.toLocaleString()} VNĐ</Text>
                </GridItem>
                <GridItem>
                  <Text fontWeight="bold">Ngày tạo:</Text>
                  <Text fontSize="sm">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
                  </Text>
                </GridItem>
                <GridItem>
                  <Text fontWeight="bold">Ngày cập nhật:</Text>
                  <Text fontSize="sm">
                    {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "N/A"}
                  </Text>
                </GridItem>
                <GridItem>
                  <Text fontWeight="bold">Trạng thái:</Text>
                  <Select
                    value={statusUpdates[order.orderId] || order.status}
                    onChange={(e) =>
                      setStatusUpdates((prev) => ({
                        ...prev,
                        [order.orderId]: e.target.value,
                      }))
                    }
                    size="sm"
                    w="200px"
                  >
                    <option value="PENDING">Đang chờ xử lý</option>
                    <option value="CONFIRMED">Đã xác nhận</option>
                    <option value="SHIPPED">Đã được gửi đi</option>
                    <option value="DELIVERED">Đã giao thành công</option>
                    <option value="CANCELLED" disabled>
                      Đơn hàng bị hủy
                    </option>
                  </Select>
                </GridItem>
                <GridItem>
                  <Flex gap={2} justify="flex-end">
                    <IconButton
                      icon={<Check size={16} />}
                      aria-label="Cập nhật trạng thái"
                      onClick={() => handleUpdateStatus(order.orderId)}
                      variant="outline"
                      isDisabled={!statusUpdates[order.orderId] || statusUpdates[order.orderId] === order.status}
                    />
                    <IconButton
                      icon={<Eye size={16} />}
                      aria-label="Xem chi tiết đơn hàng"
                      onClick={() => handleDetailOpen(order)}
                      variant="outline"
                    />
                  </Flex>
                </GridItem>
              </Grid>
            </Box>
          ))}
        </Box>
      </Box>

      <Flex
        direction={{ base: "column", md: "row" }}
        justify={{ base: "center", md: "space-between" }}
        align="center"
        mt={{ base: 3, md: 4 }}
        gap={{ base: 2, md: 0 }}
        w="100%"
      >
        <Flex gap={{ base: 1, md: 2 }}>
          <IconButton
            icon={<ChevronLeft size={20} />}
            onClick={handlePrevPage}
            isDisabled={currentPage === 1}
            aria-label="Trang trước"
            variant="outline"
            size={{ base: "xs", md: "sm" }}
          />
          <Text fontSize={{ base: "sm", md: "md" }}>
            Trang {currentPage} / {totalPages}
          </Text>
          <IconButton
            icon={<ChevronRight size={20} />}
            onClick={handleNextPage}
            isDisabled={currentPage === totalPages}
            aria-label="Trang sau"
            variant="outline"
            size={{ base: "xs", md: "sm" }}
          />
        </Flex>
        <Text fontSize={{ base: "sm", md: "md" }}>
          Tổng: {orders.length} đơn hàng
        </Text>
      </Flex>

      {/* Dialog chi tiết đơn hàng */}
      <AlertDialog
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        leastDestructiveRef={undefined}
        size={{ base: "full", md: "xl", lg: "2xl" }}
      >
        <AlertDialogOverlay
          bg="rgba(0, 0, 0, 0.6)"
          backdropFilter="blur(5px)"
        >
          <AlertDialogContent
            bg="white"
            _dark={{ bg: "gray.800" }}
            p={{ base: 2, md: 4 }}
            maxW={{ base: "100%", md: "70%", lg: "700px" }}
            w="100%"
          >
            <AlertDialogHeader fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
              Chi tiết đơn hàng
            </AlertDialogHeader>
            <AlertDialogBody>
              {selectedOrder && (
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={{ base: 2, md: 4 }}
                >
                  <GridItem colSpan={{ base: 1, md: 2 }}>
                    <Text fontWeight="bold" mb={1}>
                      Địa chỉ giao hàng:
                    </Text>
                    <Input
                      value={`${selectedOrder.shippingAddress.street}, ${selectedOrder.shippingAddress.ward}, ${selectedOrder.shippingAddress.district}, ${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.country}`}
                      isReadOnly
                      size={{ base: "sm", md: "md" }}
                      fontSize={{ base: "sm", md: "md" }}
                    />
                  </GridItem>
                  <GridItem>
                    <Text fontWeight="bold" mb={1}>
                      Email:
                    </Text>
                    <Input
                      value={selectedOrder.email || "N/A"}
                      isReadOnly
                      size={{ base: "sm", md: "md" }}
                      fontSize={{ base: "sm", md: "md" }}
                    />
                  </GridItem>
                  <GridItem>
                    <Text fontWeight="bold" mb={1}>
                      Phí vận chuyển:
                    </Text>
                    <Input
                      value={`${selectedOrder.shippingFee.toLocaleString()} VNĐ`}
                      isReadOnly
                      size={{ base: "sm", md: "md" }}
                      fontSize={{ base: "sm", md: "md" }}
                    />
                  </GridItem>
                  <GridItem>
                    <Text fontWeight="bold" mb={1}>
                      Phương thức thanh toán:
                    </Text>
                    <Input
                      value={selectedOrder.paymentMethod || "N/A"}
                      isReadOnly
                      size={{ base: "sm", md: "md" }}
                      fontSize={{ base: "sm", md: "md" }}
                    />
                  </GridItem>
                  <GridItem>
                    <Text fontWeight="bold" mb={1}>
                      Trạng thái thanh toán:
                    </Text>
                    <Input
                      value={getPaymentStatusText(selectedOrder.paymentStatus)}
                      isReadOnly
                      size={{ base: "sm", md: "md" }}
                      fontSize={{ base: "sm", md: "md" }}
                    />
                  </GridItem>
                  <GridItem>
                    <Text fontWeight="bold" mb={1}>
                      Mã giao dịch:
                    </Text>
                    <Input
                      value={selectedOrder.transactionId || "N/A"}
                      isReadOnly
                      size={{ base: "sm", md: "md" }}
                      fontSize={{ base: "sm", md: "md" }}
                    />
                  </GridItem>
                  <GridItem colSpan={{ base: 1, md: 2 }}>
                    <Text fontWeight="bold" mb={1}>
                      Danh sách sản phẩm:
                    </Text>
                    <Table variant="simple" size={{ base: "sm", md: "md" }}>
                      <Thead>
                        <Tr>
                          <Th>Tên sản phẩm</Th>
                          <Th>Màu sắc</Th>
                          <Th>Kích thước</Th>
                          <Th>Số lượng</Th>
                          <Th>Giá</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {selectedOrder.items.map((item, index) => (
                          <Tr key={index}>
                            <Td fontSize={{ base: "xs", md: "sm" }}>
                              {item.productName}
                            </Td>
                            <Td fontSize={{ base: "xs", md: "sm" }}>{item.variantColor}</Td>
                            <Td fontSize={{ base: "xs", md: "sm" }}>{item.size}</Td>
                            <Td fontSize={{ base: "xs", md: "sm" }}>{item.quantity}</Td>
                            <Td fontSize={{ base: "xs", md: "sm" }}>
                              {item.price.toLocaleString()} VNĐ
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </GridItem>
                </Grid>
              )}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                onClick={onDetailClose}
                variant="solid"
                size={{ base: "sm", md: "md" }}
                mt={{ base: 2, md: 0 }}
              >
                Đóng
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default OrderManagement;