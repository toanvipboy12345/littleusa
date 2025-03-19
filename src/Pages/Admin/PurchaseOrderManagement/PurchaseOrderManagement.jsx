import React, { useState, useEffect } from "react";
import axiosInstance from "../../../Api/axiosInstance";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Button,
  Stack,
  Flex,
  Text,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement,
  Image,
  IconButton,
  FormControl,
  FormLabel,
  SimpleGrid,
} from "@chakra-ui/react";
import { Search, ChevronLeft, ChevronRight } from "react-feather";

const PurchaseOrderManagement = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);
        const response = await axiosInstance.get(
          `/api/purchase-orders${params.toString() ? `?${params.toString()}` : ""}`
        );
        setPurchaseOrders(response.data);
      } catch (error) {
        console.error("Error fetching purchase orders:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách phiếu nhập hàng.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    };
    fetchPurchaseOrders();
  }, [toast, searchTerm]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleConfirmPurchaseOrder = async (id) => {
    try {
      const response = await axiosInstance.patch(`/api/purchase-orders/${id}/confirm`);
      setPurchaseOrders(
        purchaseOrders.map((order) =>
          order.id === id ? response.data : order
        )
      );
      toast({
        title: "Thành công",
        description: "Phiếu nhập hàng đã được xác nhận.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error("Error confirming purchase order:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xác nhận phiếu nhập hàng.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleCancelPurchaseOrder = async (id) => {
    try {
      const response = await axiosInstance.patch(`/api/purchase-orders/${id}/cancel`);
      setPurchaseOrders(
        purchaseOrders.map((order) =>
          order.id === id ? response.data : order
        )
      );
      toast({
        title: "Thành công",
        description: "Phiếu nhập hàng đã bị hủy.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error("Error cancelling purchase order:", error);
      toast({
        title: "Lỗi",
        description: "Không thể hủy phiếu nhập hàng.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedPurchaseOrders = purchaseOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(purchaseOrders.length / itemsPerPage);

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

  // Hàm nhóm các mục nhập theo variantColor
  const groupItemsByColor = (items) => {
    const grouped = {};
    items.forEach((item) => {
      const color = item.variantColor || "Không xác định";
      if (!grouped[color]) {
        grouped[color] = {
          variantColor: color,
          variantMainImage: item.variantMainImage,
          productName: `${selectedOrder.productName} - ${color}`,
          sizes: [],
        };
      }
      grouped[color].sizes.push({
        size: item.size || "Không xác định",
        quantity: item.quantity,
      });
    });
    return Object.values(grouped);
  };

  // Hàm chuyển đổi trạng thái sang tiếng Việt
  const getStatusInVietnamese = (status) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <Box p={{ base: 2, md: 4 }} mx="auto" maxW={{ base: "100%" }}>
      <Stack spacing={{ base: 2, md: 4 }} mb={{ base: 2, md: 4 }}>
        <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
          Danh sách phiếu nhập hàng
        </Text>
        <Flex direction={{ base: "column", md: "row" }} gap={4} align="center">
          <InputGroup maxW={{ base: "100%", md: "300px" }}>
            <InputLeftElement pointerEvents="none">
              <Search size={20} color="gray.500" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm theo mã hoặc tên sản phẩm..."
              value={searchTerm}
              onChange={handleSearch}
              variant="outline"
              borderColor="var(--primary-color)"
              _hover={{ borderColor: "var(--hover-color)" }}
              _focus={{ borderColor: "var(--primary-color)", boxShadow: "0 0 0 1px var(--primary-color)" }}
              color="black"
              size={{ base: "sm", md: "md" }}
              _dark={{ color: "white", _placeholder: { color: "gray.400" } }}
            />
          </InputGroup>
        </Flex>
      </Stack>

      <Box overflowX={{ base: "auto", md: "visible" }}>
        <Table variant="simple" size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Mã phiếu</Th>
              <Th>Nhà cung cấp</Th>
              <Th>Sản phẩm</Th>
              <Th>Ngày tạo</Th>
              <Th>Ngày cập nhật</Th>
              <Th>Trạng thái</Th>
              <Th>Tổng giá trị</Th>
              <Th>Chi tiết</Th>
              <Th>Thao tác</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedPurchaseOrders.map((order) => (
              <Tr key={order.id}>
                <Td>{order.id}</Td>
                <Td>{order.purchaseOrderCode}</Td>
                <Td>{order.supplierName}</Td>
                <Td>{order.productName}</Td>
                <Td>{formatDate(order.createdAt)}</Td>
                <Td>{formatDate(order.updatedAt)}</Td>
                <Td>{getStatusInVietnamese(order.status)}</Td>
                <Td>{formatCurrency(order.totalAmount)}</Td>
                <Td>
                  <Button
                    size={{ base: "xs", md: "sm" }}
                    onClick={() => handleViewDetails(order)}
                  >
                    Xem chi tiết
                  </Button>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    {order.status === "PENDING" && (
                      <>
                        <Button
                          size={{ base: "xs", md: "sm" }}
                          onClick={() => handleConfirmPurchaseOrder(order.id)}
                        >
                          Xác nhận
                        </Button>
                        <Button
                          size={{ base: "xs", md: "sm" }}
                          onClick={() => handleCancelPurchaseOrder(order.id)}
                        >
                          Hủy
                        </Button>
                      </>
                    )}
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {purchaseOrders.length > 0 && (
        <Flex
          direction={{ base: "column", md: "row" }}
          justify={{ base: "center", md: "space-between" }}
          align="center"
          mt={{ base: 3, md: 4 }}
          gap={{ base: 2, md: 0 }}
        >
          <HStack spacing={{ base: 1, md: 2 }}>
            <IconButton
              icon={<ChevronLeft size={{ base: 16, md: 20 }} />}
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
              icon={<ChevronRight size={{ base: 16, md: 20 }} />}
              onClick={handleNextPage}
              isDisabled={currentPage === totalPages}
              aria-label="Trang sau"
              variant="outline"
              size={{ base: "xs", md: "sm" }}
            />
          </HStack>
          <Text fontSize={{ base: "sm", md: "md" }}>
            Tổng: {purchaseOrders.length} phiếu nhập hàng
          </Text>
        </Flex>
      )}

      {/* Modal để xem chi tiết */}
      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chi tiết phiếu nhập hàng</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrder && (
              <Box>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
                  <FormControl>
                    <FormLabel>Mã phiếu</FormLabel>
                    <Input value={selectedOrder.purchaseOrderCode || ""} isReadOnly />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Nhà cung cấp</FormLabel>
                    <Input value={selectedOrder.supplierName || ""} isReadOnly />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Sản phẩm</FormLabel>
                    <Input value={selectedOrder.productVariantName || ""} isReadOnly />
                  </FormControl>
                </SimpleGrid>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
                  <FormControl>
                    <FormLabel>Ngày tạo</FormLabel>
                    <Input value={formatDate(selectedOrder.createdAt) || ""} isReadOnly />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Ngày cập nhật</FormLabel>
                    <Input value={formatDate(selectedOrder.updatedAt) || ""} isReadOnly />
                  </FormControl>
                </SimpleGrid>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
                  <FormControl>
                    <FormLabel>Trạng thái</FormLabel>
                    <Input value={getStatusInVietnamese(selectedOrder.status) || ""} isReadOnly />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Giá nhập</FormLabel>
                    <Input value={formatCurrency(selectedOrder.importPrice) || ""} isReadOnly />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Tổng giá trị</FormLabel>
                    <Input value={formatCurrency(selectedOrder.totalAmount) || ""} isReadOnly />
                  </FormControl>
                </SimpleGrid>

                <Text mt={4} fontWeight="bold">Danh sách mục nhập:</Text>
                <Flex wrap="wrap" gap={6} mt={4}>
                  {groupItemsByColor(selectedOrder.items).map((group, groupIndex) => (
                    <Box
                      key={groupIndex}
                      width={{ base: "100%", md: "48%" }} 
                      p={2}
                      mb={4}
                    >
                      <Flex alignItems="center" mb={2}>
                        {group.variantMainImage ? (
                          <Image
                            src={`http://localhost:8080${group.variantMainImage}`}
                            alt={`Ảnh chính của biến thể ${group.variantColor}`}
                            boxSize="50px"
                            objectFit="cover"
                            mr={3}
                          />
                        ) : (
                          <Text mr={3}>Không có ảnh</Text>
                        )}
                        <Text fontWeight="bold">{group.productName}</Text>
                      </Flex>
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Kích thước</Th>
                            <Th>Số lượng nhập</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {group.sizes.map((sizeItem, sizeIndex) => (
                            <Tr key={sizeIndex}>
                              <Td>{sizeItem.size}</Td>
                              <Td>{sizeItem.quantity}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  ))}
                </Flex>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PurchaseOrderManagement;