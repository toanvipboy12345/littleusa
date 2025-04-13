/* eslint-disable no-unused-vars */
import axiosInstance from "../../../../../Api/axiosInstance";
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Button,
  useToast,
  VStack,
  HStack,
  Image,
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogFooter,
  Grid,
  Input,
  FormControl,
  FormLabel,
  Spinner,
} from "@chakra-ui/react";
import { useCart } from "../../../../../context/CartContext";
import { UserContext } from "../../../../../context/UserContext";
import { Clock, CheckCircle, Truck, Package } from "react-feather";

const Order = () => {
  const { cartToken } = useCart();
  const { user } = React.useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const toast = useToast();
  const cancelRef = useRef();

  const steps = [
    { title: "Đang chờ", status: "PENDING", icon: <Clock size={16} /> },
    { title: "Đã xác nhận", status: "CONFIRMED", icon: <CheckCircle size={16} /> },
    { title: "Đang giao", status: "SHIPPED", icon: <Truck size={16} /> },
    { title: "Đã giao", status: "DELIVERED", icon: <Package size={16} /> },
  ];

  const mapStatusToVietnamese = (status) => {
    const statusMap = {
      PENDING: "Đang chờ",
      CONFIRMED: "Xác nhận",
      SHIPPED: "Đang vận chuyển",
      DELIVERED: "Đã giao",
      CANCELLED: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/orders/user/${user.id}`);
      const sortedOrders = (response?.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // Sắp xếp giảm dần (mới nhất trước)
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách đơn hàng.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersByPhone = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số điện thoại để tra cứu.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/orders/phone/${phoneNumber}`);
      const sortedOrders = (response.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
      if (response.data.length === 0) {
        toast({
          title: "Thông báo",
          description: "Không tìm thấy đơn hàng nào với số điện thoại này.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error fetching orders by phone:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tra cứu đơn hàng. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await axiosInstance.put(`/api/orders/${orderId}/status`, { status: "CANCELLED" });
      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId ? { ...order, status: "CANCELLED" } : order
        )
      );
      toast({
        title: "Thành công",
        description: "Đơn hàng đã được hủy.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể hủy đơn hàng.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const openCancelDialog = (orderId) => {
    setSelectedOrderId(orderId);
    setIsCancelOpen(true);
  };

  const closeCancelDialog = () => {
    setIsCancelOpen(false);
    setSelectedOrderId(null);
  };

  const confirmCancelOrder = () => {
    if (selectedOrderId) cancelOrder(selectedOrderId);
    closeCancelDialog();
  };

  const getActiveStep = (status) => {
    const stepIndex = steps.findIndex((step) => step.status === status);
    return stepIndex >= 0 ? stepIndex : 0;
  };

  const isStepComplete = (stepIndex, currentStatus) => {
    const currentIndex = steps.findIndex((step) => step.status === currentStatus);
    return currentIndex > stepIndex;
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const baseURL = "http://localhost:8080";

  return (
    <Box px={{ base: 4, md: 6 }} py={{ base: 6, md: 10 }} maxW="1200px" mx="auto">
      {!user ? (
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Tra cứu đơn hàng
          </Text>
          <FormControl mb={4}>
            <FormLabel>Nhập số điện thoại</FormLabel>
            <Flex gap={2}>
              <Input
                placeholder="Ví dụ: 0123456789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength={15}
              />
              <Button onClick={fetchOrdersByPhone} isLoading={loading}>
                Tra cứu
              </Button>
            </Flex>
          </FormControl>
        </Box>
      ) : null}

      {loading ? (
        <Box py={{ base: 4, md: 8, lg: 20 }} px={{ base: 2, md: 4, lg: 8 }} mx="auto" w={{ base: "95%", md: "90%", lg: "75%" }}>
          <Flex justify="center" align="center" minH="500px">
            <Spinner thickness="2px" speed="0.65s" emptyColor="gray.200" color="black" size="lg" />
          </Flex>
        </Box>
      ) : orders.length === 0 ? (
        <Text textAlign="center" color="gray.500">
          {user ? "Bạn chưa có đơn hàng nào." : "Không tìm thấy đơn hàng nào."}
        </Text>
      ) : (
        <Accordion allowMultiple>
          {orders.map((order) => (
            <AccordionItem
              key={order.orderId}
              border="1px solid"
              borderColor="gray.200"
              mb={4}
              borderRadius="md"
            >
              <AccordionButton p={{ base: 3, md: 4 }} _expanded={{ bg: "gray.100" }}>
                <VStack align="start" spacing={4} w="100%">
                  <Flex
                    justify="space-between"
                    align="center"
                    w="100%"
                    direction="row"
                  >
                    <VStack align="start" spacing={1} mr={4}>
                      <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                        Mã đơn hàng: {order.orderId}
                      </Text>
                      <Text fontSize={{ base: "sm", md: "md" }}>
                        Tổng: {order.totalAmount.toLocaleString()} VNĐ
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Ngày tạo: {new Date(order.createdAt).toLocaleDateString()}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Cập nhật: {new Date(order.updatedAt).toLocaleDateString()}
                      </Text>
                      <Text fontSize="sm" color={order.status === "DELIVERED" ? "green.600" : "orange.600"}>
                        {mapStatusToVietnamese(order.status)}
                      </Text>
                    </VStack>
                    <HStack spacing={2}>
                      {order.status !== "SHIPPED" &&
                        order.status !== "DELIVERED" &&
                        order.status !== "CANCELLED" && (
                          <Button
                            size="sm"
                            variant="solid"
                            onClick={(e) => {
                              e.stopPropagation();
                              openCancelDialog(order.orderId);
                            }}
                          >
                            Hủy
                          </Button>
                        )}
                      <AccordionIcon />
                    </HStack>
                  </Flex>
                  <Box w="100%">
                    <Grid
                      templateColumns={{ base: "1fr", md: "1fr", lg: "repeat(2, 1fr)" }}
                      gap={{ base: 3, md: 4 }}
                    >
                      {order.items.map((item) => (
                        <Flex
                          key={item.productId}
                          align="start"
                          gap={{ base: 2, md: 3 }}
                          direction="row"
                        >
                          <Image
                            src={`${baseURL}${item.mainImage}`}
                            alt={item.productName}
                            boxSize={{ base: "60px", md: "80px", lg: "100px" }}
                            objectFit="cover"
                            mr={{ base: 2, md: 3 }}
                            onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                          />
                          <VStack align="start" spacing={{ base: 0.5, md: 1 }} w="100%">
                            <Text
                              fontWeight="medium"
                              fontSize={{ base: "sm", md: "md" }}
                              textAlign="left"
                            >
                              {item.productName} - {item.color}
                            </Text>
                            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" textAlign="left">
                              Kích thước: {item.size}
                            </Text>
                            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" textAlign="left">
                              Số lượng: {item.quantity}
                            </Text>
                            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" textAlign="left">
                              Giá: {item.price.toLocaleString()} VNĐ
                            </Text>
                          </VStack>
                        </Flex>
                      ))}
                    </Grid>
                  </Box>
                </VStack>
              </AccordionButton>

              <AccordionPanel p={{ base: 3, md: 4 }} bg="gray.50" borderRadius="md">
                <VStack align="start" spacing={4}>
                  <Box w="100%">
                    {order.status !== "CANCELLED" ? (
                      <Flex align="center" justify="space-between" position="relative" w="100%">
                        {steps.map((step, index) => {
                          const isActive = index === getActiveStep(order.status);
                          const isCompleted = isStepComplete(index, order.status);
                          return (
                            <Flex
                              key={index}
                              direction="column"
                              align="center"
                              flex={1}
                              position="relative"
                              zIndex={1}
                            >
                              {/* Icon */}
                              <Box
                                p={2}
                                borderRadius="full"
                                bg={
                                  isActive || isCompleted
                                    ? "green.500"
                                    : "gray.200"
                                }
                                color={isActive || isCompleted ? "white" : "gray.600"}
                                mb={2}
                              >
                                {step.icon}
                              </Box>
                              {/* Title */}
                              <Text
                                fontSize={{ base: "xs", md: "sm" }}
                                fontWeight={isActive ? "bold" : "normal"}
                                color={isActive || isCompleted ? "green.600" : "gray.600"}
                                textAlign="center"
                              >
                                {step.title}
                              </Text>
                              {/* Line connector */}
                              {index < steps.length - 1 && (
                                <Box
                                  position="absolute"
                                  top="16px" // Điều chỉnh vị trí cho icon nhỏ hơn (16px + padding 8px)
                                  left="calc(50% + 20px)" // Điều chỉnh cho icon size={16}
                                  right="calc(-50% + 20px)"
                                  height="2px"
                                  bg={
                                    isCompleted || isStepComplete(index + 1, order.status)
                                      ? "green.500"
                                      : "gray.200"
                                  }
                                  zIndex={0}
                                />
                              )}
                            </Flex>
                          );
                        })}
                      </Flex>
                    ) : (
                      <Text color="red.500" fontSize="sm">Đơn hàng đã bị hủy</Text>
                    )}
                  </Box>
                  <Box w="100%">
                    <Text fontWeight="bold" mb={2}>Thông tin khách hàng:</Text>
                    <Flex
                      direction="row"
                      wrap="wrap"
                      gap={2}
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      <Text>Tên: {order.customerName}</Text>
                      <Text mx={2}>|</Text>
                      <Text>Email: {order.email}</Text>
                      <Text mx={2}>|</Text>
                      <Text>Số điện thoại: {order.phoneNumber}</Text>
                    </Flex>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" mb={2}>Địa chỉ giao hàng:</Text>
                    <Text fontSize={{ base: "sm", md: "md" }}>{order.shippingAddress.street}</Text>
                    <Text fontSize={{ base: "sm", md: "md" }}>
                      {order.shippingAddress.ward}, {order.shippingAddress.district}
                    </Text>
                    <Text fontSize={{ base: "sm", md: "md" }}>
                      {order.shippingAddress.city}, {order.shippingAddress.country}
                    </Text>
                  </Box>
                  <VStack
                    spacing={2}
                    align="start"
                    w="100%"
                    direction={{ base: "column", md: "row" }} // Dọc trên mobile, ngang trên tablet/desktop
                  >
                    <Flex direction="row" align="center">
                      <Text fontWeight="bold" mr={2}>Phương thức vận chuyển:</Text>
                      <Text fontSize={{ base: "sm", md: "md" }}>
                        {order.shippingMethod}
                      </Text>
                    </Flex>
                    <Flex direction="row" align="center">
                      <Text fontWeight="bold" mr={2}>Phương thức thanh toán:</Text>
                      <Text fontSize={{ base: "sm", md: "md" }}>
                        {order.paymentMethod.toUpperCase() === "COD" ? "Thanh toán khi nhận hàng" : order.paymentMethod}
                      </Text>
                    </Flex>
                    <Flex direction="row" align="center">
                      <Text fontWeight="bold" mr={2}>Mã giao dịch:</Text>
                      <Text fontSize={{ base: "sm", md: "md" }}>
                        {order.transactionId || "N/A"}
                      </Text>
                    </Flex>
                  </VStack>
                  <HStack w="100%" justify="space-between" mt={4}>
                    <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                      Tổng cộng:
                    </Text>
                    <Text fontWeight="bold" color="green.600" fontSize={{ base: "sm", md: "md" }}>
                      {order.totalAmount.toLocaleString()} VNĐ
                    </Text>
                  </HStack>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <AlertDialog isOpen={isCancelOpen} leastDestructiveRef={cancelRef} onClose={closeCancelDialog}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xác nhận hủy
            </AlertDialogHeader>
            <AlertDialogBody>Bạn có chắc muốn hủy đơn hàng này?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeCancelDialog}>
                Không
              </Button>
              <Button onClick={confirmCancelOrder} ml={3}>
                Có
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Order;