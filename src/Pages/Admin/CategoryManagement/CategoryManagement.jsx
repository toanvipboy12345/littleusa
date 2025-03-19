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
} from "@chakra-ui/react";
import { Trash2, Edit2, Search, ChevronLeft, ChevronRight } from "react-feather";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import { useDisclosure } from "@chakra-ui/react";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const toast = useToast();

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);

  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Hàm fetchCategories: Lấy danh sách danh mục từ API, hỗ trợ tìm kiếm theo tên
  const fetchCategories = async (search = "") => {
    try {
      const response = await axiosInstance.get(
        `/api/categories${search ? `?search=${encodeURIComponent(search)}` : ""}`
      );
      setCategories(response.data);
      setCurrentPage(1);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách danh mục.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Hàm handleSearch: Xử lý sự kiện nhập từ khóa tìm kiếm
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchCategories(value);
  };

  const handleDeleteOpen = (id) => {
    setCategoryIdToDelete(id);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (categoryIdToDelete) {
      try {
        await axiosInstance.delete(`/api/categories/${categoryIdToDelete}`);
        setCategories(categories.filter((category) => category.id !== categoryIdToDelete));
        toast({
          title: "Thành công",
          description: "Đã xóa danh mục.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        if (paginatedCategories.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể xóa danh mục.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } finally {
        onDeleteClose();
        setCategoryIdToDelete(null);
      }
    }
  };

  const handleEditOpen = (category) => {
    setCategoryToEdit(category);
    onEditOpen();
  };

  const handleAddSuccess = (newCategoryData) => {
    setCategories([...categories, newCategoryData]);
    setActiveTab(0);
  };

  const handleEditSuccess = (updatedCategory) => {
    setCategories(
      categories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
    onEditClose();
  };

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedCategories = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  // Hàm handleNextPage: Chuyển sang trang tiếp theo nếu chưa đến trang cuối
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Hàm handlePrevPage: Quay lại trang trước nếu không phải trang đầu
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Box
      p={{ base: 2, md: 4 }}
      mx="auto"
      maxW={{ base: "100%" }}
    >
      <Tabs index={activeTab} onChange={(index) => setActiveTab(index)}>
        <TabList mb={{ base: 2, md: 4 }} flexWrap="wrap">
          <Tab fontSize={{ base: "sm", md: "md" }}>Danh sách danh mục</Tab>
          <Tab fontSize={{ base: "sm", md: "md" }}>Thêm danh mục</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <Stack spacing={{ base: 2, md: 4 }} mb={{ base: 2, md: 4 }}>
              <Input
                placeholder="Tìm kiếm danh mục..."
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
                _dark={{ color: "white", _placeholder: { color: "white" } }}
              />
            </Stack>

            {/* Bảng trên desktop, danh sách trên mobile */}
            <Box overflowX={{ base: "auto", md: "visible" }} display={{ base: "block", md: "block" }}>
              <Table
                variant="simple"
                size={{ base: "sm", md: "md" }}
                display={{ base: "none", md: "table" }}
              >
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Tên</Th>
                    <Th>Mô tả</Th>
                    <Th>Thao tác</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedCategories.map((category) => (
                    <Tr key={category.id}>
                      <Td>{category.id}</Td>
                      <Td>{category.name}</Td>
                      <Td>{category.description || "Không có mô tả"}</Td>
                      <Td>
                        <Flex align="center" gap={2}>
                          <IconButton
                            icon={<Edit2 size={{ base: 16, md: 18 }} />}
                            aria-label="Sửa danh mục"
                            onClick={() => handleEditOpen(category)}
                            variant="outline"
                            size={{ base: "xs", md: "sm" }}
                          />
                          <IconButton
                            icon={<Trash2 size={{ base: 16, md: 18 }} />}
                            aria-label="Xóa danh mục"
                            onClick={() => handleDeleteOpen(category.id)}
                            variant="outline"
                            size={{ base: "xs", md: "sm" }}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              {/* Danh sách dạng thẻ trên mobile */}
              <VStack
                spacing={4}
                align="stretch"
                display={{ base: "flex", md: "none" }}
              >
                {paginatedCategories.map((category) => (
                  <Box
                    key={category.id}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    bg="white"
                    _dark={{ bg: "gray.800" }}
                  >
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">ID: {category.id}</Text>
                        <Text>Tên: {category.name}</Text>
                        <Text fontSize="sm">
                          Mô tả: {category.description || "Không có mô tả"}
                        </Text>
                      </VStack>
                      <VStack spacing={2}>
                        <IconButton
                          icon={<Edit2 size={16} />}
                          aria-label="Sửa danh mục"
                          onClick={() => handleEditOpen(category)}
                          variant="outline"
                          size="xs"
                        />
                        <IconButton
                          icon={<Trash2 size={16} />}
                          aria-label="Xóa danh mục"
                          onClick={() => handleDeleteOpen(category.id)}

                          variant="outline"
                          size="xs"
                        />
                      </VStack>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </Box>

            {/* Phân trang */}
            {categories.length > 0 && (
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
                  Tổng: {categories.length} danh mục
                </Text>
              </Flex>
            )}
          </TabPanel>

          <TabPanel>
            <AddCategory onAddSuccess={handleAddSuccess} />
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
              Bạn có chắc muốn xóa danh mục này không? Hành động này không thể hoàn tác.
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

      <EditCategory
        isOpen={isEditOpen}
        onClose={onEditClose}
        category={categoryToEdit}
        onEditSuccess={handleEditSuccess}
      />
    </Box>
  );
};

export default CategoryManagement;