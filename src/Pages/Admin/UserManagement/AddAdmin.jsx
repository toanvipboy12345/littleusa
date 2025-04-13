import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Grid,
  GridItem,
  useToast,
  useBreakpointValue,
} from "@chakra-ui/react";
import axiosInstance from "../../../Api/axiosInstance";
import provincesData from '../../../data/vietnam-provinces.json'; // File JSON chứa data tỉnh thành

const adminRolesOptions = [
  { value: "super_admin", label: "Super Admin" },
  { value: "product_manager", label: "Product Manager" },
  { value: "order_manager", label: "Order Manager" },
  { value: "marketing_manager", label: "Marketing Manager" },
  { value: "customer_support", label: "Customer Support" },
  { value: "blog_manager", label: "Blog Manager" },
];

const AddAdmin = ({ isOpen, onClose, onAddSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    username: "",
    email: "",
    password: "",
    adminRoles: [],
    address: {
      street: "",
      ward: "",
      district: "",
      city: "",
      country: "Việt Nam",
    },
  });
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Responsive grid columns
  const gridColumns = useBreakpointValue({
    base: "repeat(1, 1fr)", // 1 cột trên mobile
    md: "repeat(2, 1fr)",   // 2 cột trên tablet
    lg: "repeat(3, 1fr)",   // 3 cột trên desktop
  });

  const gridColumnsTwo = useBreakpointValue({
    base: "repeat(1, 1fr)", // 1 cột trên mobile
    md: "repeat(2, 1fr)",   // 2 cột trên tablet và desktop
  });

  // Responsive modal width
  const modalWidth = useBreakpointValue({
    base: "90vw", // Chiếm 90% chiều rộng màn hình trên mobile
    md: "800px",  // Chiều rộng cố định trên tablet và desktop
  });

  // Load districts khi chọn city (Tỉnh/Thành phố)
  const handleCityChange = (e) => {
    const cityName = e.target.value;
    const selectedProvince = provincesData.find((p) => p.name === cityName);
    setDistricts(selectedProvince?.districts || []);
    setWards([]);
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, city: cityName, district: "", ward: "" },
    }));
  };

  // Load wards khi chọn district (Quận/Huyện)
  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    const selectedDistrict = districts.find((d) => d.name === districtName);
    setWards(selectedDistrict?.wards || []);
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, district: districtName, ward: "" },
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else if (name === "adminRoles") {
      setFormData((prev) => ({ ...prev, adminRoles: [value] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "Vui lòng nhập tên";
    if (!formData.lastName) newErrors.lastName = "Vui lòng nhập họ";
    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = "Số điện thoại phải có 10 chữ số";
    if (!formData.username) newErrors.username = "Vui lòng nhập tên đăng nhập";
    if (!formData.email) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";
    if (!formData.password) newErrors.password = "Vui lòng nhập mật khẩu";
    else if (formData.password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    if (!formData.adminRoles.length) newErrors.adminRoles = "Vui lòng chọn vai trò";
    if (!formData.address.street) newErrors.street = "Vui lòng nhập số nhà và đường";
    if (!formData.address.ward) newErrors.ward = "Vui lòng chọn phường/xã";
    if (!formData.address.district) newErrors.district = "Vui lòng chọn quận/huyện";
    if (!formData.address.city) newErrors.city = "Vui lòng chọn tỉnh/thành phố";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng kiểm tra lại các trường thông tin",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setLoading(true);
    try {
      const newAdmin = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        adminRoles: formData.adminRoles,
        address: { ...formData.address },
      };
      const response = await axiosInstance.post("/api/admin", newAdmin);
      onAddSuccess(response.data);
      toast({
        title: "Thành công",
        description: "Đã thêm admin mới.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      resetForm();
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.status === 403
          ? error.customMessage || "Bạn không có quyền thực hiện hành động này"
          : error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Không thể thêm admin.";
      toast({
        title: "Lỗi",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      username: "",
      email: "",
      password: "",
      adminRoles: [],
      address: {
        street: "",
        ward: "",
        district: "",
        city: "",
        country: "Việt Nam",
      },
    });
    setDistricts([]);
    setWards([]);
    setErrors({});
  };

  // Reset khi modal đóng/mở
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    } else {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, country: "Việt Nam" },
      }));
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW={modalWidth}>
        <ModalHeader fontSize="xl" fontWeight="bold">Thêm admin mới</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns={gridColumnsTwo} gap={6}>
            <GridItem>
              <FormControl isInvalid={!!errors.lastName}>
                <FormLabel fontSize="sm" fontWeight="medium">Họ</FormLabel>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Nhập họ..."
                  size="md"
                />
                {errors.lastName && <FormLabel color="red.500" fontSize="xs">{errors.lastName}</FormLabel>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={!!errors.firstName}>
                <FormLabel fontSize="sm" fontWeight="medium">Tên</FormLabel>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Nhập tên..."
                  size="md"
                />
                {errors.firstName && <FormLabel color="red.500" fontSize="xs">{errors.firstName}</FormLabel>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={!!errors.phone}>
                <FormLabel fontSize="sm" fontWeight="medium">Số điện thoại</FormLabel>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại..."
                  size="md"
                />
                {errors.phone && <FormLabel color="red.500" fontSize="xs">{errors.phone}</FormLabel>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={!!errors.username}>
                <FormLabel fontSize="sm" fontWeight="medium">Tên đăng nhập</FormLabel>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Nhập tên đăng nhập..."
                  size="md"
                />
                {errors.username && <FormLabel color="red.500" fontSize="xs">{errors.username}</FormLabel>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel fontSize="sm" fontWeight="medium">Email</FormLabel>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email..."
                  size="md"
                />
                {errors.email && <FormLabel color="red.500" fontSize="xs">{errors.email}</FormLabel>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={!!errors.password}>
                <FormLabel fontSize="sm" fontWeight="medium">Mật khẩu</FormLabel>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu..."
                  size="md"
                />
                {errors.password && <FormLabel color="red.500" fontSize="xs">{errors.password}</FormLabel>}
              </FormControl>
            </GridItem>
          </Grid>

          <Grid templateColumns="repeat(1, 1fr)" gap={6} mt={4}>
            <GridItem>
              <FormControl isInvalid={!!errors.adminRoles}>
                <FormLabel fontSize="sm" fontWeight="medium">Vai trò</FormLabel>
                <Select
                  name="adminRoles"
                  value={formData.adminRoles[0] || ""}
                  onChange={handleChange}
                  placeholder="Chọn vai trò"
                  size="md"
                >
                  {adminRolesOptions.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </Select>
                {errors.adminRoles && <FormLabel color="red.500" fontSize="xs">{errors.adminRoles}</FormLabel>}
              </FormControl>
            </GridItem>
          </Grid>

          <Grid templateColumns={gridColumns} gap={6} mt={4}>
            <GridItem>
              <FormControl isInvalid={!!errors.city}>
                <FormLabel fontSize="sm" fontWeight="medium">Tỉnh/Thành phố</FormLabel>
                <Select
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleCityChange}
                  placeholder="Chọn tỉnh/thành phố"
                  size="md"
                >
                  {provincesData.map((province) => (
                    <option key={province.name} value={province.name}>
                      {province.name}
                    </option>
                  ))}
                </Select>
                {errors.city && <FormLabel color="red.500" fontSize="xs">{errors.city}</FormLabel>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={!!errors.district}>
                <FormLabel fontSize="sm" fontWeight="medium">Quận/Huyện</FormLabel>
                <Select
                  name="address.district"
                  value={formData.address.district}
                  onChange={handleDistrictChange}
                  placeholder="Chọn quận/huyện"
                  isDisabled={!districts.length}
                  size="md"
                >
                  {districts.map((district) => (
                    <option key={district.name} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </Select>
                {errors.district && <FormLabel color="red.500" fontSize="xs">{errors.district}</FormLabel>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={!!errors.ward}>
                <FormLabel fontSize="sm" fontWeight="medium">Phường/Xã</FormLabel>
                <Select
                  name="address.ward"
                  value={formData.address.ward}
                  onChange={handleChange}
                  placeholder="Chọn phường/xã"
                  isDisabled={!wards.length}
                  size="md"
                >
                  {wards.map((ward) => (
                    <option key={ward.name} value={ward.name}>
                      {ward.name}
                    </option>
                  ))}
                </Select>
                {errors.ward && <FormLabel color="red.500" fontSize="xs">{errors.ward}</FormLabel>}
              </FormControl>
            </GridItem>
          </Grid>

          <Grid templateColumns={gridColumnsTwo} gap={6} mt={4}>
            <GridItem>
              <FormControl isInvalid={!!errors.street}>
                <FormLabel fontSize="sm" fontWeight="medium">Số nhà và đường</FormLabel>
                <Input
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="Nhập số nhà và đường..."
                  size="md"
                />
                {errors.street && <FormLabel color="red.500" fontSize="xs">{errors.street}</FormLabel>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">Quốc gia</FormLabel>
                <Input
                  name="address.country"
                  value={formData.address.country}
                  isDisabled
                  size="md"
                />
              </FormControl>
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose} size="md">
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            ml={3}
            isLoading={loading}
            size="md"
          >
            Thêm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddAdmin;