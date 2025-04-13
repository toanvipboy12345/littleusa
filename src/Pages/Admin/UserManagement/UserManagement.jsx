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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { Trash2, Edit2, Search, ChevronLeft, ChevronRight, Eye, Plus } from "react-feather";
import { useDisclosure } from "@chakra-ui/react";
import EditAdmin from "./EditAdmin";
import AddAdmin from "./AddAdmin";

const roleLabels = {
  super_admin: "Super Admin",
  product_manager: "Product Manager",
  order_manager: "Order Manager",
  marketing_manager: "Marketing Manager",
  customer_support: "Customer Support",
  blog_manager: "Blog Manager",
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const [currentPageAdmins, setCurrentPageAdmins] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const toast = useToast();

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [adminToEdit, setAdminToEdit] = useState(null);

  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);

  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();

  useEffect(() => {
    fetchUsers();
    fetchAdmins();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`/user`);
      const customerData = response.data.filter((user) => user.role === "user");
      setUsers(customerData);
      setFilteredUsers(customerData);
      setCurrentPageUsers(1);
    } catch (error) {
      const errorMessage = error.customMessage || "Không thể tải danh sách khách hàng.";
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

  const fetchAdmins = async () => {
    setIsLoadingAdmins(true);
    try {
      const response = await axiosInstance.get(`/api/admin-list`);
      setAdmins(response.data);
      setFilteredAdmins(response.data);
      setCurrentPageAdmins(1);
    } catch (error) {
      const errorMessage = error.customMessage || "Không thể tải danh sách admin.";
      toast({
        title: "Lỗi",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoadingAdmins(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (activeTab === 0) {
      const filtered = users.filter((user) => {
        const fullName = `${user.lastName || ""} ${user.firstName || ""}`.toLowerCase();
        const nameMatch = user.firstName?.toLowerCase().includes(value) || fullName.includes(value);
        const contactMatch = user.phone?.toLowerCase().includes(value) || user.email?.toLowerCase().includes(value);
        return nameMatch || contactMatch;
      });
      setFilteredUsers(filtered);
      setCurrentPageUsers(1);
    } else {
      const filtered = admins.filter((admin) => {
        const fullName = `${admin.lastName || ""} ${admin.firstName || ""}`.toLowerCase();
        const nameMatch = admin.firstName?.toLowerCase().includes(value) || fullName.includes(value);
        const contactMatch = admin.phone?.toLowerCase().includes(value) || admin.email?.toLowerCase().includes(value);
        return nameMatch || contactMatch;
      });
      setFilteredAdmins(filtered);
      setCurrentPageAdmins(1);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPageUsers(1);
    setCurrentPageAdmins(1);
  };

  const handleDeleteOpen = (id) => {
    setUserIdToDelete(id);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (userIdToDelete) {
      try {
        await axiosInstance.delete(`/user/${userIdToDelete}`);
        if (activeTab === 0) {
          const updatedUsers = users.filter((user) => user.id !== userIdToDelete);
          setUsers(updatedUsers);
          setFilteredUsers(updatedUsers);
        } else {
          const updatedAdmins = admins.filter((admin) => admin.id !== userIdToDelete);
          setAdmins(updatedAdmins);
          setFilteredAdmins(updatedAdmins);
        }
        toast({
          title: "Thành công",
          description: "Đã xóa người dùng.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        if (activeTab === 0 && currentUsers.length === 1 && currentPageUsers > 1) {
          setCurrentPageUsers(currentPageUsers - 1);
        } else if (activeTab === 1 && currentAdmins.length === 1 && currentPageAdmins > 1) {
          setCurrentPageAdmins(currentPageAdmins - 1);
        }
      } catch (error) {
        const errorMessage = error.customMessage || "Không thể xóa người dùng.";
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
        setUserIdToDelete(null);
      }
    }
  };

  const handleEditOpen = (admin) => {
    setAdminToEdit(admin);
    onEditOpen();
  };

  const handleEditSuccess = async (updatedAdmin) => {
    // Cập nhật cục bộ state admins và filteredAdmins, bảo toàn adminRoles nếu không có trong updatedAdmin
    setAdmins((prevAdmins) =>
      prevAdmins.map((admin) =>
        admin.id === updatedAdmin.id
          ? {
              ...admin,
              ...updatedAdmin,
              adminRoles: updatedAdmin.adminRoles || admin.adminRoles, // Bảo toàn adminRoles
            }
          : admin
      )
    );
    setFilteredAdmins((prevFilteredAdmins) =>
      prevFilteredAdmins.map((admin) =>
        admin.id === updatedAdmin.id
          ? {
              ...admin,
              ...updatedAdmin,
              adminRoles: updatedAdmin.adminRoles || admin.adminRoles, // Bảo toàn adminRoles
            }
          : admin
      )
    );

    // Gọi lại fetchAdmins để đồng bộ với server
    try {
      const response = await axiosInstance.get(`/api/admin-list`);
      setAdmins(response.data);
      setFilteredAdmins(response.data);
    } catch (error) {
      console.error("Lỗi khi làm mới danh sách admin:", error);
      toast({
        title: "Lỗi",
        description: "Không thể làm mới danh sách admin.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }

    onEditClose();
  };

  const handleDetailOpen = (user) => {
    setSelectedUser(user);
    onDetailOpen();
  };

  const handleAddSuccess = async () => {
    await fetchAdmins();
    onAddClose();
  };

  const indexOfLastUser = currentPageUsers * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPagesUsers = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleNextPageUsers = () => {
    if (currentPageUsers < totalPagesUsers) {
      setCurrentPageUsers(currentPageUsers + 1);
    }
  };

  const handlePrevPageUsers = () => {
    if (currentPageUsers > 1) {
      setCurrentPageUsers(currentPageUsers - 1);
    }
  };

  const indexOfLastAdmin = currentPageAdmins * itemsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - itemsPerPage;
  const currentAdmins = filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);
  const totalPagesAdmins = Math.ceil(filteredAdmins.length / itemsPerPage);

  const handleNextPageAdmins = () => {
    if (currentPageAdmins < totalPagesAdmins) {
      setCurrentPageAdmins(currentPageAdmins + 1);
    }
  };

  const handlePrevPageAdmins = () => {
    if (currentPageAdmins > 1) {
      setCurrentPageAdmins(currentPageAdmins - 1);
    }
  };

  const getRoleLabel = (roles) => {
    if (!roles || roles.length === 0) return "N/A";
    return roles.map((role) => roleLabels[role] || role).join(", ");
  };

  return (
    <Box p={{ base: 2, md: 4 }} mx="auto" maxW={{ base: "100%" }}>
      <Tabs index={activeTab} onChange={(index) => setActiveTab(index)}>
        <TabList mb={{ base: 2, md: 4 }} flexWrap="wrap">
          <Tab fontSize={{ base: "sm", md: "md" }}>Quản lý khách hàng</Tab>
          <Tab fontSize={{ base: "sm", md: "md" }}>Quản lý admin</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <Stack spacing={{ base: 2, md: 4 }} mb={{ base: 2, md: 4 }}>
              <Flex
                direction={{ base: "column", md: "row" }}
                align={{ base: "stretch", md: "center" }}
                justify="space-between"
                gap={{ base: 2, md: 4 }}
              >
                <Input
                  placeholder="Tìm kiếm khách hàng..."
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
                  flex={{ base: "1", md: "0 1 50%" }}
                />
                <HStack spacing={2} flexShrink={0} justify={{ base: "center", md: "flex-end" }}>
                  <Text fontSize={{ base: "sm", md: "md" }} whiteSpace="nowrap" color="gray.600" _dark={{ color: "gray.300" }}>
                    Hiển thị:
                  </Text>
                  <Select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    size={{ base: "sm", md: "md" }}
                    w={{ base: "100px", md: "120px" }}
                    borderColor="gray.300"
                    color="gray.600"
                    _dark={{ borderColor: "gray.600", color: "white", bg: "gray.700" }}
                    sx={{
                      option: {
                        bg: "white",
                        color: "gray.600",
                        _dark: { bg: "gray.700", color: "white" },
                      },
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </Select>
                  <Text fontSize={{ base: "sm", md: "md" }} whiteSpace="nowrap" color="gray.600" _dark={{ color: "gray.300" }}>
                    khách hàng/trang
                  </Text>
                </HStack>
              </Flex>
            </Stack>

            <Box overflowX={{ base: "auto", md: "visible" }} display={{ base: "block", md: "block" }}>
              <Table variant="simple" size={{ base: "sm", md: "md" }} display={{ base: "none", md: "table" }}>
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Họ</Th>
                    <Th>Tên</Th>
                    <Th>Email</Th>
                    <Th>Số điện thoại</Th>
                    <Th>Ngày tạo</Th>
                    <Th>Thao tác</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {currentUsers.map((user) => (
                    <Tr key={user.id}>
                      <Td>{user.id}</Td>
                      <Td>{user.lastName || "N/A"}</Td>
                      <Td>{user.firstName || "N/A"}</Td>
                      <Td>{user.email}</Td>
                      <Td>{user.phone || "N/A"}</Td>
                      <Td>{user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}</Td>
                      <Td>
                        <Flex align="center" gap={2}>
                          <IconButton
                            icon={<Eye size={{ base: 16, md: 18 }} />}
                            aria-label="Xem chi tiết khách hàng"
                            onClick={() => handleDetailOpen(user)}
                            variant="outline"
                            size={{ base: "xs", md: "sm" }}
                          />
                          <IconButton
                            icon={<Trash2 size={{ base: 16, md: 18 }} />}
                            aria-label="Xóa khách hàng"
                            onClick={() => handleDeleteOpen(user.id)}
                            variant="outline"
                            size={{ base: "xs", md: "sm" }}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <VStack spacing={4} align="stretch" display={{ base: "flex", md: "none" }}>
                {currentUsers.map((user) => (
                  <Box key={user.id} p={3} borderWidth="1px" borderRadius="md" bg="white" _dark={{ bg: "gray.800" }}>
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">ID: {user.id}</Text>
                        <Text>Họ: {user.lastName || "N/A"}</Text>
                        <Text>Tên: {user.firstName || "N/A"}</Text>
                        <Text fontSize="sm">Email: {user.email}</Text>
                        <Text fontSize="sm">Số điện thoại: {user.phone || "N/A"}</Text>
                        <Text fontSize="sm">Ngày tạo: {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}</Text>
                      </VStack>
                      <VStack spacing={2}>
                        <IconButton
                          icon={<Eye size={16} />}
                          aria-label="Xem chi tiết khách hàng"
                          onClick={() => handleDetailOpen(user)}
                          variant="outline"
                          size="xs"
                        />
                        <IconButton
                          icon={<Trash2 size={16} />}
                          aria-label="Xóa khách hàng"
                          onClick={() => handleDeleteOpen(user.id)}
                          variant="outline"
                          size="xs"
                        />
                      </VStack>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </Box>

            {filteredUsers.length > 0 && (
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
                    onClick={handlePrevPageUsers}
                    isDisabled={currentPageUsers === 1}
                    aria-label="Trang trước"
                    variant="outline"
                    size={{ base: "xs", md: "sm" }}
                  />
                  <Text fontSize={{ base: "sm", md: "md" }}>
                    Trang {currentPageUsers} / {totalPagesUsers}
                  </Text>
                  <IconButton
                    icon={<ChevronRight size={{ base: 16, md: 20 }} />}
                    onClick={handleNextPageUsers}
                    isDisabled={currentPageUsers === totalPagesUsers}
                    aria-label="Trang sau"
                    variant="outline"
                    size={{ base: "xs", md: "sm" }}
                  />
                </HStack>
                <Text fontSize={{ base: "sm", md: "md" }}>
                  Tổng: {filteredUsers.length} khách hàng
                </Text>
              </Flex>
            )}
          </TabPanel>

          <TabPanel p={0}>
            <Stack spacing={{ base: 2, md: 4 }} mb={{ base: 2, md: 4 }}>
              <Flex
                direction={{ base: "column", md: "row" }}
                align={{ base: "stretch", md: "center" }}
                justify="space-between"
                gap={{ base: 2, md: 4 }}
              >
                <Input
                  placeholder="Tìm kiếm admin..."
                  value={searchTerm}
                  onChange={handleSearch}
                  leftIcon={<Search size={20} />}
                  variant="outline"
                  borderColor="var(--primary-color)"
                  _hover={{ borderColor: "var(---hover-color)" }}
                  _focus={{
                    borderColor: "var(--primary-color)",
                    boxShadow: "0 0 0 1px var(--primary-color)",
                  }}
                  color="black"
                  size={{ base: "sm", md: "md" }}
                  _dark={{ color: "white", _placeholder: { color: "white" } }}
                  flex={{ base: "1", md: "0 1 50%" }}
                />
                <HStack spacing={2} flexShrink={0} justify={{ base: "center", md: "flex-end" }}>
                  <Button
                    leftIcon={<Plus size={16} />}
                    colorScheme="blue"
                    size={{ base: "sm", md: "md" }}
                    onClick={onAddOpen}
                  >
                    Thêm admin
                  </Button>
                  <Text fontSize={{ base: "sm", md: "md" }} whiteSpace="nowrap" color="gray.600" _dark={{ color: "gray.300" }}>
                    Hiển thị:
                  </Text>
                  <Select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    size={{ base: "sm", md: "md" }}
                    w={{ base: "100px", md: "120px" }}
                    borderColor="gray.300"
                    color="gray.600"
                    _dark={{ borderColor: "gray.600", color: "white", bg: "gray.700" }}
                    sx={{
                      option: {
                        bg: "white",
                        color: "gray.600",
                        _dark: { bg: "gray.700", color: "white" },
                      },
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </Select>
                  <Text fontSize={{ base: "sm", md: "md" }} whiteSpace="nowrap" color="gray.600" _dark={{ color: "gray.300" }}>
                    admin/trang
                  </Text>
                </HStack>
              </Flex>
            </Stack>

            <Box overflowX={{ base: "auto", md: "visible" }} display={{ base: "block", md: "block" }}>
              {isLoadingAdmins ? (
                <Text textAlign="center" py={4}>Đang tải danh sách admin...</Text>
              ) : (
                <>
                  <Table variant="simple" size={{ base: "sm", md: "md" }} display={{ base: "none", md: "table" }}>
                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>Họ</Th>
                        <Th>Tên</Th>
                        <Th>Email</Th>
                        <Th>Số điện thoại</Th>
                        <Th>Tên đăng nhập</Th>
                        <Th>Vai trò</Th>
                        <Th>Ngày tạo</Th>
                        <Th>Thao tác</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {currentAdmins.map((admin) => (
                        <Tr key={admin.id}>
                          <Td>{admin.id || "N/A"}</Td>
                          <Td>{admin.lastName || "N/A"}</Td>
                          <Td>{admin.firstName || "N/A"}</Td>
                          <Td>{admin.email || "N/A"}</Td>
                          <Td>{admin.phone || "N/A"}</Td>
                          <Td>{admin.username || "N/A"}</Td>
                          <Td>{getRoleLabel(admin.adminRoles)}</Td>
                          <Td>{admin.createdAt ? new Date(admin.createdAt).toLocaleString() : "N/A"}</Td>
                          <Td>
                            <Flex align="center" gap={2}>
                              <IconButton
                                icon={<Edit2 size={{ base: 16, md: 18 }} />}
                                aria-label="Sửa admin"
                                onClick={() => handleEditOpen(admin)}
                                variant="outline"
                                size={{ base: "xs", md: "sm" }}
                              />
                              <IconButton
                                icon={<Trash2 size={{ base: 16, md: 18 }} />}
                                aria-label="Xóa admin"
                                onClick={() => handleDeleteOpen(admin.id)}
                                variant="outline"
                                size={{ base: "xs", md: "sm" }}
                              />
                            </Flex>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>

                  <VStack spacing={4} align="stretch" display={{ base: "flex", md: "none" }}>
                    {currentAdmins.map((admin) => (
                      <Box key={admin.id} p={3} borderWidth="1px" borderRadius="md" bg="white" _dark={{ bg: "gray.800" }}>
                        <Flex justify="space-between" align="center">
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="bold">ID: {admin.id || "N/A"}</Text>
                            <Text>Họ: {admin.lastName || "N/A"}</Text>
                            <Text>Tên: {admin.firstName || "N/A"}</Text>
                            <Text fontSize="sm">Email: {admin.email || "N/A"}</Text>
                            <Text fontSize="sm">Số điện thoại: {admin.phone || "N/A"}</Text>
                            <Text fontSize="sm">Tên đăng nhập: {admin.username || "N/A"}</Text>
                            <Text fontSize="sm">Vai trò: {getRoleLabel(admin.adminRoles)}</Text>
                            <Text fontSize="sm">Ngày tạo: {admin.createdAt ? new Date(admin.createdAt).toLocaleString() : "N/A"}</Text>
                          </VStack>
                          <VStack spacing={2}>
                            <IconButton
                              icon={<Edit2 size={16} />}
                              aria-label="Sửa admin"
                              onClick={() => handleEditOpen(admin)}
                              variant="outline"
                              size="xs"
                            />
                            <IconButton
                              icon={<Trash2 size={16} />}
                              aria-label="Xóa admin"
                              onClick={() => handleDeleteOpen(admin.id)}
                              variant="outline"
                              size="xs"
                            />
                          </VStack>
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                </>
              )}
            </Box>

            {filteredAdmins.length > 0 && !isLoadingAdmins && (
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
                    onClick={handlePrevPageAdmins}
                    isDisabled={currentPageAdmins === 1}
                    aria-label="Trang trước"
                    variant="outline"
                    size={{ base: "xs", md: "sm" }}
                  />
                  <Text fontSize={{ base: "sm", md: "md" }}>
                    Trang {currentPageAdmins} / {totalPagesAdmins}
                  </Text>
                  <IconButton
                    icon={<ChevronRight size={{ base: 16, md: 20 }} />}
                    onClick={handleNextPageAdmins}
                    isDisabled={currentPageAdmins === totalPagesAdmins}
                    aria-label="Trang sau"
                    variant="outline"
                    size={{ base: "xs", md: "sm" }}
                  />
                </HStack>
                <Text fontSize={{ base: "sm", md: "md" }}>
                  Tổng: {filteredAdmins.length} admin
                </Text>
              </Flex>
            )}
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
              Bạn có chắc muốn xóa người dùng này không? Hành động này không thể hoàn tác.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onDeleteClose} variant="ghost">
                Hủy
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3} variant="solid">
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <EditAdmin isOpen={isEditOpen} onClose={onEditClose} admin={adminToEdit} onEditSuccess={handleEditSuccess} />

      <AddAdmin isOpen={isAddOpen} onClose={onAddClose} onAddSuccess={handleAddSuccess} />

      <Modal isOpen={isDetailOpen} onClose={onDetailClose}>
        <ModalOverlay />
        <ModalContent maxW="800px">
          <ModalHeader>Chi tiết khách hàng</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedUser && (
              <VStack spacing={4} align="stretch">
                <Flex wrap="wrap" gap={4}>
                  <FormControl flex="1" minW="150px">
                    <FormLabel>ID</FormLabel>
                    <Input value={selectedUser.id || "N/A"} isReadOnly />
                  </FormControl>
                  <FormControl flex="1" minW="150px">
                    <FormLabel>Họ</FormLabel>
                    <Input value={selectedUser.lastName || "N/A"} isReadOnly />
                  </FormControl>
                  <FormControl flex="1" minW="150px">
                    <FormLabel>Tên</FormLabel>
                    <Input value={selectedUser.firstName || "N/A"} isReadOnly />
                  </FormControl>
                  <FormControl flex="1" minW="150px">
                    <FormLabel>Trạng thái</FormLabel>
                    <Input value={selectedUser.isActive ? "Hoạt động" : "Không hoạt động"} isReadOnly />
                  </FormControl>
                </Flex>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input value={selectedUser.email || "N/A"} isReadOnly />
                </FormControl>

                <Flex wrap="wrap" gap={4}>
                  <FormControl flex="1" minW="200px">
                    <FormLabel>Số điện thoại</FormLabel>
                    <Input value={selectedUser.phone || "N/A"} isReadOnly />
                  </FormControl>
                  <FormControl flex="1" minW="200px">
                    <FormLabel>Tên đăng nhập</FormLabel>
                    <Input value={selectedUser.username || "N/A"} isReadOnly />
                  </FormControl>
                  <FormControl flex="1" minW="200px">
                    <FormLabel>Vai trò</FormLabel>
                    <Input
                      value={selectedUser.role === "admin" ? getRoleLabel(selectedUser.adminRoles) : selectedUser.role || "N/A"}
                      isReadOnly
                    />
                  </FormControl>
                </Flex>

                <Flex wrap="wrap" gap={4}>
                  <FormControl flex="1" minW="300px">
                    <FormLabel>Ngày tạo</FormLabel>
                    <Input value={selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : "N/A"} isReadOnly />
                  </FormControl>
                  <FormControl flex="1" minW="300px">
                    <FormLabel>Ngày cập nhật</FormLabel>
                    <Input value={selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleString() : "N/A"} isReadOnly />
                  </FormControl>
                </Flex>

                <Text fontWeight="bold" mt={4}>Địa chỉ</Text>
                {selectedUser.address ? (
                  <VStack align="stretch" spacing={4}>
                    <Flex wrap="wrap" gap={4}>
                      <FormControl flex="1" minW="300px">
                        <FormLabel>Số nhà và đường</FormLabel>
                        <Input value={selectedUser.address.street || "N/A"} isReadOnly />
                      </FormControl>
                      <FormControl flex="1" minW="300px">
                        <FormLabel>Phường/xã</FormLabel>
                        <Input value={selectedUser.address.ward || "N/A"} isReadOnly />
                      </FormControl>
                    </Flex>
                    <Flex wrap="wrap" gap={4}>
                      <FormControl flex="1" minW="200px">
                        <FormLabel>Quận/huyện</FormLabel>
                        <Input value={selectedUser.address.district || "N/A"} isReadOnly />
                      </FormControl>
                      <FormControl flex="1" minW="200px">
                        <FormLabel>Thành phố/tỉnh</FormLabel>
                        <Input value={selectedUser.address.city || "N/A"} isReadOnly />
                      </FormControl>
                      <FormControl flex="1" minW="200px">
                        <FormLabel>Quốc gia</FormLabel>
                        <Input value={selectedUser.address.country || "N/A"} isReadOnly />
                      </FormControl>
                    </Flex>
                  </VStack>
                ) : (
                  <Text>Không có thông tin địa chỉ</Text>
                )}

                <Text fontWeight="bold" mt={4}>Thông tin Google</Text>
                {selectedUser.google ? (
                  <VStack align="stretch" spacing={4}>
                    <Flex wrap="wrap" gap={4}>
                      <FormControl flex="1" minW="300px">
                        <FormLabel>Google ID</FormLabel>
                        <Input value={selectedUser.google.googleId || "N/A"} isReadOnly />
                      </FormControl>
                      <FormControl flex="1" minW="300px">
                        <FormLabel>Email đã xác minh</FormLabel>
                        <Input value={selectedUser.google.emailVerified ? "Có" : "Không"} isReadOnly />
                      </FormControl>
                    </Flex>
                    <FormControl>
                      <FormLabel>ID Token</FormLabel>
                      <Input value={selectedUser.google.idToken || "N/A"} isReadOnly />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Access Token</FormLabel>
                      <Input value={selectedUser.google.accessToken || "N/A"} isReadOnly />
                    </FormControl>
                  </VStack>
                ) : (
                  <Text>Không có thông tin Google</Text>
                )}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserManagement;