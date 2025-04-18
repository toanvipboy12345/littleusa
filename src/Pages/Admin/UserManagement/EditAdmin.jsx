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
import provincesData from '../../../data/vietnam-provinces.json';

const EditAdmin = ({ isOpen, onClose, admin, onEditSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: admin?.firstName || "",
    lastName: admin?.lastName || "",
    phone: admin?.phone || "",
    username: admin?.username || "",
    email: admin?.email || "",
    address: {
      street: admin?.address?.street || "",
      ward: admin?.address?.ward || "",
      district: admin?.address?.district || "",
      city: admin?.address?.city || "",
      country: admin?.address?.country || "Việt Nam",
    },
  });
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (admin) {
      setFormData({
        firstName: admin.firstName || "",
        lastName: admin.lastName || "",
        phone: admin.phone || "",
        username: admin.username || "",
        email: admin.email || "",
        address: {
          street: admin.address?.street || "",
          ward: admin.address?.ward || "",
          district: admin.address?.district || "",
          city: admin.address?.city || "",
          country: admin.address?.country || "Việt Nam",
        },
      });
    }
  }, [admin]);

  const gridColumns = useBreakpointValue({
    base: "repeat(1, 1fr)",
    md: "repeat(2, 1fr)",
    lg: "repeat(3, 1fr)",
  });

  const gridColumnsTwo = useBreakpointValue({
    base: "repeat(1, 1fr)",
    md: "repeat(2, 1fr)",
  });

  const modalWidth = useBreakpointValue({
    base: "90vw",
    md: "800px",
  });

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
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = (changedData) => {
    const newErrors = {};
    if (changedData.firstName !== undefined) {
      if (!formData.firstName) newErrors.firstName = "Vui lòng nhập tên";
    }
    if (changedData.lastName !== undefined) {
      if (!formData.lastName) newErrors.lastName = "Vui lòng nhập họ";
    }
    if (changedData.phone !== undefined) {
      if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
      else if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = "Số điện thoại phải có 10 chữ số";
    }
    if (changedData.username !== undefined) {
      if (!formData.username) newErrors.username = "Vui lòng nhập tên đăng nhập";
    }
    if (changedData.email !== undefined) {
      if (!formData.email) newErrors.email = "Vui lòng nhập email";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";
    }
    if (changedData.address?.street !== undefined) {
      if (!formData.address.street) newErrors.street = "Vui lòng nhập số nhà và đường";
    }
    if (changedData.address?.ward !== undefined) {
      if (!formData.address.ward) newErrors.ward = "Vui lòng chọn phường/xã";
    }
    if (changedData.address?.district !== undefined) {
      if (!formData.address.district) newErrors.district = "Vui lòng chọn quận/huyện";
    }
    if (changedData.address?.city !== undefined) {
      if (!formData.address.city) newErrors.city = "Vui lòng chọn tỉnh/thành phố";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const changedData = {};
    if (formData.firstName !== admin?.firstName) changedData.firstName = formData.firstName;
    if (formData.lastName !== admin?.lastName) changedData.lastName = formData.lastName;
    if (formData.phone !== admin?.phone) changedData.phone = formData.phone;
    if (formData.username !== admin?.username) changedData.username = formData.username;
    if (formData.email !== admin?.email) changedData.email = formData.email;
    if (
      formData.address.street !== admin?.address?.street ||
      formData.address.ward !== admin?.address?.ward ||
      formData.address.district !== admin?.address?.district ||
      formData.address.city !== admin?.address?.city ||
      formData.address.country !== admin?.address?.country
    ) {
      changedData.address = { ...formData.address };
    }

    if (Object.keys(changedData).length === 0) {
      toast({
        title: "Thông báo",
        description: "Không có thay đổi để cập nhật.",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      onClose();
      return;
    }

    console.log("Các trường được gửi đi:", changedData);

    if (!validateForm(changedData)) {
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
      const response = await axiosInstance.put(`/api/admin/${admin.id}`, changedData);
      console.log("Dữ liệu trả về từ API PUT:", response.data); // Log để kiểm tra
      onEditSuccess(response.data);
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin admin.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.status === 403
          ? error.customMessage || "Bạn không có quyền thực hiện hành động này"
          : error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Không thể cập nhật admin.";
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

  useEffect(() => {
    if (isOpen && formData.address.city) {
      const selectedProvince = provincesData.find((p) => p.name === formData.address.city);
      setDistricts(selectedProvince?.districts || []);
      if (formData.address.district) {
        const selectedDistrict = selectedProvince?.districts.find((d) => d.name === formData.address.district);
        setWards(selectedDistrict?.wards || []);
      }
    }
  }, [isOpen, formData.address.city, formData.address.district]);

  useEffect(() => {
    if (!isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW={modalWidth}>
        <ModalHeader fontSize="xl" fontWeight="bold">Chỉnh sửa admin</ModalHeader>
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
            Lưu
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditAdmin;