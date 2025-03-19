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
  Image,
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
  Tooltip, // Thêm Tooltip
} from "@chakra-ui/react";
import { Trash2, Edit2, Search, ChevronLeft, ChevronRight } from "react-feather";
import AddBrand from "./AddBrand";
import EditBrand from "./EditBrand";
import { useDisclosure } from "@chakra-ui/react";

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const toast = useToast();

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [brandIdToDelete, setBrandIdToDelete] = useState(null);

  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [brandToEdit, setBrandToEdit] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  // Hàm fetchBrands: Lấy danh sách thương hiệu từ API, hỗ trợ tìm kiếm theo tên
  const fetchBrands = async (search = "") => {
    try {
      const response = await axiosInstance.get(
        `/api/brands${search ? `/search?name=${encodeURIComponent(search)}` : ""}`
      );
      setBrands(response.data);
      setCurrentPage(1);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách thương hiệu.",
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
    fetchBrands(value);
  };

  const handleDeleteOpen = (id) => {
    setBrandIdToDelete(id);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (brandIdToDelete) {
      try {
        await axiosInstance.delete(`/api/brands/${brandIdToDelete}`);
        setBrands(brands.filter((brand) => brand.id !== brandIdToDelete));
        toast({
          title: "Thành công",
          description: "Đã xóa thương hiệu.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        if (paginatedBrands.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể xóa thương hiệu.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } finally {
        onDeleteClose();
        setBrandIdToDelete(null);
      }
    }
  };

  const handleEditOpen = (brand) => {
    setBrandToEdit(brand);
    onEditOpen();
  };

  const handleAddSuccess = (newBrandData) => {
    setBrands([...brands, newBrandData]);
    setActiveTab(0);
  };

  const handleEditSuccess = (updatedBrand) => {
    setBrands(brands.map((brand) => (brand.id === updatedBrand.id ? updatedBrand : brand)));
    onEditClose();
  };

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedBrands = brands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(brands.length / itemsPerPage);

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
      p={{ base: 1, md: 4 }} // Padding nhỏ hơn trên mobile
      mx="auto"
      maxW={{ base: "100%", md: "100%" }} // Full width trên mobile, giới hạn trên tablet/desktop
      w="100%" // Đảm bảo chiều rộng 100% để không tràn
      overflowX="hidden" // Ngăn tràn chiều ngang
    >
      <Tabs index={activeTab} onChange={(index) => setActiveTab(index)}>
        <TabList
          mb={{ base: 2, md: 4 }}
          overflowX={{ base: "auto", md: "visible" }} // Cuộn ngang trên mobile, hiển thị bình thường trên desktop
          whiteSpace="nowrap" // Ngăn không cho xuống dòng trên mobile
          sx={{
            "::-webkit-scrollbar": {
              display: "none", // Ẩn thanh cuộn trên Chrome/Safari
            },
            "-ms-overflow-style": "none", // Ẩn thanh cuộn trên IE/Edge
            "scrollbar-width": "none", // Ẩn thanh cuộn trên Firefox
          }}
        >
          <Tab fontSize={{ base: "sm", md: "md" }}>Danh sách thương hiệu</Tab>
          <Tab fontSize={{ base: "sm", md: "md" }}>Thêm thương hiệu</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <Stack spacing={{ base: 2, md: 4 }} mb={{ base: 2, md: 4 }}>
              <Input
                placeholder="Tìm kiếm thương hiệu..."
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
                size={{ base: "sm", md: "md" }} // Kích thước nhỏ hơn trên mobile
                _dark={{
                  color: "white",
                  _placeholder: { color: "white" },
                }}
              />
            </Stack>

            {/* Bảng trên desktop, danh sách trên mobile */}
            <Box
              overflowX={{ base: "auto", md: "visible" }} // Cuộn ngang trên mobile
              display={{ base: "block", md: "block" }}
              w="100%" // Đảm bảo chiều rộng 100%
            >
              <Table
                variant="simple"
                size={{ base: "sm", md: "md" }} // Bảng nhỏ hơn trên mobile
                display={{ base: "none", md: "table" }} // Ẩn bảng trên mobile
                w="100%" // Đảm bảo bảng không tràn
              >
                <Thead>
                  <Tr>
                    <Th w="5%">ID</Th> {/* Giới hạn chiều rộng cột ID */}
                    <Th w="10%">Tên</Th> {/* Giới hạn chiều rộng cột Tên */}
                    <Th w="55%">Mô tả</Th> {/* Giới hạn chiều rộng cột Mô tả */}
                    <Th w="20%">Hình ảnh</Th> {/* Giới hạn chiều rộng cột Hình ảnh */}
                    <Th w="10%">Thao tác</Th> {/* Giới hạn chiều rộng cột Thao tác */}
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedBrands.map((brand) => (
                    <Tr key={brand.id}>
                      <Td>{brand.id}</Td>
                      <Td>{brand.name}</Td>
                      <Td>
                        <Tooltip
                          label={brand.description || "Không có mô tả"}
                          placement="top"
                          hasArrow
                        >
                          <Text noOfLines={2} maxW="100%">
                            {brand.description || "Không có mô tả"}
                          </Text>
                        </Tooltip>
                      </Td>
                      <Td>
                        {brand.image ? (
                          <Image
                            src={`http://localhost:8080${brand.image}`}
                            alt={brand.name}
                            maxW={{ base: "60px", md: "180px" }}
                            objectFit="contain"
                            fallbackSrc="https://via.placeholder.com/100"
                          />
                        ) : (
                          "Không có hình ảnh"
                        )}
                      </Td>
                      <Td>
                        <Flex align="center" gap={2}>
                          <IconButton
                            icon={<Edit2 size={{ base: 16, md: 18 }} />}
                            aria-label="Sửa thương hiệu"
                            onClick={() => handleEditOpen(brand)}
                            variant="outline"
                            size={{ base: "xs", md: "sm" }}
                          />
                          <IconButton
                            icon={<Trash2 size={{ base: 16, md: 18 }} />}
                            aria-label="Xóa thương hiệu"
                            onClick={() => handleDeleteOpen(brand.id)}
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
                display={{ base: "flex", md: "none" }} // Chỉ hiển thị trên mobile
                w="100%" // Đảm bảo chiều rộng 100%
              >
                {paginatedBrands.map((brand) => (
                  <Box
                    key={brand.id}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    bg="white"
                    _dark={{ bg: "gray.800" }}
                    w="100%" // Đảm bảo chiều rộng 100%
                  >
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={1} w="70%">
                        <Text fontWeight="bold">ID: {brand.id}</Text>
                        <Text>Tên: {brand.name}</Text>
                        <Tooltip
                          label={brand.description || "Không có mô tả"}
                          placement="top"
                          hasArrow
                        >
                          <Text
                            noOfLines={3} // Giới hạn 1 dòng trên mobile để tiết kiệm không gian
                            textOverflow="ellipsis"
                            whiteSpace="normal"
                            wordBreak="break-word"
                            maxW="100%"
                            fontSize="xs" // Giảm kích thước chữ trên mobile
                          >
                            Mô tả: {brand.description || "Không có mô tả"}
                          </Text>
                        </Tooltip>
                        {brand.image && (
                          <Image
                            src={`http://localhost:8080${brand.image}`}
                            alt={brand.name}
                            maxW="80px"
                            objectFit="contain"
                            fallbackSrc="https://via.placeholder.com/60"
                          />
                        )}
                      </VStack>
                      <Flex align="center" gap={2}>
                        <IconButton
                          icon={<Edit2 size={16} />}
                          aria-label="Sửa thương hiệu"
                          onClick={() => handleEditOpen(brand)}
                          variant="outline"
                          size="xs"
                        />
                        <IconButton
                          icon={<Trash2 size={16} />}
                          aria-label="Xóa thương hiệu"
                          onClick={() => handleDeleteOpen(brand.id)}
                          variant="outline"
                          size="xs"
                        />
                      </Flex>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </Box>

            {/* Phân trang */}
            {brands.length > 0 && (
              <Flex
                direction={{ base: "column", md: "row" }}
                justify={{ base: "center", md: "space-between" }}
                align="center"
                mt={{ base: 3, md: "4" }}
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
                  Tổng: {brands.length} thương hiệu
                </Text>
              </Flex>
            )}
          </TabPanel>

          <TabPanel>
            <AddBrand onAddSuccess={handleAddSuccess} />
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
              Bạn có chắc muốn xóa thương hiệu này không? Hành động này không thể hoàn tác.
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

      <EditBrand
        isOpen={isEditOpen}
        onClose={onEditClose}
        brand={brandToEdit}
        onEditSuccess={handleEditSuccess}
      />
    </Box>
  );
};

export default BrandManagement;