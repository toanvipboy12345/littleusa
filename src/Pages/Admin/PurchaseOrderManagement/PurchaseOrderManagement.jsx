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
  Select,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { Search, ChevronLeft, ChevronRight, Download } from "react-feather";

const PurchaseOrderManagement = ({setActiveMenu}) => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading
  const [orderIdToCancel, setOrderIdToCancel] = useState(null); // Lưu ID phiếu để hủy
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const { isOpen: isCancelDialogOpen, onOpen: onCancelDialogOpen, onClose: onCancelDialogClose } = useDisclosure();
  const toast = useToast();

  // Đưa fetchPurchaseOrders ra ngoài useEffect
  const fetchPurchaseOrders = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, [toast, searchTerm]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleConfirmPurchaseOrder = async (id) => {
    try {
      await axiosInstance.patch(`/api/purchase-orders/${id}/confirm`);
      await fetchPurchaseOrders(); // Gọi lại để đồng bộ dữ liệu
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

  const handleCancelPurchaseOrder = async () => {
    if (!orderIdToCancel) return;
    try {
      await axiosInstance.patch(`/api/purchase-orders/${orderIdToCancel}/cancel`);
      await fetchPurchaseOrders(); // Gọi lại để đồng bộ dữ liệu
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
    } finally {
      setOrderIdToCancel(null);
      onCancelDialogClose();
    }
  };

  const handleOpenCancelDialog = (id) => {
    setOrderIdToCancel(id);
    onCancelDialogOpen();
  };

  const handleCreatePurchaseOrder = () => {
    setActiveMenu("addPurchaseOrder"); // Chuyển sang giao diện AddPurchaseOrder
  };

  const handleExportPdf = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/purchase-orders/${id}/export-pdf`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `purchase_order_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting PDF:", error);
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
    onModalOpen();
  };

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
        <Flex direction={{ base: "column", md: "row" }} gap={4} align="center" justify="space-between">
          <Flex direction={{ base: "column", md: "row" }} gap={4} align="center" flex="1">
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
            <Button
              variant="solid"
              colorScheme="blue"
              size={{ base: "sm", md: "md" }}
              onClick={handleCreatePurchaseOrder}
            >
              Tạo phiếu nhập
            </Button>
          </Flex>
          <HStack spacing={2} flexShrink={0} justify={{ base: "center", md: "flex-end" }}>
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
              phiếu nhập/trang
            </Text>
          </HStack>
        </Flex>
      </Stack>

      {isLoading ? (
        <Text textAlign="center" fontSize="lg">
          Đang tải dữ liệu...
        </Text>
      ) : (
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
                            onClick={() => handleOpenCancelDialog(order.id)}
                          >
                            Hủy
                          </Button>
                        </>
                      )}
                      <Button
                        size={{ base: "xs", md: "sm" }}
                        onClick={() => handleExportPdf(order.id)}
                        leftIcon={<Download size={16} />}
                      >
                        Xuất PDF
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

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

      <Modal isOpen={isModalOpen} onClose={onModalClose} size="3xl">
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
          <ModalFooter>
            <Button variant="solid" onClick={onModalClose}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isCancelDialogOpen}
        onClose={onCancelDialogClose}
        leastDestructiveRef={undefined}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xác nhận hủy phiếu nhập hàng
            </AlertDialogHeader>
            <AlertDialogBody>
              Bạn có chắc muốn hủy phiếu nhập hàng này không? Hành động này không thể hoàn tác.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onCancelDialogClose} variant="ghost">
                Không
              </Button>
              <Button onClick={handleCancelPurchaseOrder} ml={3} colorScheme="red">
                Hủy phiếu
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default PurchaseOrderManagement;