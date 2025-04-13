import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../../context/UserContext";
import axiosInstance from "../../../../Api/axiosInstance";
import vietnamProvinces from "../../../../data/vietnam-provinces.json";
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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  Heading,
  Tag,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Order from "./Order/Order";

// Component hiển thị danh sách mã giảm giá của người dùng
const MyCoupons = ({ userId }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchUserCoupons = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/coupons/manage`);
      if (Array.isArray(response.data)) {
        setCoupons(response.data);
      } else {
        console.error("API did not return an array:", response.data);
        setCoupons([]);
      }
    } catch (error) {
      console.error("Error fetching user coupons:", error);
      setCoupons([]);
      toast({
        title: "Lỗi khi lấy mã giảm giá",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserCoupons();
    }
  }, [userId]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Đã sao chép mã!",
      description: `Mã ${code} đã được sao chép vào clipboard.`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box as="section" py="30px">
      <Heading size={{ base: "md", md: "lg" }} mb={6} textAlign="center" color="gray.800">
        Mã Giảm Giá Của Tôi
      </Heading>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
          <Spinner size="lg" color="gray.800" />
        </Box>
      ) : coupons.length === 0 ? (
        <Box textAlign="center" minH="200px">
          <Text fontSize="lg" color="gray.600">
            Bạn chưa có mã giảm giá nào.
          </Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {coupons.map((coupon) => {
            const endDate = new Date(coupon.endDate);
            const currentDate = new Date();
            const isExpired = endDate < currentDate;
            const isAvailable = coupon.status === "ACTIVE" && !isExpired && coupon.usedCount < coupon.maxUses;

            return (
              <Box
                key={coupon.id}
                bg={isAvailable ? "white" : "gray.100"}
                borderWidth="1px"
                borderColor={isAvailable ? "gray.200" : "gray.300"}
                borderRadius="md"
                p={4}
                boxShadow="sm"
                transition="all 0.2s"
                _hover={isAvailable ? { boxShadow: "md", transform: "scale(1.02)" } : {}}
                opacity={isAvailable ? 1 : 0.6}
              >
                <VStack align="start" spacing={2}>
                  <HStack justify="space-between" w="full">
                    <Tag size="lg" colorScheme={isAvailable ? "green" : "red"} borderRadius="full">
                      {isAvailable ? "Khả dụng" : isExpired ? "Hết hạn" : "Hết lượt"}
                    </Tag>
                    <Text fontSize="sm" color="gray.500">
                      Hết hạn: {endDate.toLocaleDateString("vi-VN")}
                    </Text>
                  </HStack>
                  <Heading size="md" color="gray.800">
                    {coupon.code}
                  </Heading>
                  <Text fontSize="lg" fontWeight="bold" color="red.500">
                    Giảm {coupon.discountRate}% (Tối đa {coupon.maxDiscountAmount.toLocaleString("vi-VN")} đ)
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="teal"
                    onClick={() => handleCopyCode(coupon.code)}
                    isDisabled={!isAvailable}
                    w="full"
                  >
                    Sao chép mã
                  </Button>
                </VStack>
              </Box>
            );
          })}
        </SimpleGrid>
      )}
    </Box>
  );
};

const Account = () => {
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    district: "",
    ward: "",
    street: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const toast = useToast();

  useEffect(() => {
    // Kiểm tra và tải user từ localStorage nếu user trong UserContext là null
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && !user) {
      setUser(storedUser);
    }

    setProvinces(vietnamProvinces);

    // Đồng bộ formData với user
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.address?.city || "",
        country: user.address?.country || "",
        district: user.address?.district || "",
        ward: user.address?.ward || "",
        street: user.address?.street || "",
      });

      // Cập nhật districts và wards nếu có dữ liệu city và district
      if (user.address?.city) {
        const selectedProvince = vietnamProvinces.find((p) => p.name === user.address.city);
        setDistricts(selectedProvince?.districts || []);
        if (user.address?.district) {
          const selectedDistrict = selectedProvince?.districts.find((d) => d.name === user.address.district);
          setWards(selectedDistrict?.wards || []);
        }
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [user, setUser]);

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

  const handleDistrictChange = (e) => {
    const selectedDistrict = districts.find((d) => d.name === e.target.value);
    setWards(selectedDistrict?.wards || []);
    setFormData((prev) => ({
      ...prev,
      district: selectedDistrict?.name || "",
      ward: "",
    }));
  };

  const handleWardChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      ward: e.target.value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const initialData = {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      city: user?.address?.city || "",
      country: user?.address?.country || "",
      district: user?.address?.district || "",
      ward: user?.address?.ward || "",
      street: user?.address?.street || "",
    };

    const updatedAddress = {
      city: formData.city,
      country: formData.country,
      district: formData.district,
      ward: formData.ward,
      street: formData.street,
    };

    const changedFields = {};
    const changedAddressFields = {};

    Object.keys(formData).forEach((key) => {
      if (key !== "city" && key !== "country" && key !== "district" && key !== "ward" && key !== "street") {
        if (formData[key] !== initialData[key]) {
          changedFields[key] = formData[key];
        }
      }
    });

    Object.keys(updatedAddress).forEach((key) => {
      if (updatedAddress[key] !== initialData[key]) {
        changedAddressFields[key] = updatedAddress[key];
      }
    });

    if (Object.keys(changedAddressFields).length > 0) {
      changedFields.address = changedAddressFields;
    }

    if (Object.keys(changedFields).length === 0) {
      toast({
        title: "Thông báo",
        description: "Không có thay đổi nào để cập nhật.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      setIsSubmitting(false);
      return;
    }

    const dataToSubmit = changedFields;

    console.log("Thông tin người dùng gửi lên server (chỉ các trường đã thay đổi):", dataToSubmit);

    try {
      const response = await axiosInstance.put(`/user/${user.id}`, dataToSubmit);
      const updatedUser = response.data;

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast({
        title: "Thành công",
        description: "Thông tin tài khoản đã được cập nhật.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsEditing(false);
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

  const getCreatedAt = () => {
    if (!user || !user.createdAt) return "Chưa có thông tin";
    return new Date(user.createdAt).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="lg" color="gray.800" />
      </Box>
    );
  }

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
          <Tab>Đơn hàng của tôi</Tab>
          <Tab>Mã giảm giá của tôi</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Box
                p={6}
                borderWidth="1px"
                bg="white"
                _dark={{ bg: "gray.800" }}
                boxShadow="sm"
              >
                <form onSubmit={handleSubmit}>
                  <VStack align="stretch" spacing={4}>
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
                    <Flex justify="flex-end" gap={3}>
                      {!isEditing ? (
                        <>
                          <Button
                            colorScheme="blue"
                            variant="outline"
                            onClick={handleEdit}
                          >
                            Chỉnh sửa
                          </Button>
                          <Button
                            as={Link}
                            to="/ForgotPassword"
                            colorScheme="blue"
                            variant="solid"
                          >
                            Quên mật khẩu
                          </Button>
                          <Button
                            as={Link}
                            to="/ForgotPassword"
                            colorScheme="blue"
                            variant="solid"
                          >
                            Đổi mật khẩu
                          </Button>
                        </>
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
          <TabPanel>
            <MyCoupons userId={user?.id} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Account;