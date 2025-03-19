// import React, { useState } from "react";
// import axiosInstance from "../../Api/axiosInstance"; // Import Axios instance
// import {
//   Button,
//   Input,
//   Text,
//   Box,
//   Link,
//   Stack,
//   Flex,
//   Heading,
// } from "@chakra-ui/react";
// import { Link as RouterLink } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// const Register = ({ onClose, onSwitchToLogin }) => {
//   const [formData, setFormData] = useState({
//     email: "",
//     username: "",
//     password: "",
//     confirmPassword: "", // Thêm trường này
//     firstName: "",
//     lastName: "",
//     phone: "",
//   });

//   const [errors, setError] = useState({}); // Trạng thái lỗi
//   const [success, setSuccess] = useState(false); // Trạng thái thành công
//   const [successMessage, setSuccessMessage] = useState(""); // Trạng thái thông báo thành công
//   const navigate = useNavigate();
//   // Xử lý thay đổi input
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Xử lý đăng ký
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Kiểm tra xác nhận mật khẩu
//     if (formData.password !== formData.confirmPassword) {
//       setError((prevErrors) => ({
//         ...prevErrors,
//         confirmPassword: "Xác nhận mật khẩu không khớp.",
//       }));
//       return; // Dừng quá trình nếu mật khẩu không khớp
//     }

//     try {
//       const response = await axiosInstance.post("/register", formData);

//       // Nếu đăng ký thành công
//       if (response.status === 200) {
//         setSuccess(true);
//         setError({}); // Xóa tất cả lỗi
//         setSuccessMessage(
//           "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận."
//         );
//         setTimeout(() => {
//           navigate('/');
//         }, 1000); // Đợi 1000ms (1 giây) trước khi chuyển hướng
//       }
//     } catch (err) {
//       // Xóa tất cả lỗi trước khi cập nhật mới
//       setError({});
//       // Lấy thông báo lỗi từ server
//       const errorData = err.response?.data || {};
//       const newErrors = {};

//       // Kiểm tra xem lỗi có phải là object không
//       if (typeof errorData === "object") {
//         Object.keys(errorData).forEach((key) => {
//           newErrors[key] = errorData[key];
//         });
//       } else {
//         // Nếu lỗi không phải là object, hiển thị lỗi chung
//         newErrors.general = errorData.message || "Đã xảy ra lỗi khi đăng ký.";
//       }

//       // Cập nhật state errors
//       setError(newErrors);
//     }
//   };
//   return (
//     <Box
//     maxW={{ base: "90%", sm: "80%", md: "70%", lg: "40%" }}
//       mx="auto"
//       my="10"
//       p={6}
//     >
//       {/* Tiêu đề */}
//       <Heading as="h2" textAlign="center" mb="6">
//         ĐĂNG KÝ
//       </Heading>
//       {/* Hiển thị lỗi chung */}
//       {errors.general && (
//         <Text color="red.500" mb={4}>
//           {errors.general}
//         </Text>
//       )}

//       {/* Form đăng ký */}
//       <Stack spacing={4}>
//         {/* Email */}
//         <Text fontSize="sm" fontWeight="bold">
//           Email
//         </Text>
//         <Input
//           type="email"
//           name="email"
//           placeholder="Nhập email của bạn"
//           required
//           bg="#f7f7f7"
//           border="1px solid var(--primary-color)"
//           color="black"
//           borderRadius="0"
//           px="4"
//           onChange={handleChange}
//           _hover={{
//             boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
//           }}
//           _focus={{
//             borderColor: "var(--primary-color)",
//           }}
//         />
//         {errors.email && (
//           <Text color="red.500" fontSize="sm">
//             {errors.email}
//           </Text>
//         )}

//         {/* Username */}
//         <Text fontSize="sm" fontWeight="bold">
//           Tên đăng nhập
//         </Text>
//         <Input
//           type="text"
//           name="username"
//           placeholder="Nhập tên đăng nhập"
//           required
//           bg="#f7f7f7"
//           border="1px solid var(--primary-color)"
//           color="black"
//           borderRadius="0"
//           px="4"
//           onChange={handleChange}
//           _hover={{
//             boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
//           }}
//           _focus={{
//             borderColor: "var(--primary-color)",
//           }}
//         />
//         {errors.username && (
//           <Text color="red.500" fontSize="sm">
//             {errors.username}
//           </Text>
//         )}

//         {/* Password */}
//         <Text fontSize="sm" fontWeight="bold">
//           Mật khẩu
//         </Text>
//         <Input
//           type="password"
//           name="password"
//           placeholder="Nhập mật khẩu"
//           required
//           bg="#f7f7f7"
//           border="1px solid var(--primary-color)"
//           color="black"
//           borderRadius="0"
//           px="4"
//           onChange={handleChange}
//           _hover={{
//             boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
//           }}
//           _focus={{
//             borderColor: "var(--primary-color)",
//           }}
//         />
//         {errors.password && (
//           <Text color="red.500" fontSize="sm">
//             {errors.password}
//           </Text>
//         )}

//         {/* Confirm Password */}
//         <Text fontSize="sm" fontWeight="bold">
//           Xác nhận mật khẩu
//         </Text>
//         <Input
//           type="password"
//           name="confirmPassword"
//           placeholder="Xác nhận mật khẩu"
//           required
//           bg="#f7f7f7"
//           border="1px solid var(--primary-color)"
//           color="black"
//           borderRadius="0"
//           px="4"
//           onChange={handleChange}
//           _hover={{
//             boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
//           }}
//           _focus={{
//             borderColor: "var(--primary-color)",
//           }}
//         />
//         {errors.confirmPassword && (
//           <Text color="red.500" fontSize="sm">
//             {errors.confirmPassword}
//           </Text>
//         )}

//         {/* First Name */}
//         <Text fontSize="sm" fontWeight="bold">
//           Họ
//         </Text>
//         <Input
//           type="text"
//           name="firstName"
//           placeholder="Nhập họ của bạn"
//           required
//           bg="#f7f7f7"
//           border="1px solid var(--primary-color)"
//           color="black"
//           borderRadius="0"
//           px="4"
//           onChange={handleChange}
//           _hover={{
//             boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
//           }}
//           _focus={{
//             borderColor: "var(--primary-color)",
//           }}
//         />
//         {errors.firstName && (
//           <Text color="red.500" fontSize="sm">
//             {errors.firstName}
//           </Text>
//         )}

//         {/* Last Name */}
//         <Text fontSize="sm" fontWeight="bold">
//           Tên
//         </Text>
//         <Input
//           type="text"
//           name="lastName"
//           placeholder="Nhập tên của bạn"
//           required
//           bg="#f7f7f7"
//           border="1px solid var(--primary-color)"
//           color="black"
//           borderRadius="0"
//           px="4"
//           onChange={handleChange}
//           _hover={{
//             boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
//           }}
//           _focus={{
//             borderColor: "var(--primary-color)",
//           }}
//         />
//         {errors.lastName && (
//           <Text color="red.500" fontSize="sm">
//             {errors.lastName}
//           </Text>
//         )}

//         {/* Phone */}
//         <Text fontSize="sm" fontWeight="bold">
//           Số điện thoại
//         </Text>
//         <Input
//           type="tel"
//           name="phone"
//           placeholder="Nhập số điện thoại"
//           required
//           bg="#f7f7f7"
//           border="1px solid var(--primary-color)"
//           color="black"
//           borderRadius="0"
//           px="4"
//           onChange={handleChange}
//           _hover={{
//             boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
//           }}
//           _focus={{
//             borderColor: "var(--primary-color)",
//           }}
//         />
//         {errors.phone && (
//           <Text color="red.500" fontSize="sm">
//             {errors.phone}
//           </Text>
//         )}
//         {/* Hiển thị thông báo thành công */}
//         {successMessage && (
//           <Text color="green.500" mb={4} mx="auto">
//             {successMessage}
//           </Text>
//         )}

//         {/* Submit Button */}
//         <Button
//           onClick={handleSubmit}
//           type="submit"
//           variant="solid"
//           size="lg"
//           mx="auto"
//           w={{ base: "80%", sm: "70%", md: "40%" }} // Điều chỉnh chiều rộng theo từng màn hình
//           borderRadius="0" // Bỏ border-radius
//         >
//           Đăng ký
//         </Button>

//         {/* Link chuyển sang form đăng nhập */}
//         <Flex justifyContent="center">
//           <Text mr={2}>Đã có tài khoản?</Text>
//           <Link as={RouterLink} to="/Login" color="blue.500">
//             Đăng nhập
//           </Link>
//         </Flex>
//       </Stack>
//     </Box>
//   );
// };

// export default Register;
import React, { useState } from "react";
import axiosInstance from "../../Api/axiosInstance"; // Import Axios instance
import {
  Button,
  Input,
  Text,
  Box,
  Link,
  Stack,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [errors, setErrors] = useState({}); // Sửa setError thành setErrors cho đúng cú pháp (plural)
  const [successMessage, setSuccessMessage] = useState(""); // Chỉ giữ successMessage, loại bỏ success
  const navigate = useNavigate();

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra xác nhận mật khẩu
    if (formData.password !== formData.confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Xác nhận mật khẩu không khớp.",
      }));
      return; // Dừng quá trình nếu mật khẩu không khớp
    }

    try {
      const response = await axiosInstance.post("/register", formData);

      // Nếu đăng ký thành công
      if (response.status === 200) {
        setErrors({}); // Xóa tất cả lỗi
        setSuccessMessage(
          "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận."
        );
        setTimeout(() => {
          navigate('/');
        }, 1000); // Đợi 1 giây trước khi chuyển hướng
      }
    } catch (err) {
      // Xóa tất cả lỗi trước khi cập nhật mới
      setErrors({});
      // Lấy thông báo lỗi từ server
      const errorData = err.response?.data || {};
      const newErrors = {};

      // Kiểm tra xem lỗi có phải là object không
      if (typeof errorData === "object") {
        Object.keys(errorData).forEach((key) => {
          newErrors[key] = errorData[key];
        });
      } else {
        // Nếu lỗi không phải là object, hiển thị lỗi chung
        newErrors.general = errorData.message || "Đã xảy ra lỗi khi đăng ký.";
      }

      // Cập nhật state errors
      setErrors(newErrors);
    }
  };

  return (
    <Box
      maxW={{ base: "90%", sm: "80%", md: "70%", lg: "40%" }}
      mx="auto"
      my="10"
      p={6}
    >
      {/* Tiêu đề */}
      <Heading as="h2" textAlign="center" mb="6">
        ĐĂNG KÝ
      </Heading>
      {/* Hiển thị lỗi chung */}
      {errors.general && (
        <Text color="red.500" mb={4}>
          {errors.general}
        </Text>
      )}

      {/* Form đăng ký */}
      <Stack spacing={4}>
        {/* Email */}
        <Text fontSize="sm" fontWeight="bold">
          Email
        </Text>
        <Input
          type="email"
          name="email"
          placeholder="Nhập email của bạn"
          required
          bg="#f7f7f7"
          border="1px solid var(--primary-color)"
          color="black"
          borderRadius="0"
          px="4"
          onChange={handleChange}
          _hover={{
            boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
          }}
          _focus={{
            borderColor: "var(--primary-color)",
          }}
        />
        {errors.email && (
          <Text color="red.500" fontSize="sm">
            {errors.email}
          </Text>
        )}

        {/* Username */}
        <Text fontSize="sm" fontWeight="bold">
          Tên đăng nhập
        </Text>
        <Input
          type="text"
          name="username"
          placeholder="Nhập tên đăng nhập"
          required
          bg="#f7f7f7"
          border="1px solid var(--primary-color)"
          color="black"
          borderRadius="0"
          px="4"
          onChange={handleChange}
          _hover={{
            boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
          }}
          _focus={{
            borderColor: "var(--primary-color)",
          }}
        />
        {errors.username && (
          <Text color="red.500" fontSize="sm">
            {errors.username}
          </Text>
        )}

        {/* Password */}
        <Text fontSize="sm" fontWeight="bold">
          Mật khẩu
        </Text>
        <Input
          type="password"
          name="password"
          placeholder="Nhập mật khẩu"
          required
          bg="#f7f7f7"
          border="1px solid var(--primary-color)"
          color="black"
          borderRadius="0"
          px="4"
          onChange={handleChange}
          _hover={{
            boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
          }}
          _focus={{
            borderColor: "var(--primary-color)",
          }}
        />
        {errors.password && (
          <Text color="red.500" fontSize="sm">
            {errors.password}
          </Text>
        )}

        {/* Confirm Password */}
        <Text fontSize="sm" fontWeight="bold">
          Xác nhận mật khẩu
        </Text>
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Xác nhận mật khẩu"
          required
          bg="#f7f7f7"
          border="1px solid var(--primary-color)"
          color="black"
          borderRadius="0"
          px="4"
          onChange={handleChange}
          _hover={{
            boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
          }}
          _focus={{
            borderColor: "var(--primary-color)",
          }}
        />
        {errors.confirmPassword && (
          <Text color="red.500" fontSize="sm">
            {errors.confirmPassword}
          </Text>
        )}

        {/* First Name */}
        <Text fontSize="sm" fontWeight="bold">
          Họ
        </Text>
        <Input
          type="text"
          name="firstName"
          placeholder="Nhập họ của bạn"
          required
          bg="#f7f7f7"
          border="1px solid var(--primary-color)"
          color="black"
          borderRadius="0"
          px="4"
          onChange={handleChange}
          _hover={{
            boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
          }}
          _focus={{
            borderColor: "var(--primary-color)",
          }}
        />
        {errors.firstName && (
          <Text color="red.500" fontSize="sm">
            {errors.firstName}
          </Text>
        )}

        {/* Last Name */}
        <Text fontSize="sm" fontWeight="bold">
          Tên
        </Text>
        <Input
          type="text"
          name="lastName"
          placeholder="Nhập tên của bạn"
          required
          bg="#f7f7f7"
          border="1px solid var(--primary-color)"
          color="black"
          borderRadius="0"
          px="4"
          onChange={handleChange}
          _hover={{
            boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
          }}
          _focus={{
            borderColor: "var(--primary-color)",
          }}
        />
        {errors.lastName && (
          <Text color="red.500" fontSize="sm">
            {errors.lastName}
          </Text>
        )}

        {/* Phone */}
        <Text fontSize="sm" fontWeight="bold">
          Số điện thoại
        </Text>
        <Input
          type="tel"
          name="phone"
          placeholder="Nhập số điện thoại"
          required
          bg="#f7f7f7"
          border="1px solid var(--primary-color)"
          color="black"
          borderRadius="0"
          px="4"
          onChange={handleChange}
          _hover={{
            boxShadow: "0 0 5px rgba(45, 79, 73, 0.6)",
          }}
          _focus={{
            borderColor: "var(--primary-color)",
          }}
        />
        {errors.phone && (
          <Text color="red.500" fontSize="sm">
            {errors.phone}
          </Text>
        )}

        {/* Hiển thị thông báo thành công */}
        {successMessage && (
          <Text color="green.500" mb={4} mx="auto">
            {successMessage}
          </Text>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          type="submit"
          variant="solid"
          size="lg"
          mx="auto"
          w={{ base: "80%", sm: "70%", md: "40%" }}
          borderRadius="0"
        >
          Đăng ký
        </Button>

        {/* Link chuyển sang form đăng nhập */}
        <Flex justifyContent="center">
          <Text mr={2}>Đã có tài khoản?</Text>
          <Link as={RouterLink} to="/Login" color="blue.500">
            Đăng nhập
          </Link>
        </Flex>
      </Stack>
    </Box>
  );
};

export default Register;