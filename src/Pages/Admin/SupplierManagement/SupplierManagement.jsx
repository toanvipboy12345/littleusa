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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Input,
  Stack,
  Flex,
  HStack,
  VStack,
  Text,
  Tooltip,
  Select,
} from "@chakra-ui/react";
import { Trash2, Edit2, Search, ChevronLeft, ChevronRight } from "react-feather";
import AddSupplier from "./AddSupplier";
import EditSupplier from "./EditSupplier";
import { useDisclosure } from "@chakra-ui/react";

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const toast = useToast();

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [supplierIdToDelete, setSupplierIdToDelete] = useState(null);

  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [supplierToEdit, setSupplierToEdit] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Fetch suppliers with optional search
  const fetchSuppliers = async (search = "") => {
    try {
      const response = await axiosInstance.get(
        `/api/suppliers${search ? `?name=${encodeURIComponent(search)}` : ""}`
      );
      setSuppliers(response.data);
      setCurrentPage(1);
    } catch (error) {
      // Kiểm tra customMessage từ interceptor
      const errorMessage = error.customMessage || "Không thể tải danh sách nhà cung cấp.";
      toast({
        title: "Lỗi",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchSuppliers(value);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleDeleteOpen = (id) => {
    setSupplierIdToDelete(id);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (supplierIdToDelete) {
      try {
        await axiosInstance.delete(`/api/suppliers/${supplierIdToDelete}`);
        setSuppliers(suppliers.filter((supplier) => supplier.id !== supplierIdToDelete));
        toast({
          title: "Thành công",
          description: "Đã xóa nhà cung cấp.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        if (paginatedSuppliers.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        // Kiểm tra customMessage từ interceptor
        const errorMessage = error.customMessage || "Không thể xóa nhà cung cấp.";
        toast({
          title: "Lỗi",
          description: errorMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } finally {
        onDeleteClose();
        setSupplierIdToDelete(null);
      }
    }
  };

  const handleEditOpen = (supplier) => {
    setSupplierToEdit(supplier);
    onEditOpen();
  };

  const handleAddSuccess = (newSupplierData) => {
    setSuppliers([...suppliers, newSupplierData]);
    setActiveTab(0);
  };

  const handleEditSuccess = (updatedSupplier) => {
    setSuppliers(suppliers.map((supplier) => (supplier.id === updatedSupplier.id ? updatedSupplier : supplier)));
    onEditClose();
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedSuppliers = suppliers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(suppliers.length / itemsPerPage);

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

  // Format createdAt date
  const formatDate = (dateString) => {
    if (!dateString) return "Không có ngày";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Box
      p={{ base: 1, md: 4 }}
      mx="auto"
      maxW={{ base: "100%", md: "100%" }}
      w="100%"
      overflowX="hidden"
    >
      <Tabs index={activeTab} onChange={(index) => setActiveTab(index)}>
        <TabList
          mb={{ base: 2, md: 4 }}
          overflowX={{ base: "auto", md: "visible" }}
          whiteSpace="nowrap"
          sx={{
            "::-webkit-scrollbar": { display: "none" },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          }}
        >
          <Tab fontSize={{ base: "sm", md: "md" }}>Danh sách nhà cung cấp</Tab>
          <Tab fontSize={{ base: "sm", md: "md" }}>Thêm nhà cung cấp</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <Stack spacing={{ base: 2, md: 4 }} mb={{ base: 2, md: 4 }}>
              <Flex
                direction={{ base: "column", md: "row" }}
                align={{ base: "stretch", md: "center" }}
                justify="space-between"
                gap={{ base: 2, md: 4 }}
                w="100%"
              >
                <Input
                  placeholder="Tìm kiếm nhà cung cấp..."
                  value={searchTerm}
                  onChange={handleSearch}
                  leftIcon={<Search size={20} />}
                  variant="outline"
                  borderColor="var(--primary-color)"
                  _hover={{ borderColor: "var(--hover-color)" }}
                  _focus={{
                    borderColor: "var(--primary-color)",
                    boxShadow: "0 0 0 1px var(--primary-color)",
                  }}
                  color="black"
                  size={{ base: "sm", md: "md" }}
                  _dark={{
                    color: "white",
                    _placeholder: { color: "white" },
                  }}
                  flex={{ base: "1", md: "0 1 50%" }}
                />
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
                    nhà cung cấp/trang
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
                    <Th w="5%">ID</Th>
                    <Th w="15%">Tên</Th>
                    <Th w="10%">Mã</Th>
                    <Th w="15%">Liên hệ</Th>
                    <Th w="20%">Địa chỉ</Th>
                    <Th w="10%">Số điện thoại</Th>
                    <Th w="10%">Ngày thêm</Th>
                    <Th w="15%">Thao tác</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedSuppliers.map((supplier) => (
                    <Tr key={supplier.id}>
                      <Td>{supplier.id}</Td>
                      <Td>{supplier.name}</Td>
                      <Td>{supplier.code}</Td>
                      <Td>
                        <Tooltip label={supplier.contact || "Không có thông tin"} placement="top" hasArrow>
                          <Text noOfLines={1}>{supplier.contact || "Không có thông tin"}</Text>
                        </Tooltip>
                      </Td>
                      <Td>
                        <Tooltip label={supplier.address || "Không có địa chỉ"} placement="top" hasArrow>
                          <Text noOfLines={1}>{supplier.address || "Không có địa chỉ"}</Text>
                        </Tooltip>
                      </Td>
                      <Td>{supplier.phone || "Không có số"}</Td>
                      <Td>{formatDate(supplier.createdAt)}</Td>
                      <Td>
                        <Flex align="center" gap={2}>
                          <IconButton
                            icon={<Edit2 size={{ base: 16, md: 18 }} />}
                            aria-label="Sửa nhà cung cấp"
                            onClick={() => handleEditOpen(supplier)}
                            variant="outline"
                            size={{ base: "xs", md: "sm" }}
                          />
                          <IconButton
                            icon={<Trash2 size={{ base: 16, md: 18 }} />}
                            aria-label="Xóa nhà cung cấp"
                            onClick={() => handleDeleteOpen(supplier.id)}
                            variant="outline"
                            size={{ base: "xs", md: "sm" }}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <VStack
                spacing={4}
                align="stretch"
                display={{ base: "flex", md: "none" }}
                w="100%"
              >
                {paginatedSuppliers.map((supplier) => (
                  <Box
                    key={supplier.id}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    bg="white"
                    _dark={{ bg: "gray.800" }}
                    w="100%"
                  >
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={1} w="70%">
                        <Text fontWeight="bold">ID: {supplier.id}</Text>
                        <Text>Tên: {supplier.name}</Text>
                        <Text>Mã: {supplier.code}</Text>
                        <Tooltip label={supplier.contact || "Không có thông tin"} placement="top" hasArrow>
                          <Text noOfLines={1}>Liên hệ: {supplier.contact || "Không có thông tin"}</Text>
                        </Tooltip>
                        <Tooltip label={supplier.address || "Không có địa chỉ"} placement="top" hasArrow>
                          <Text noOfLines={1}>Địa chỉ: {supplier.address || "Không có địa chỉ"}</Text>
                        </Tooltip>
                        <Text>SĐT: {supplier.phone || "Không có số"}</Text>
                        <Text>Ngày thêm: {formatDate(supplier.createdAt)}</Text>
                      </VStack>
                      <Flex align="center" gap={2}>
                        <IconButton
                          icon={<Edit2 size={16} />}
                          aria-label="Sửa nhà cung cấp"
                          onClick={() => handleEditOpen(supplier)}
                          variant="outline"
                          size="xs"
                        />
                        <IconButton
                          icon={<Trash2 size={16} />}
                          aria-label="Xóa nhà cung cấp"
                          onClick={() => handleDeleteOpen(supplier.id)}
                          variant="outline"
                          size="xs"
                        />
                      </Flex>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </Box>

            {suppliers.length > 0 && (
              <Flex
                direction={{ base: "column", md: "row" }}
                justify={{ base: "center", md: "space-between" }}
                align="center"
                mt={{ base: 3, md: 4 }}
                gap={{ base: 2, md: 0 }}
                w="100%"
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
                  Tổng: {suppliers.length} nhà cung cấp
                </Text>
              </Flex>
            )}
          </TabPanel>

          <TabPanel>
            <AddSupplier onAddSuccess={handleAddSuccess} />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <AlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose} leastDestructiveRef={undefined}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xác nhận xóa
            </AlertDialogHeader>
            <AlertDialogBody>
              Bạn có chắc muốn xóa nhà cung cấp này không? Hành động này không thể hoàn tác.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onDeleteClose} variant="ghost">
                Hủy
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteConfirm}
                ml={3}
                variant="solid"
              >
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <EditSupplier
        isOpen={isEditOpen}
        onClose={onEditClose}
        supplier={supplierToEdit}
        onEditSuccess={handleEditSuccess}
      />
    </Box>
  );
};

export default SupplierManagement;