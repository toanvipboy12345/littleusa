import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../../context/UserContext"; // Đảm bảo đường dẫn đúng
import axiosInstance from "../../../../Api/axiosInstance"; // Để gọi API
import vietnamProvinces from "../../../../data/vietnam-provinces.json"; // Import trực tiếp
import {
  Box,
  Text,
  VStack,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Order from "./Order/Order"; // Import Order từ file Order.jsx

const Account = () => {
  const { user, setUser } = useContext(UserContext); // Lấy user và setUser từ context
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: "",
    country: "",
    district: "",
    ward: "",
    street: user?.address?.street || "",
  });
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái gửi form
  const [provinces, setProvinces] = useState([]); // Danh sách tỉnh/thành
  const [districts, setDistricts] = useState([]); // Danh sách quận/huyện
  const [wards, setWards] = useState([]); // Danh sách phường/xã
  const toast = useToast();

  // Load dữ liệu từ vietnam-provinces.json khi component mount
  useEffect(() => {
    setProvinces(vietnamProvinces); // Gán trực tiếp dữ liệu từ import
    // Khởi tạo giá trị địa chỉ từ user.address nếu có
    if (user?.address) {
      const { city, country, district, ward, street } = user.address;
      setFormData((prev) => ({
        ...prev,
        city: city || "",
        country: country || "",
        district: district || "",
        ward: ward || "",
        street: street || "",
      }));
    }
  }, [user]);

  // Cập nhật districts khi chọn province
  const handleProvinceChange = (e) => {
    const selectedProvince = provinces.find((p) => p.name === e.target.value);
    setDistricts(selectedProvince?.districts || []);
    setFormData((prev) => ({
      ...prev,
      city: selectedProvince?.name || "",
      country: "",
      district: "",
      ward: "",
    }));
  };

  // Cập nhật wards khi chọn district
  const handleDistrictChange = (e) => {
    const selectedDistrict = districts.find((d) => d.name === e.target.value);
    setWards(selectedDistrict?.wards || []);
    setFormData((prev) => ({
      ...prev,
      district: selectedDistrict?.name || "",
      ward: "",
    }));
  };

  // Cập nhật ward khi chọn
  const handleWardChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      ward: e.target.value,
    }));
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Bật chế độ chỉnh sửa
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Hủy chỉnh sửa, quay lại dữ liệu ban đầu
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      city: user?.address?.city || "",
      country: user?.address?.country || "",
      district: user?.address?.district || "",
      ward: user?.address?.ward || "",
      street: user?.address?.street || "",
    });
    setDistricts(
      provinces.find((p) => p.name === user?.address?.city)?.districts || []
    );
    setWards(
      provinces
        .find((p) => p.name === user?.address?.city)
        ?.districts.find((d) => d.name === user?.address?.district)?.wards || []
    );
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Chuẩn bị địa chỉ dưới dạng object
    const updatedAddress = {
      city: formData.city,
      country: formData.country,
      district: formData.district,
      ward: formData.ward,
      street: formData.street,
    };

    try {
      const response = await axiosInstance.put(`/user/${user.id}`, {
        ...formData,
        address: updatedAddress,
      });
      const updatedUser = response.data;

      // Cập nhật user trong context và localStorage
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast({
        title: "Thành công",
        description: "Thông tin tài khoản đã được cập nhật.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsEditing(false); // Tắt chế độ chỉnh sửa sau khi cập nhật thành công
    } catch {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin tài khoản.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm xác định label dựa trên giá trị hiện tại
  const getAddressLabel = (level, value) => {
    if (!value) return level === "city" ? "Thành phố/Tỉnh" : level === "district" ? "Quận/Huyện" : "Phường/Xã";
    if (level === "city") {
      if (value.startsWith("Tỉnh")) return "Tỉnh";
      if (value.startsWith("Thành phố")) return "Thành phố";
    }
    if (level === "district") {
      if (value.startsWith("Huyện")) return "Huyện";
      if (value.startsWith("Quận")) return "Quận";
    }
    if (level === "ward") {
      if (value.startsWith("Phường")) return "Phường";
      if (value.startsWith("Xã")) return "Xã";
    }
    return level === "city" ? "Thành phố/Tỉnh" : level === "district" ? "Quận/Huyện" : "Phường/Xã";
  };

  // Lấy ngày tạo tài khoản, xử lý trường hợp null
  const getCreatedAt = () => {
    if (!user || !user.createdAt) return "Chưa có thông tin";
    return new Date(user.createdAt).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Box
      py={{ base: 6, md: 12, lg: 20 }}
      px={{ base: 2, md: 4, lg: 12 }}
      mx="auto"
      w={{ base: "95%", md: "90%", lg: "70%" }}
    >
      <Tabs isLazy>
        <TabList>
          <Tab>Thông tin tài khoản</Tab>
          <Tab>Phần đơn hàng của bạn</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={6} align="stretch">
              {/* Tiêu đề */}


              {/* Form thông tin cá nhân */}
              <Box
                p={6}
                borderWidth="1px"
                bg="white"
                _dark={{ bg: "gray.800" }}
                boxShadow="sm"
              >
                <form onSubmit={handleSubmit}>
                  <VStack align="stretch" spacing={4}>
                    {/* Tên */}
                    <FormControl>
                      <FormLabel>Họ và tên</FormLabel>
                      <Flex gap={2}>
                        <Input
                          border="1px solid var(--primary-color)"
                          color="black"
                          borderRadius="0"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Họ"
                          readOnly={!isEditing}
                          bg={isEditing ? "white" : "gray.100"}
                        />
                        <Input
                          border="1px solid var(--primary-color)"
                          color="black"
                          borderRadius="0"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Tên"
                          readOnly={!isEditing}
                          bg={isEditing ? "white" : "gray.100"}
                        />
                      </Flex>
                    </FormControl>

                    {/* Email */}
                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input
                        border="1px solid var(--primary-color)"
                        color="black"
                        borderRadius="0"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        readOnly={!isEditing}
                        bg={isEditing ? "white" : "gray.100"}
                      />
                    </FormControl>

                    {/* Số điện thoại */}
                    <FormControl>
                      <FormLabel>Số điện thoại</FormLabel>
                      <Input
                        border="1px solid var(--primary-color)"
                        color="black"
                        borderRadius="0"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Số điện thoại"
                        readOnly={!isEditing}
                        bg={isEditing ? "white" : "gray.100"}
                      />
                    </FormControl>

                    {/* Địa chỉ */}
                    <FormControl>
                      <FormLabel>Địa chỉ</FormLabel>
                      <Flex gap={2}>
                        <Box flex="1">
                          <FormLabel>{getAddressLabel("city", formData.city)}</FormLabel>
                          <Select
                            border="1px solid var(--primary-color)"
                            color="black"
                            borderRadius="0"
                            value={formData.city}
                            onChange={handleProvinceChange}
                            placeholder="Chọn thành phố/tỉnh"
                            isDisabled={!isEditing}
                            bg={isEditing ? "white" : "gray.100"}
                          >
                            {provinces.map((province) => (
                              <option key={province.name} value={province.name}>
                                {province.name}
                              </option>
                            ))}
                          </Select>
                        </Box>
                        <Box flex="1">
                          <FormLabel>{getAddressLabel("district", formData.district)}</FormLabel>
                          <Select
                            border="1px solid var(--primary-color)"
                            color="black"
                            borderRadius="0"
                            value={formData.district}
                            onChange={handleDistrictChange}
                            placeholder="Chọn quận/huyện"
                            isDisabled={!isEditing || !formData.city}
                            bg={isEditing && formData.city ? "white" : "gray.100"}
                          >
                            {districts.map((district) => (
                              <option key={district.name} value={district.name}>
                                {district.name}
                              </option>
                            ))}
                          </Select>
                        </Box>
                        <Box flex="1">
                          <FormLabel>{getAddressLabel("ward", formData.ward)}</FormLabel>
                          <Select
                            border="1px solid var(--primary-color)"
                            color="black"
                            borderRadius="0"
                            value={formData.ward}
                            onChange={handleWardChange}
                            placeholder="Chọn phường/xã"
                            isDisabled={!isEditing || !formData.district}
                            bg={isEditing && formData.district ? "white" : "gray.100"}
                          >
                            {wards.map((ward) => (
                              <option key={ward.name} value={ward.name}>
                                {ward.name}
                              </option>
                            ))}
                          </Select>
                        </Box>
                      </Flex>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Đường/Phố</FormLabel>
                      <Input
                        border="1px solid var(--primary-color)"
                        color="black"
                        borderRadius="0"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        placeholder="Tên đường/phố"
                        readOnly={!isEditing}
                        bg={isEditing ? "white" : "gray.100"}
                      />
                    </FormControl>

                    {/* Ngày tạo tài khoản (luôn readOnly) */}
                    <FormControl>
                      <FormLabel>Ngày tạo tài khoản</FormLabel>
                      <Input
                        border="1px solid var(--primary-color)"
                        color="black"
                        borderRadius="0"
                        value={getCreatedAt()}
                        readOnly
                        bg="gray.100"
                      />
                    </FormControl>

                    {/* Nút điều khiển */}
                    <Flex justify="flex-end" gap={3}>
                      {!isEditing ? (
                        <Button
                          colorScheme="blue"
                          variant="outline"
                          onClick={handleEdit}
                        >
                          Chỉnh sửa
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            onClick={handleCancel}
                            isDisabled={isSubmitting}
                          >
                            Hủy
                          </Button>
                          <Button
                            type="submit"
                            isLoading={isSubmitting}
                            loadingText="Đang cập nhật"
                          >
                            Cập nhật
                          </Button>
                        </>
                      )}
                    </Flex>
                  </VStack>
                </form>
              </Box>
            </VStack>
          </TabPanel>
          <TabPanel>
            <Order />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Account;