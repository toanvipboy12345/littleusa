/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../../Api/axiosInstance";
import {
  Box, IconButton, Table, Thead, Tbody, Tr, Th, Td, Tabs, TabList, TabPanels, Tab, TabPanel,
  useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay, Button, Input, InputGroup, InputLeftElement,
  Stack, Flex, HStack, VStack, Text, Select
} from "@chakra-ui/react";
import { Trash2, Edit2, Search, ChevronLeft, ChevronRight } from "react-feather";
import AddCoupon from "./AddCoupon";
import EditCoupon from "./EditCoupon";
import { useDisclosure } from "@chakra-ui/react";

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const toast = useToast();

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [couponIdToDelete, setCouponIdToDelete] = useState(null);

  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [couponToEdit, setCouponToEdit] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async (search = "") => {
    try {
      const response = await axiosInstance.get(
        `/api/coupons/manage${search ? `/search?code=${encodeURIComponent(search)}` : ""}`
      );
      setCoupons(response.data);
      setCurrentPage(1);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách mã giảm giá.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchCoupons(value);
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleDeleteOpen = (id) => {
    setCouponIdToDelete(id);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (couponIdToDelete) {
      try {
        await axiosInstance.delete(`/api/coupons/manage/${couponIdToDelete}`);
        setCoupons(coupons.filter((coupon) => coupon.id !== couponIdToDelete));
        toast({
          title: "Thành công",
          description: "Đã xóa mã giảm giá.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        if (paginatedCoupons.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể xóa mã giảm giá.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } finally {
        onDeleteClose();
        setCouponIdToDelete(null);
      }
    }
  };

  const handleEditOpen = (coupon) => {
    setCouponToEdit(coupon);
    onEditOpen();
  };

  const handleAddSuccess = (newCouponData) => {
    setCoupons([...coupons, newCouponData]);
    setActiveTab(0);
  };

  const handleEditSuccess = (updatedCoupon) => {
    setCoupons(coupons.map((coupon) => (coupon.id === updatedCoupon.id ? updatedCoupon : coupon)));
    onEditClose();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedCoupons = coupons.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(coupons.length / itemsPerPage);

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
    <Box p={{ base: 1, md: 4 }} mx="auto" maxW={{ base: "100%", md: "100%" }} w="100%" overflowX="hidden">
      <Tabs index={activeTab} onChange={(index) => setActiveTab(index)}>
        <TabList mb={{ base: 2, md: 4 }} overflowX={{ base: "auto", md: "visible" }} whiteSpace="nowrap" sx={{ "::-webkit-scrollbar": { display: "none" }, "-ms-overflow-style": "none", "scrollbar-width": "none" }}>
          <Tab fontSize={{ base: "sm", md: "md" }}>Danh sách mã giảm giá</Tab>
          <Tab fontSize={{ base: "sm", md: "md" }}>Thêm mã giảm giá</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <Flex direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "center" }} justify="space-between" mb={{ base: 2, md: 4 }} gap={{ base: 2, md: 4 }} w="100%">
              <InputGroup flex={{ base: "1", md: "0 1 50%" }}>
                <InputLeftElement pointerEvents="none">
                  <Search size={20} />
                </InputLeftElement>
                <Input
                  placeholder="Tìm kiếm mã giảm giá..."
                  value={searchTerm}
                  onChange={handleSearch}
                  variant="outline"
                  borderColor="var(--primary-color)"
                  _hover={{ borderColor: "var(--hover-color)" }}
                  _focus={{ borderColor: "var(--primary-color)", boxShadow: "0 0 0 1px var(--primary-color)" }}
                  color="black"
                  size={{ base: "sm", md: "md" }}
                  _dark={{ color: "white", _placeholder: { color: "white" } }}
                />
              </InputGroup>
              <HStack spacing={2} flexShrink={0} justify={{ base: "center", md: "flex-end" }}>
                <Text fontSize={{ base: "sm", md: "md" }} whiteSpace="nowrap" color="gray.600" _dark={{ color: "gray.300" }}>Hiển thị:</Text>
                <Select value={itemsPerPage} onChange={handleItemsPerPageChange} size={{ base: "sm", md: "md" }} w={{ base: "100px", md: "120px" }} borderColor="gray.300" color="gray.600" _dark={{ borderColor: "gray.600", color: "white", bg: "gray.700" }} sx={{ option: { bg: "white", color: "gray.600", _dark: { bg: "gray.700", color: "white" } } }}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </Select>
                <Text fontSize={{ base: "sm", md: "md" }} whiteSpace="nowrap" color="gray.600" _dark={{ color: "gray.300" }}>mã giảm giá/trang</Text>
              </HStack>
            </Flex>

            <Box overflowX={{ base: "auto", md: "visible" }} display={{ base: "block", md: "block" }} w="100%">
              <Table variant="simple" size={{ base: "sm", md: "md" }} display={{ base: "none", md: "table" }} w="100%"><Thead><Tr><Th w="5%">ID</Th><Th w="10%">Mã</Th><Th w="8%">Tỷ lệ giảm (%)</Th><Th w="10%">Giảm tối đa (VND)</Th><Th w="10%">Ngày bắt đầu</Th><Th w="10%">Ngày kết thúc</Th><Th w="8%">Số lần tối đa</Th><Th w="8%">Trạng thái</Th><Th w="12%">Áp dụng cho sản phẩm giảm giá</Th><Th w="8%">Thao tác</Th></Tr></Thead><Tbody>{paginatedCoupons.map((coupon) => (<Tr key={coupon.id}><Td>{coupon.id}</Td><Td>{coupon.code}</Td><Td>{coupon.discountRate}%</Td><Td>{coupon.maxDiscountAmount ? coupon.maxDiscountAmount.toLocaleString("vi-VN") : "Không giới hạn"}</Td><Td>{new Date(coupon.startDate).toLocaleDateString()}</Td><Td>{new Date(coupon.endDate).toLocaleDateString()}</Td><Td>{coupon.maxUses}</Td><Td>{coupon.status}</Td><Td>{coupon.applicableToDiscountedProducts ? "Có" : "Không"}</Td><Td><Flex align="center" gap={2}><IconButton icon={<Edit2 />} aria-label="Sửa mã giảm giá" onClick={() => handleEditOpen(coupon)} colorScheme="blue" variant="outline" size={{ base: "xs", md: "sm" }} /><IconButton icon={<Trash2 />} aria-label="Xóa mã giảm giá" onClick={() => handleDeleteOpen(coupon.id)} colorScheme="red" variant="outline" size={{ base: "xs", md: "sm" }} /></Flex></Td></Tr>))}</Tbody></Table>

              <VStack spacing={4} align="stretch" display={{ base: "flex", md: "none" }} w="100%">
                {paginatedCoupons.map((coupon) => (
                  <Box key={coupon.id} p={3} borderWidth="1px" borderRadius="md" bg="white" _dark={{ bg: "gray.800" }} w="100%">
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">ID: {coupon.id}</Text>
                        <Text>Mã: {coupon.code}</Text>
                        <Text fontSize="sm">Tỷ lệ giảm: {coupon.discountRate}%</Text>
                        <Text fontSize="sm">Giảm tối đa: {coupon.maxDiscountAmount ? `${coupon.maxDiscountAmount.toLocaleString("vi-VN")} VND` : "Không giới hạn"}</Text>
                        <Text fontSize="sm">Ngày bắt đầu: {new Date(coupon.startDate).toLocaleDateString()}</Text>
                        <Text fontSize="sm">Ngày kết thúc: {new Date(coupon.endDate).toLocaleDateString()}</Text>
                        <Text fontSize="sm">Số lần tối đa: {coupon.maxUses}</Text>
                        <Text fontSize="sm">Trạng thái: {coupon.status}</Text>
                        <Text fontSize="sm">Áp dụng cho sản phẩm giảm giá: {coupon.applicableToDiscountedProducts ? "Có" : "Không"}</Text>
                      </VStack>
                      <VStack spacing={2}>
                        <IconButton icon={<Edit2 />} aria-label="Sửa mã giảm giá" onClick={() => handleEditOpen(coupon)} variant="solid" size="sm" />
                        <IconButton icon={<Trash2 />} aria-label="Xóa mã giảm giá" onClick={() => handleDeleteOpen(coupon.id)} variant="solid" size="sm" />
                      </VStack>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </Box>

            {coupons.length > 0 && (
              <Flex direction={{ base: "column", md: "row" }} justify={{ base: "center", md: "space-between" }} align="center" mt={{ base: 3, md: 4 }} gap={{ base: 2, md: 0 }} w="100%">
                <HStack spacing={{ base: 1, md: 2 }}>
                  <IconButton icon={<ChevronLeft />} onClick={handlePrevPage} isDisabled={currentPage === 1} aria-label="Trang trước" variant="outline" size={{ base: "xs", md: "sm" }} />
                  <Text fontSize={{ base: "sm", md: "md" }}>Trang {currentPage} / {totalPages}</Text>
                  <IconButton icon={<ChevronRight />} onClick={handleNextPage} isDisabled={currentPage === totalPages} aria-label="Trang sau" variant="outline" size={{ base: "xs", md: "sm" }} />
                </HStack>
                <Text fontSize={{ base: "sm", md: "md" }}>Tổng: {coupons.length} mã giảm giá</Text>
              </Flex>
            )}
          </TabPanel>

          <TabPanel>
            <AddCoupon onAddSuccess={handleAddSuccess} />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <AlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose} leastDestructiveRef={undefined}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Xác nhận xóa</AlertDialogHeader>
            <AlertDialogBody>Bạn có chắc muốn xóa mã giảm giá này không? Hành động này không thể hoàn tác.</AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onDeleteClose} variant="ghost">Hủy</Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3} variant="solid">Xóa</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <EditCoupon isOpen={isEditOpen} onClose={onEditClose} coupon={couponToEdit} onEditSuccess={handleEditSuccess} />
    </Box>
  );
};

export default CouponManagement;