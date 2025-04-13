/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Switch,
  useColorMode,
  useToast,
  IconButton,
  Image,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  Textarea,
  Flex,
} from "@chakra-ui/react";
import { Plus, Trash2, Edit } from "react-feather";
import axios from "../../Api/axiosInstance";

const AdminSettings = () => {
  const { colorMode, setColorMode } = useColorMode();
  const toast = useToast();

  // State cho danh sách file banner mới
  const [bannerFiles, setBannerFiles] = useState([]);
  // State cho danh sách banner hiện có
  const [currentBanners, setCurrentBanners] = useState([]);
  // State để theo dõi banner đang được chỉnh sửa
  const [editingBannerIndex, setEditingBannerIndex] = useState(null);
  // State để buộc reload hình ảnh
  const [imageCacheBuster, setImageCacheBuster] = useState(Date.now());
  // State cho modal đổi mật khẩu
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // State cho thông tin About
  const [aboutData, setAboutData] = useState({
    introduction: [],
    contact: { phone: "", email: "", address: "", mapEmbedUrl: "" },
  });
  // State cho logo
  const [logoFile, setLogoFile] = useState(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Lấy danh sách banner hiện có từ server
  const fetchCurrentBanners = async () => {
    try {
      const response = await axios.get("/api/banners");
      setCurrentBanners(response.data);
      setImageCacheBuster(Date.now());
    } catch (error) {
      console.error("Error fetching current banners:", error);
      toast({
        title: "Lỗi khi lấy danh sách banner",
        description: error.customMessage || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  // Lấy thông tin About từ server
  const fetchAboutData = async () => {
    try {
      const response = await axios.get("/api/about");
      setAboutData({
        introduction: response.data.introduction || [],
        contact: response.data.contact || { phone: "", email: "", address: "", mapEmbedUrl: "" },
      });
    } catch (error) {
      console.error("Error fetching about data:", error);
      toast({
        title: "Lỗi khi lấy thông tin About",
        description: error.customMessage || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    fetchCurrentBanners();
    fetchAboutData();
  }, []);

  // Thêm input file mới (banner)
  const addBannerInput = () => {
    setBannerFiles([...bannerFiles, null]);
  };

  // Xóa input file (banner)
  const removeBannerInput = (index) => {
    setBannerFiles(bannerFiles.filter((_, i) => i !== index));
  };

  // Cập nhật file tại index (banner)
  const updateBannerFile = (index, file) => {
    const updatedFiles = [...bannerFiles];
    updatedFiles[index] = file;
    setBannerFiles(updatedFiles);
  };

  // Xử lý xóa banner
  const handleDeleteBanner = async (filename) => {
    try {
      const response = await axios.delete(`/api/delete/banner/${filename}`);
      if (response.data.success) {
        toast({
          title: "Đã xóa banner thành công!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        fetchCurrentBanners();
        const event = new Event("storage");
        window.dispatchEvent(event);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast({
        title: "Lỗi khi xóa banner",
        description: error.customMessage || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  // Xử lý chỉnh sửa banner
  const handleEditBanner = (index) => {
    setEditingBannerIndex(index + 1);
  };

  // Xử lý cập nhật banner
  const handleUpdateBanner = async (index, file) => {
    if (!file) {
      toast({
        title: "Vui lòng chọn một ảnh!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    const formData = new FormData();
    formData.append("banner", file);

    try {
      const response = await axios.post(`/api/update/banner/${index}`, formData);
      if (response.data.success) {
        toast({
          title: "Đã cập nhật banner thành công!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setEditingBannerIndex(null);
        fetchCurrentBanners();
        const event = new Event("storage");
        window.dispatchEvent(event);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast({
        title: "Lỗi khi cập nhật banner",
        description: error.customMessage || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",

      });
    }
  };

  // Xử lý upload banner mới
  const handleSaveBanners = async () => {
    if (bannerFiles.length === 0 || bannerFiles.every((file) => !file)) {
      toast({
        title: "Vui lòng chọn ít nhất một ảnh!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    const formData = new FormData();
    bannerFiles.forEach((file) => {
      if (file) {
        formData.append("banners", file);
      }
    });

    try {
      const response = await axios.post("/api/upload/banners", formData);
      if (response.data.success) {
        toast({
          title: "Đã thêm banner thành công!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setBannerFiles([]);
        fetchCurrentBanners();
        const event = new Event("storage");
        window.dispatchEvent(event);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast({
        title: "Lỗi khi thêm banner",
        description: error.customMessage || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",

      });
    }
  };

  // Xử lý upload logo
  const handleUploadLogo = async () => {
    if (!logoFile) {
      toast({
        title: "Vui lòng chọn một ảnh logo!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setIsUploadingLogo(true);
    const formData = new FormData();
    formData.append("logo", logoFile);

    try {
      const response = await axios.post("/api/upload/logo", formData);
      if (response.data.success) {
        toast({
          title: "Đã cập nhật logo thành công!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setLogoFile(null);
        setImageCacheBuster(Date.now()); // Cập nhật imageCacheBuster để reload logo
        const event = new Event("storage");
        window.dispatchEvent(event);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast({
        title: "Lỗi khi cập nhật logo",
        description: error.customMessage || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Vui lòng điền đầy đủ các trường!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Mật khẩu mới và xác nhận mật khẩu không khớp!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    try {
      const response = await axios.post("/api/change-password", {
        oldPassword,
        newPassword,
      });
      toast({
        title: "Đổi mật khẩu thành công!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setIsPasswordModalOpen(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: "Lỗi khi đổi mật khẩu",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  // Cập nhật state khi thay đổi input About
  const handleAboutChange = (field, value, index = null) => {
    if (field === "introduction") {
      const updatedIntro = [...aboutData.introduction];
      updatedIntro[index] = value;
      setAboutData({ ...aboutData, introduction: updatedIntro });
    } else {
      setAboutData({
        ...aboutData,
        contact: { ...aboutData.contact, [field]: value },
      });
    }
  };

  // Thêm đoạn giới thiệu mới
  const addIntroduction = () => {
    setAboutData({ ...aboutData, introduction: [...aboutData.introduction, ""] });
  };

  // Xóa đoạn giới thiệu
  const removeIntroduction = (index) => {
    setAboutData({
      ...aboutData,
      introduction: aboutData.introduction.filter((_, i) => i !== index),
    });
  };

  // Lưu thông tin About
  const handleSaveAbout = async () => {
    try {
      const response = await axios.post("/api/update/about", aboutData);
      if (response.data.success) {
        toast({
          title: "Đã cập nhật thông tin About thành công!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        fetchAboutData(); // Refresh dữ liệu
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast({
        title: "Lỗi khi cập nhật thông tin About",
        description: error.customMessage || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <Box
      p={4}
      bg="white"
      borderRadius="md"
      boxShadow="sm"
      _dark={{ bg: "gray.800", boxShadow: "md" }}
    >
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Cài đặt
      </Text>

      {/* Cài đặt Giao diện, Bảo mật và Logo trên cùng một hàng */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
        {/* Cài đặt giao diện */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={2}>
            Giao diện
          </Text>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Chế độ tối</FormLabel>
            <Switch
              isChecked={colorMode === "dark"}
              onChange={() => setColorMode(colorMode === "light" ? "dark" : "light")}
            />
          </FormControl>
        </Box>

        {/* Đổi mật khẩu */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={2}>
            Bảo mật
          </Text>
          <Button colorScheme="blue" onClick={() => setIsPasswordModalOpen(true)}>
            Đổi mật khẩu
          </Button>
        </Box>

        {/* Cập nhật Logo */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={2}>
            Cập nhật Logo
          </Text>
          <Flex alignItems="center" gap={4}>
            <Box>
              <Image
                src={`http://localhost:8080/api/uploads/logo.jpeg?t=${imageCacheBuster}`}
                alt="Logo hiện tại"
                maxW="100px"
                maxH="100px"
                objectFit="contain"
                fallbackSrc="https://via.placeholder.com/100?text=Logo"
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="md"
              />
            </Box>
            <Box flex="1">
              <FormControl display="flex" alignItems="center" gap={2}>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                  p={1}
                />
                <Button
                  onClick={handleUploadLogo}
                  isLoading={isUploadingLogo}
                  isDisabled={!logoFile}
                  colorScheme="blue"
                >
                  Upload
                </Button>
              </FormControl>
            </Box>
          </Flex>
        </Box>
      </SimpleGrid>

      {/* Modal đổi mật khẩu */}
      <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Đổi mật khẩu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Mật khẩu cũ</FormLabel>
              <Input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Mật khẩu mới</FormLabel>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Xác nhận mật khẩu mới</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleChangePassword}>
              Lưu
            </Button>
            <Button variant="ghost" onClick={() => setIsPasswordModalOpen(false)}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Hiển thị banner hiện có */}
      <Box mb={6}>
        <Text fontSize="lg" fontWeight="semibold" mb={2}>
          Banner Hiện Có
        </Text>
        {currentBanners.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {currentBanners.map((banner, index) => (
              <Box key={index} borderWidth="1px" overflow="hidden" position="relative">
                <Image
                  src={`http://localhost:8080/api/uploads/${banner}?t=${imageCacheBuster}`}
                  alt={`Banner ${index + 1}`}
                  objectFit="cover"
                  w="100%"
                />
                <Text textAlign="center" p={2}>
                  Banner {index + 1}
                </Text>
                <Box position="absolute" top={2} right={2} display="flex" gap={2}>
                  <IconButton
                    icon={<Edit size={20} />}
                    variant="solid"
                    onClick={() => handleEditBanner(index)}
                    aria-label="Chỉnh sửa banner"
                  />
                  <IconButton
                    icon={<Trash2 size={20} />}
                    variant="solid"
                    onClick={() => handleDeleteBanner(banner)}
                    aria-label="Xóa banner"
                  />
                </Box>
                {editingBannerIndex === index + 1 && (
                  <Box p={2}>
                    <FormControl>
                      <FormLabel>Chọn ảnh mới</FormLabel>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUpdateBanner(index + 1, e.target.files[0])}
                        p={1}
                      />
                    </FormControl>
                  </Box>
                )}
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <Text color="gray.500">Chưa có banner nào.</Text>
        )}
      </Box>

      {/* Cài đặt banner mới */}
      <Box mb={6}>
        <Text fontSize="lg" fontWeight="semibold" mb={2}>
          Banner Trang Chủ
        </Text>
        {bannerFiles.map((file, index) => (
          <Box key={index} mb={4}>
            <FormControl display="flex" alignItems="center" gap={2}>
              <Box flex="1">
                <FormLabel>Ảnh Banner {index + 1}</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => updateBannerFile(index, e.target.files[0])}
                  p={1}
                />
              </Box>
              <IconButton
                icon={<Trash2 size={20} />}
                variant="outline"
                onClick={() => removeBannerInput(index)}
                aria-label="Xóa banner"
                mt={6}
              />
            </FormControl>
          </Box>
        ))}
        <Box display="flex" alignItems="center" gap={4}>
          <Button leftIcon={<Plus size={20} />} variant="solid" onClick={addBannerInput}>
            Thêm Banner
          </Button>
          {bannerFiles.length > 0 && <Button onClick={handleSaveBanners}>Lưu</Button>}
        </Box>
      </Box>

      {/* Cài đặt thông tin About */}
      <Box mb={6}>
        <Text fontSize="lg" fontWeight="semibold" mb={2}>
          Thông tin Giới thiệu & Liên hệ
        </Text>
        <VStack spacing={4} align="start">
          {/* Giới thiệu */}
          <Text fontWeight="medium">Giới thiệu</Text>
          {aboutData.introduction.map((text, index) => (
            <Box key={index} w="100%" display="flex" alignItems="center" gap={2}>
              <Textarea
                value={text}
                onChange={(e) => handleAboutChange("introduction", e.target.value, index)}
                placeholder={`Đoạn giới thiệu ${index + 1}`}
                rows={3}
              />
              <IconButton
                icon={<Trash2 size={20} />}
                variant="outline"
                onClick={() => removeIntroduction(index)}
                aria-label="Xóa đoạn giới thiệu"
              />
            </Box>
          ))}
          <Button leftIcon={<Plus size={20} />} variant="solid" onClick={addIntroduction}>
            Thêm đoạn giới thiệu
          </Button>

          {/* Thông tin liên hệ */}
          <Text fontWeight="medium">Thông tin liên hệ</Text>
          <FormControl>
            <FormLabel>Số điện thoại</FormLabel>
            <Input
              value={aboutData.contact.phone}
              onChange={(e) => handleAboutChange("phone", e.target.value)}
              placeholder="Nhập số điện thoại"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              value={aboutData.contact.email}
              onChange={(e) => handleAboutChange("email", e.target.value)}
              placeholder="Nhập email"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Địa chỉ</FormLabel>
            <Input
              value={aboutData.contact.address}
              onChange={(e) => handleAboutChange("address", e.target.value)}
              placeholder="Nhập địa chỉ"
            />
          </FormControl>
          <FormControl>
            <FormLabel>URL Bản đồ (Google Maps Embed)</FormLabel>
            <Textarea
              value={aboutData.contact.mapEmbedUrl}
              onChange={(e) => handleAboutChange("mapEmbedUrl", e.target.value)}
              placeholder="Dán URL iframe từ Google Maps"
              rows={3}
            />
          </FormControl>
          <Button onClick={handleSaveAbout}>
            Lưu thông tin About
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default AdminSettings;