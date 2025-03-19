// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from "react";
// import axiosInstance from "../../../Api/axiosInstance";
// import {
//   Box,
//   IconButton,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Tabs,
//   TabList,
//   TabPanels,
//   Tab,
//   TabPanel,
//   useToast,
//   Image,
//   AlertDialog,
//   AlertDialogBody,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogContent,
//   AlertDialogOverlay,
//   Button,
//   Input,
//   Stack,
//   Flex,
//   HStack,
//   VStack,
//   Text,
// } from "@chakra-ui/react";
// import { Trash2, Edit2, Search, ChevronLeft, ChevronRight, Plus } from "react-feather";
// import AddCoupon from "./AddCoupon"; // Tạo file AddCoupon.js sau
// import EditCoupon from "./EditCoupon"; // Tạo file EditCoupon.js sau
// import { useDisclosure } from "@chakra-ui/react";

// const CouponManagement = () => {
//   const [coupons, setCoupons] = useState([]);
//   const [activeTab, setActiveTab] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(5);
//   const toast = useToast();

//   const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
//   const [couponIdToDelete, setCouponIdToDelete] = useState(null);

//   const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
//   const [couponToEdit, setCouponToEdit] = useState(null);

//   useEffect(() => {
//     fetchCoupons();
//   }, []);

//   // Hàm fetchCoupons: Lấy danh sách coupon từ API, hỗ trợ tìm kiếm theo code
//   const fetchCoupons = async (search = "") => {
//     try {
//       const response = await axiosInstance.get(
//         `/api/coupons/manage${search ? `/search?code=${encodeURIComponent(search)}` : ""}`
//       );
//       setCoupons(response.data);
//       setCurrentPage(1);
//     } catch (error) {
//       toast({
//         title: "Lỗi",
//         description: "Không thể tải danh sách mã giảm giá.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   // Hàm handleSearch: Xử lý sự kiện nhập từ khóa tìm kiếm
//   const handleSearch = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     fetchCoupons(value);
//   };

//   const handleDeleteOpen = (id) => {
//     setCouponIdToDelete(id);
//     onDeleteOpen();
//   };

//   const handleDeleteConfirm = async () => {
//     if (couponIdToDelete) {
//       try {
//         await axiosInstance.delete(`/api/coupons/manage/${couponIdToDelete}`);
//         setCoupons(coupons.filter((coupon) => coupon.id !== couponIdToDelete));
//         toast({
//           title: "Thành công",
//           description: "Đã xóa mã giảm giá.",
//           status: "success",
//           duration: 3000,
//           isClosable: true,
//           position: "top-right",
//         });
//         if (paginatedCoupons.length === 1 && currentPage > 1) {
//           setCurrentPage(currentPage - 1);
//         }
//       } catch (error) {
//         toast({
//           title: "Lỗi",
//           description: "Không thể xóa mã giảm giá.",
//           status: "error",
//           duration: 3000,
//           isClosable: true,
//           position: "top-right",
//         });
//       } finally {
//         onDeleteClose();
//         setCouponIdToDelete(null);
//       }
//     }
//   };

//   const handleEditOpen = (coupon) => {
//     setCouponToEdit(coupon);
//     onEditOpen();
//   };

//   const handleAddSuccess = (newCouponData) => {
//     setCoupons([...coupons, newCouponData]);
//     setActiveTab(0);
//   };

//   const handleEditSuccess = (updatedCoupon) => {
//     setCoupons(coupons.map((coupon) => (coupon.id === updatedCoupon.id ? updatedCoupon : coupon)));
//     onEditClose();
//   };

//   // Logic phân trang
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const paginatedCoupons = coupons.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(coupons.length / itemsPerPage);

//   // Hàm handleNextPage: Chuyển sang trang tiếp theo nếu chưa đến trang cuối
//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   // Hàm handlePrevPage: Quay lại trang trước nếu không phải trang đầu
//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <Box
//       p={{ base: 1, md: 4 }}
//       mx="auto"
//       maxW={{ base: "100%", md: "100%" }}
//       w="100%"
//       overflowX="hidden"
//     >
//       <Tabs index={activeTab} onChange={(index) => setActiveTab(index)}>
//         <TabList
//           mb={{ base: 2, md: 4 }}
//           overflowX={{ base: "auto", md: "visible" }}
//           whiteSpace="nowrap"
//           sx={{
//             "::-webkit-scrollbar": {
//               display: "none",
//             },
//             "-ms-overflow-style": "none",
//             "scrollbar-width": "none",
//           }}
//         >
//           <Tab fontSize={{ base: "sm", md: "md" }}>Danh sách mã giảm giá</Tab>
//           <Tab fontSize={{ base: "sm", md: "md" }}>Thêm mã giảm giá</Tab>
//         </TabList>

//         <TabPanels>
//           <TabPanel p={0}>
//             <Stack spacing={{ base: 2, md: 4 }} mb={{ base: 2, md: 4 }}>
//               <Input
//                 placeholder="Tìm kiếm mã giảm giá..."
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 leftIcon={<Search size={20} />}
//                 variant="outline"
//                 borderColor="var(--primary-color)"
//                 _hover={{ borderColor: "var(--hover-color)" }}
//                 _focus={{
//                   borderColor: "var(--primary-color)",
//                   boxShadow: "0 0 0 1px var(--primary-color)",
//                 }}
//                 color="black"
//                 size={{ base: "sm", md: "md" }}
//                 _dark={{
//                   color: "white",
//                   _placeholder: { color: "white" },
//                 }}
//               />
//             </Stack>

//             <Box
//               overflowX={{ base: "auto", md: "visible" }}
//               display={{ base: "block", md: "block" }}
//               w="100%"
//             >
//               <Table
//                 variant="simple"
//                 size={{ base: "sm", md: "md" }}
//                 display={{ base: "none", md: "table" }}
//                 w="100%"
//               >
//                 <Thead>
//                   <Tr>
//                     <Th>ID</Th>
//                     <Th>Mã</Th>
//                     <Th>Tỷ lệ giảm (%)</Th>
//                     <Th>Ngày bắt đầu</Th>
//                     <Th>Ngày kết thúc</Th>
//                     <Th>Số lần tối đa</Th>
//                     <Th>Số lần đã dùng</Th>
//                     <Th>Trạng thái</Th>
//                     <Th>Áp dụng cho sản phẩm giảm giá</Th>
//                     <Th>Thao tác</Th>
//                   </Tr>
//                 </Thead>
//                 <Tbody>
//                   {paginatedCoupons.map((coupon) => (
//                     <Tr key={coupon.id}>
//                       <Td>{coupon.id}</Td>
//                       <Td>{coupon.code}</Td>
//                       <Td>{coupon.discountRate}%</Td>
//                       <Td>{new Date(coupon.startDate).toLocaleDateString()}</Td>
//                       <Td>{new Date(coupon.endDate).toLocaleDateString()}</Td>
//                       <Td>{coupon.maxUses}</Td>
//                       <Td>{coupon.usedCount}</Td>
//                       <Td>{coupon.status}</Td>
//                       <Td>{coupon.applicableToDiscountedProducts ? "Có" : "Không"}</Td>
//                       <Td>
//                         <Flex align="center" gap={2}>
//                           <IconButton
//                             icon={<Edit2 size={{ base: 16, md: 18 }} />}
//                             aria-label="Sửa mã giảm giá"
//                             onClick={() => handleEditOpen(coupon)}
//                             colorScheme="blue"
//                             variant="outline"
//                             size={{ base: "xs", md: "sm" }}
//                           />
//                           <IconButton
//                             icon={<Trash2 size={{ base: 16, md: 18 }} />}
//                             aria-label="Xóa mã giảm giá"
//                             onClick={() => handleDeleteOpen(coupon.id)}
//                             colorScheme="red"
//                             variant="outline"
//                             size={{ base: "xs", md: "sm" }}
//                           />
//                         </Flex>
//                       </Td>
//                     </Tr>
//                   ))}
//                 </Tbody>
//               </Table>

//               <VStack
//                 spacing={4}
//                 align="stretch"
//                 display={{ base: "flex", md: "none" }}
//                 w="100%"
//               >
//                 {paginatedCoupons.map((coupon) => (
//                   <Box
//                     key={coupon.id}
//                     p={3}
//                     borderWidth="1px"
//                     borderRadius="md"
//                     bg="white"
//                     _dark={{ bg: "gray.800" }}
//                     w="100%"
//                   >
//                     <Flex justify="space-between" align="center">
//                       <VStack align="start" spacing={1}>
//                         <Text fontWeight="bold">ID: {coupon.id}</Text>
//                         <Text>Mã: {coupon.code}</Text>
//                         <Text fontSize="sm">Tỷ lệ giảm: {coupon.discountRate}%</Text>
//                         <Text fontSize="sm">Ngày bắt đầu: {new Date(coupon.startDate).toLocaleDateString()}</Text>
//                         <Text fontSize="sm">Ngày kết thúc: {new Date(coupon.endDate).toLocaleDateString()}</Text>
//                         <Text fontSize="sm">Số lần tối đa: {coupon.maxUses}</Text>
//                         <Text fontSize="sm">Số lần đã dùng: {coupon.usedCount}</Text>
//                         <Text fontSize="sm">Trạng thái: {coupon.status}</Text>
//                         <Text fontSize="sm">Áp dụng cho sản phẩm giảm giá: {coupon.applicableToDiscountedProducts ? "Có" : "Không"}</Text>
//                       </VStack>
//                       <VStack spacing={2}>
//                         <IconButton
//                           icon={<Edit2 size={{ base: 16, md: 18 }} />}
//                           aria-label="Sửa mã giảm giá"
//                           onClick={() => handleEditOpen(coupon)}
                        
//                           variant="outline"
                         
//                         />
//                         <IconButton
//                           icon={<Trash2 size={{ base: 16, md: 18 }} />}
//                           aria-label="Xóa mã giảm giá"
//                           onClick={() => handleDeleteOpen(coupon.id)}
                         
//                           variant="outline"
                          
//                         />
//                       </VStack>
//                     </Flex>
//                   </Box>
//                 ))}
//               </VStack>
//             </Box>

//             <Flex
//               direction={{ base: "column", md: "row" }}
//               justify={{ base: "center", md: "space-between" }}
//               align="center"
//               mt={{ base: 3, md: 4 }}
//               gap={{ base: 2, md: 0 }}
//               w="100%"
//             >
//               <HStack spacing={{ base: 1, md: 2 }}>
//                 <IconButton
//                   icon={<ChevronLeft size={{ base: 16, md: 20 }} />}
//                   onClick={handlePrevPage}
//                   isDisabled={currentPage === 1}
//                   aria-label="Trang trước"
//                   variant="outline"
//                   size={{ base: "xs", md: "sm" }}
//                 />
//                 <Text fontSize={{ base: "sm", md: "md" }}>
//                   Trang {currentPage} / {totalPages}
//                 </Text>
//                 <IconButton
//                   icon={<ChevronRight size={{ base: 16, md: 20 }} />}
//                   onClick={handleNextPage}
//                   isDisabled={currentPage === totalPages}
//                   aria-label="Trang sau"
//                   variant="outline"
//                   size={{ base: "xs", md: "sm" }}
//                 />
//               </HStack>
//               <Text fontSize={{ base: "sm", md: "md" }}>
//                 Tổng: {coupons.length} mã giảm giá
//               </Text>
//             </Flex>
//           </TabPanel>

//           <TabPanel>
//             <AddCoupon onAddSuccess={handleAddSuccess} />
//           </TabPanel>
//         </TabPanels>
//       </Tabs>

//       <AlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose} leastDestructiveRef={undefined}>
//         <AlertDialogOverlay>
//           <AlertDialogContent>
//             <AlertDialogHeader fontSize="lg" fontWeight="bold">
//               Xác nhận xóa
//             </AlertDialogHeader>
//             <AlertDialogBody>
//               Bạn có chắc muốn xóa mã giảm giá này không? Hành động này không thể hoàn tác.
//             </AlertDialogBody>
//             <AlertDialogFooter>
//               <Button onClick={onDeleteClose} variant="ghost">
//                 Hủy
//               </Button>
//               <Button
//                 colorScheme="red"
//                 onClick={handleDeleteConfirm}
//                 ml={3}
//                 variant="solid"
//               >
//                 Xóa
//               </Button>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialogOverlay>
//       </AlertDialog>

//       <EditCoupon
//         isOpen={isEditOpen}
//         onClose={onEditClose}
//         coupon={couponToEdit}
//         onEditSuccess={handleEditSuccess}
//       />
//     </Box>
//   );
// };

// export default CouponManagement;
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
} from "@chakra-ui/react";
import { Trash2, Edit2, Search, ChevronLeft, ChevronRight, Plus } from "react-feather";
import AddCoupon from "./AddCoupon";
import EditCoupon from "./EditCoupon";
import { useDisclosure } from "@chakra-ui/react";

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const toast = useToast();

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [couponIdToDelete, setCouponIdToDelete] = useState(null);

  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [couponToEdit, setCouponToEdit] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Hàm fetchCoupons: Lấy danh sách coupon từ API, hỗ trợ tìm kiếm theo code
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

  // Hàm handleSearch: Xử lý sự kiện nhập từ khóa tìm kiếm
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchCoupons(value);
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

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedCoupons = coupons.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(coupons.length / itemsPerPage);

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
            "::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          }}
        >
          <Tab fontSize={{ base: "sm", md: "md" }}>Danh sách mã giảm giá</Tab>
          <Tab fontSize={{ base: "sm", md: "md" }}>Thêm mã giảm giá</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <Stack spacing={{ base: 2, md: 4 }} mb={{ base: 2, md: 4 }}>
              <Input
                placeholder="Tìm kiếm mã giảm giá..."
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
              />
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
                    <Th>ID</Th>
                    <Th>Mã</Th>
                    <Th>Tỷ lệ giảm (%)</Th>
                    <Th>Ngày bắt đầu</Th>
                    <Th>Ngày kết thúc</Th>
                    <Th>Số lần tối đa</Th>
                    <Th>Số lần đã dùng</Th>
                    <Th>Trạng thái</Th>
                    <Th>Áp dụng cho sản phẩm giảm giá</Th>
                    <Th>Người dùng đã sử dụng</Th>
                    <Th>Thao tác</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedCoupons.map((coupon) => (
                    <Tr key={coupon.id}>
                      <Td>{coupon.id}</Td>
                      <Td>{coupon.code}</Td>
                      <Td>{coupon.discountRate}%</Td>
                      <Td>{new Date(coupon.startDate).toLocaleDateString()}</Td>
                      <Td>{new Date(coupon.endDate).toLocaleDateString()}</Td>
                      <Td>{coupon.maxUses}</Td>
                      <Td>{coupon.usedCount}</Td>
                      <Td>{coupon.status}</Td>
                      <Td>{coupon.applicableToDiscountedProducts ? "Có" : "Không"}</Td>
                      <Td>{coupon.usedByUsers || "Chưa có"}</Td>
                      <Td>
                        <Flex align="center" gap={2}>
                          <IconButton
                            icon={<Edit2 size={{ base: 16, md: 18 }} />}
                            aria-label="Sửa mã giảm giá"
                            onClick={() => handleEditOpen(coupon)}
                            colorScheme="blue"
                            variant="outline"
                            size={{ base: "xs", md: "sm" }}
                          />
                          <IconButton
                            icon={<Trash2 size={{ base: 16, md: 18 }} />}
                            aria-label="Xóa mã giảm giá"
                            onClick={() => handleDeleteOpen(coupon.id)}
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

              <VStack
                spacing={4}
                align="stretch"
                display={{ base: "flex", md: "none" }}
                w="100%"
              >
                {paginatedCoupons.map((coupon) => (
                  <Box
                    key={coupon.id}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    bg="white"
                    _dark={{ bg: "gray.800" }}
                    w="100%"
                  >
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">ID: {coupon.id}</Text>
                        <Text>Mã: {coupon.code}</Text>
                        <Text fontSize="sm">Tỷ lệ giảm: {coupon.discountRate}%</Text>
                        <Text fontSize="sm">Ngày bắt đầu: {new Date(coupon.startDate).toLocaleDateString()}</Text>
                        <Text fontSize="sm">Ngày kết thúc: {new Date(coupon.endDate).toLocaleDateString()}</Text>
                        <Text fontSize="sm">Số lần tối đa: {coupon.maxUses}</Text>
                        <Text fontSize="sm">Số lần đã dùng: {coupon.usedCount}</Text>
                        <Text fontSize="sm">Trạng thái: {coupon.status}</Text>
                        <Text fontSize="sm">Áp dụng cho sản phẩm giảm giá: {coupon.applicableToDiscountedProducts ? "Có" : "Không"}</Text>
                        <Text fontSize="sm">Người dùng đã sử dụng: {coupon.usedByUsers || "Chưa có"}</Text>
                      </VStack>
                      <VStack spacing={2}>
                        <IconButton
                          icon={<Edit2 size={{ base: 16, md: 18 }} />}
                          aria-label="Sửa mã giảm giá"
                          onClick={() => handleEditOpen(coupon)}
                          variant="outline"
                        />
                        <IconButton
                          icon={<Trash2 size={{ base: 16, md: 18 }} />}
                          aria-label="Xóa mã giảm giá"
                          onClick={() => handleDeleteOpen(coupon.id)}
                          variant="outline"
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
                Tổng: {coupons.length} mã giảm giá
              </Text>
            </Flex>
          </TabPanel>

          <TabPanel>
            <AddCoupon onAddSuccess={handleAddSuccess} />
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
              Bạn có chắc muốn xóa mã giảm giá này không? Hành động này không thể hoàn tác.
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

      <EditCoupon
        isOpen={isEditOpen}
        onClose={onEditClose}
        coupon={couponToEdit}
        onEditSuccess={handleEditSuccess}
      />
    </Box>
  );
};

export default CouponManagement;