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
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  Stepper,
  StepSeparator,
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
} from "@chakra-ui/react";
import { useCart } from "../../../../../context/CartContext";
import { UserContext } from "../../../../../context/UserContext";

const Order = () => {
  const { cartToken } = useCart();
  const { user } = React.useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const toast = useToast();
  const cancelRef = useRef();

  const steps = [
    { title: "Đang chờ", status: "PENDING" },
    { title: "Đã xác nhận", status: "CONFIRMED" },
    { title: "Đã giao cho DVVC", status: "SHIPPED" },
    { title: "Đã giao", status: "DELIVERED" },
  ];

  const mapStatusToVietnamese = (status) => {
    const statusMap = {
      PENDING: "Đang chờ",
      CONFIRMED: "Xác nhận",
      SHIPPED: "Đã giao cho đơn vị vận chuyển",
      DELIVERED: "Đã giao",
      CANCELLED: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        user?.id ? `/api/orders/user/${user.id}` : `/api/orders/cart-token/${cartToken}`
      );
      setOrders(response.data || []);
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
    return stepIndex >= 0 ? stepIndex : 0; // Trả về chỉ số của trạng thái hiện tại
  };

  const isStepComplete = (stepIndex, currentStatus) => {
    const currentIndex = steps.findIndex((step) => step.status === currentStatus);
    return currentIndex > stepIndex;
  };

  useEffect(() => {
    fetchOrders();
  }, [user, cartToken]);

  const baseURL = "http://localhost:8080";

  return (
    <Box px={{ base: 4, md: 6 }} py={{ base: 6, md: 10 }} maxW="1200px" mx="auto">
      

      {loading ? (
        <Text textAlign="center" color="gray.500">Đang tải...</Text>
      ) : orders.length === 0 ? (
        <Text textAlign="center" color="gray.500">Bạn chưa có đơn hàng nào.</Text>
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
                              {item.productName} - {item.variantColor}
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
                  <Box w="100%" display={{ base: "none", md: "none", lg: "block" }}>
                    {order.status !== "CANCELLED" ? (
                      <Stepper
                        index={getActiveStep(order.status)}
                        orientation="horizontal"
                        size="sm"
                        w="100%"
                      >
                        {steps.map((step, index) => (
                          <Step key={index}>
                            <StepIndicator>
                              <StepStatus
                                complete={isStepComplete(index, order.status) ? <StepIcon /> : null}
                                incomplete={<StepNumber />}
                                active={index === getActiveStep(order.status) ? <StepNumber /> : null}
                              />
                            </StepIndicator>
                            <StepTitle fontSize={{ base: "xs", md: "sm" }}>{step.title}</StepTitle>
                            <StepSeparator />
                          </Step>
                        ))}
                      </Stepper>
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
                      <Text>
                        Tên: {order.customerName}
                      </Text>
                      <Text mx={2}>|</Text>
                      <Text>
                        Email: {order.email}
                      </Text>
                      <Text mx={2}>|</Text>
                      <Text>
                        Số điện thoại: {order.phoneNumber}
                      </Text>
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
                  <HStack spacing={4} align="start" w="100%">
                    <Flex direction="row" align="center" flex={1}>
                      <Text fontWeight="bold" mr={2}>Phương thức vận chuyển:</Text>
                      <Text fontSize={{ base: "sm", md: "md" }}>
                        {order.shippingMethod} (Phí: {order.shippingFee.toLocaleString()} VNĐ)
                      </Text>
                    </Flex>
                    <Flex direction="row" align="center" flex={1}>
                      <Text fontWeight="bold" mr={2}>Phương thức thanh toán:</Text>
                      {order.paymentMethod.toUpperCase() === "COD" ? (
                        <Text fontSize={{ base: "sm", md: "md" }}>Thanh toán khi nhận hàng</Text>
                      ) : (
                        <Text fontSize={{ base: "sm", md: "md" }}>
                          {order.paymentMethod} - {order.paymentStatus}
                        </Text>
                      )}
                    </Flex>
                  </HStack>
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
              <Button  onClick={confirmCancelOrder} ml={3}>
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