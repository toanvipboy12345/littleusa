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
import AddBlog from "./AddBlog";
import EditBlog from "./EditBlog";
import { useDisclosure } from "@chakra-ui/react";

const BlogsManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const toast = useToast();

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [blogIdToDelete, setBlogIdToDelete] = useState(null);

  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [blogToEdit, setBlogToEdit] = useState(null);

  const BASE_URL = "http://localhost:8080";

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async (search = "") => {
    try {
      const response = await axiosInstance.get(
        `/api/blogs${search ? `?search=${encodeURIComponent(search)}` : ""}`
      );
      console.log("Blogs from API:", response.data);
      setBlogs(response.data);
      setCurrentPage(1);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách bài viết.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchBlogs(value);
  };

  const handleDeleteOpen = (id) => {
    setBlogIdToDelete(id);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (blogIdToDelete) {
      try {
        await axiosInstance.delete(`/api/blogs/${blogIdToDelete}?userId=1`);
        setBlogs(blogs.filter((blog) => blog.id !== blogIdToDelete));
        toast({
          title: "Thành công",
          description: "Đã xóa bài viết.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        if (paginatedBlogs.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể xóa bài viết.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } finally {
        onDeleteClose();
        setBlogIdToDelete(null);
      }
    }
  };

  const handleEditOpen = (blog) => {
    console.log("Blog to edit:", blog);
    setBlogToEdit(blog);
    // Đảm bảo blogToEdit được cập nhật trước khi mở modal
    setTimeout(() => {
      onEditOpen();
    }, 0);
  };

  const handleAddSuccess = (newBlogData) => {
    setBlogs([...blogs, newBlogData]);
    setActiveTab(0);
  };

  const handleEditSuccess = (updatedBlog) => {
    setBlogs(
      blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
    );
    onEditClose();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedBlogs = blogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(blogs.length / itemsPerPage);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box
      p={{ base: 2, md: 4 }}
      mx="auto"
      maxW={{ base: "100%" }}
    >
      <Tabs index={activeTab} onChange={(index) => setActiveTab(index)}>
        <TabList mb={{ base: 2, md: 4 }} flexWrap="wrap">
          <Tab fontSize={{ base: "sm", md: "md" }}>Danh sách bài viết</Tab>
          <Tab fontSize={{ base: "sm", md: "md" }}>Thêm bài viết</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <Stack spacing={{ base: 2, md: 4 }} mb={{ base: 2, md: 4 }}>
              <Input
                placeholder="Tìm kiếm bài viết..."
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

            <Box overflowX={{ base: "auto", md: "visible" }} display={{ base: "block", md: "block" }}>
              <Table
                variant="simple"
                size={{ base: "sm", md: "md" }}
                display={{ base: "none", md: "table" }}
              >
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Tiêu đề</Th>
                    <Th>Ảnh đại diện</Th>
                    <Th>Tác giả</Th>
                    <Th>Ngày tạo</Th>
                    <Th>Trạng thái</Th>
                    <Th>Thao tác</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedBlogs.map((blog) => (<Tr key={blog.id}><Td>{blog.id}</Td><Td>{blog.title}</Td><Td>{blog.thumbnail ? (<img src={`${BASE_URL}${blog.thumbnail}`} alt="Thumbnail" style={{ maxWidth: "150px" }} />) : ("Không có ảnh")}</Td><Td>{blog.authorUsername}</Td><Td>{formatDate(blog.createdAt)}</Td><Td>{blog.isPublished ? "Đã xuất bản" : "Nháp"}</Td><Td><Flex align="center" gap={2}><IconButton icon={<Edit2 size={{ base: 16, md: 18 }} />} aria-label="Sửa bài viết" onClick={() => handleEditOpen(blog)} variant="outline" size={{ base: "xs", md: "sm" }} /><IconButton icon={<Trash2 size={{ base: 16, md: 18 }} />} aria-label="Xóa bài viết" onClick={() => handleDeleteOpen(blog.id)} variant="outline" size={{ base: "xs", md: "sm" }} /></Flex></Td></Tr>))}
                </Tbody>
              </Table>

              <VStack
                spacing={4}
                align="stretch"
                display={{ base: "flex", md: "none" }}
              >
                {paginatedBlogs.map((blog) => (
                  <Box
                    key={blog.id}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    bg="white"
                    _dark={{ bg: "gray.800" }}
                  >
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">ID: {blog.id}</Text>
                        <Text>Tiêu đề: {blog.title}</Text>
                        <Text fontSize="sm">Tác giả: {blog.authorUsername}</Text>
                        <Text fontSize="sm">Ngày tạo: {formatDate(blog.createdAt)}</Text>
                        <Text fontSize="sm">
                          Trạng thái: {blog.isPublished ? "Đã xuất bản" : "Nháp"}
                        </Text>
                        {blog.thumbnail && (
                          <img
                            src={`${BASE_URL}${blog.thumbnail}`}
                            alt="Thumbnail"
                            style={{ maxWidth: "50px" }}
                          />
                        )}
                      </VStack>
                      <VStack spacing={2}>
                        <IconButton
                          icon={<Edit2 size={16} />}
                          aria-label="Sửa bài viết"
                          onClick={() => handleEditOpen(blog)}
                          variant="outline"
                          size="xs"
                        />
                        <IconButton
                          icon={<Trash2 size={16} />}
                          aria-label="Xóa bài viết"
                          onClick={() => handleDeleteOpen(blog.id)}
                          variant="outline"
                          size="xs"
                        />
                      </VStack>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </Box>

            {blogs.length > 0 && (
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
                  Tổng: {blogs.length} bài viết
                </Text>
              </Flex>
            )}
          </TabPanel>

          <TabPanel>
            <AddBlog onAddSuccess={handleAddSuccess} />
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
              Bạn có chắc muốn xóa bài viết này không? Hành động này không thể hoàn tác.
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

      <EditBlog
        isOpen={isEditOpen}
        onClose={onEditClose}
        blog={blogToEdit}
        onEditSuccess={handleEditSuccess}
      />
    </Box>
  );
};

export default BlogsManagement;