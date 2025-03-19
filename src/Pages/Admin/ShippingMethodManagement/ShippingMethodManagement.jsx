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
  Select,
} from "@chakra-ui/react";
import { Trash2, Edit2, Search, ChevronLeft, ChevronRight, Plus } from "react-feather";
import AddShippingMethod from "./AddShippingMethod";
import EditShippingMethod from "./EditShippingMethod";
import { useDisclosure } from "@chakra-ui/react";

const ShippingMethodManagement = () => {
  const [shippingMethods, setShippingMethods] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const toast = useToast();

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [shippingMethodIdToDelete, setShippingMethodIdToDelete] = useState(null);

  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [shippingMethodToEdit, setShippingMethodToEdit] = useState(null);

  useEffect(() => {
    fetchShippingMethods();
  }, []);

  const fetchShippingMethods = async () => {
    try {
      const response = await axiosInstance.get("/api/shipping-methods/manage");
      setShippingMethods(response.data);
      setCurrentPage(1);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách đơn vị vận chuyển. Vui lòng kiểm tra backend.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filteredShippingMethods = shippingMethods.filter((method) =>
      method.code.toLowerCase().includes(value.toLowerCase()) ||
      method.name.toLowerCase().includes(value.toLowerCase())
    );
    setShippingMethods(filteredShippingMethods);
  };

  const handleDeleteOpen = (id) => {
    setShippingMethodIdToDelete(id);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (shippingMethodIdToDelete) {
      try {
        await axiosInstance.delete(`/api/shipping-methods/manage/${shippingMethodIdToDelete}`);
        setShippingMethods(shippingMethods.filter((method) => method.id !== shippingMethodIdToDelete));
        toast({
          title: "Thành công",
          description: "Đã xóa đơn vị vận chuyển.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        if (paginatedShippingMethods.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể xóa đơn vị vận chuyển.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } finally {
        onDeleteClose();
        setShippingMethodIdToDelete(null);
      }
    }
  };

  const handleEditOpen = (shippingMethod) => {
    setShippingMethodToEdit(shippingMethod);
    onEditOpen();
  };

  const handleAddSuccess = (newShippingMethod) => {
    setShippingMethods([...shippingMethods, newShippingMethod]);
    setActiveTab(0);
  };

  const handleEditSuccess = (updatedShippingMethod) => {
    setShippingMethods(
      shippingMethods.map((method) =>
        method.id === updatedShippingMethod.id ? updatedShippingMethod : method
      )
    );
    onEditClose();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedShippingMethods = shippingMethods.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(shippingMethods.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
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
        <TabList mb={{ base: 2, md: 4 }} overflowX={{ base: "auto", md: "visible" }} whiteSpace="nowrap">
          <Tab fontSize={{ base: "sm", md: "md" }}>Danh sách đơn vị vận chuyển</Tab>
          <Tab fontSize={{ base: "sm", md: "md" }}>Thêm đơn vị vận chuyển</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <Stack spacing={{ base: 2, md: 4 }} mb={{ base: 2, md: 4 }}>
              <Input
                placeholder="Tìm kiếm theo mã hoặc tên..."
                value={searchTerm}
                onChange={handleSearch}
                leftIcon={<Search size={20} />}
                variant="outline"
                borderColor="var(--primary-color)"
                _hover={{ borderColor: "var(--hover-color)" }}
                _focus={{ borderColor: "var(--primary-color)", boxShadow: "0 0 0 1px var(--primary-color)" }}
                color="black"
                size={{ base: "sm", md: "md" }}
                _dark={{ color: "white", _placeholder: { color: "white" } }}
              />
            </Stack>

            <Box overflowX={{ base: "auto", md: "visible" }} w="100%">
              <Table variant="simple" size={{ base: "sm", md: "md" }} display={{ base: "none", md: "table" }} w="100%">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Mã</Th>
                    <Th>Tên</Th>
                    <Th>Phí vận chuyển</Th>
                    <Th>Trạng thái</Th>
                    <Th>Thao tác</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedShippingMethods.map((method) => (
                    <Tr key={method.id}>
                      <Td>{method.id}</Td>
                      <Td>{method.code}</Td>
                      <Td>{method.name}</Td>
                      <Td>{method.shippingFee} VND</Td>
                      <Td>{method.status}</Td>
                      <Td>
                        <Flex align="center" gap={2}>
                          <IconButton
                            icon={<Edit2 size={{ base: 16, md: 18 }} />}
                            aria-label="Sửa đơn vị vận chuyển"
                            onClick={() => handleEditOpen(method)}
                            colorScheme="blue"
                            variant="outline"
                            size={{ base: "xs", md: "sm" }}
                          />
                          <IconButton
                            icon={<Trash2 size={{ base: 16, md: 18 }} />}
                            aria-label="Xóa đơn vị vận chuyển"
                            onClick={() => handleDeleteOpen(method.id)}
                            colorScheme="red"
                            variant="outline"
                            size={{ base: "xs", md: "sm" }}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <VStack spacing={4} align="stretch" display={{ base: "flex", md: "none" }} w="100%">
                {paginatedShippingMethods.map((method) => (
                  <Box
                    key={method.id}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    bg="white"
                    _dark={{ bg: "gray.800" }}
                    w="100%"
                  >
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">ID: {method.id}</Text>
                        <Text>Mã: {method.code}</Text>
                        <Text>Tên: {method.name}</Text>
                        <Text>Phí vận chuyển: {method.shippingFee} VND</Text>
                        <Text>Trạng thái: {method.status}</Text>
                      </VStack>
                      <VStack spacing={2}>
                        <IconButton
                          icon={<Edit2 size={16} />}
                          aria-label="Sửa đơn vị vận chuyển"
                          onClick={() => handleEditOpen(method)}
                          colorScheme="blue"
                          variant="outline"
                          size="xs"
                        />
                        <IconButton
                          icon={<Trash2 size={16} />}
                          aria-label="Xóa đơn vị vận chuyển"
                          onClick={() => handleDeleteOpen(method.id)}
                          colorScheme="red"
                          variant="outline"
                          size="xs"
                        />
                      </VStack>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </Box>

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
                Tổng: {shippingMethods.length} đơn vị vận chuyển
              </Text>
            </Flex>
          </TabPanel>

          <TabPanel>
            <AddShippingMethod onAddSuccess={handleAddSuccess} />
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
              Bạn có chắc muốn xóa đơn vị vận chuyển này không? Hành động này không thể hoàn tác.
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

      <EditShippingMethod
        isOpen={isEditOpen}
        onClose={onEditClose}
        shippingMethod={shippingMethodToEdit}
        onEditSuccess={handleEditSuccess}
      />
    </Box>
  );
};

export default ShippingMethodManagement;