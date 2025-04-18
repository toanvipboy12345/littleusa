// import {
//   Box,
//   Flex,
//   Text,
//   Image,
//   Button,
//   Select,
//   Grid,
//   GridItem,
//   Spinner,
//   useToast,
//   Input,
//   FormControl,
//   FormLabel,
// } from "@chakra-ui/react";
// import { useEffect, useState, useContext } from "react";
// import { useNavigate, Link as RouterLink } from "react-router-dom";
// import { useCart } from "../../../../context/CartContext";
// import { UserContext } from "../../../../context/UserContext";
// import axiosInstance from "../../../../Api/axiosInstance";
// import vietnamProvinces from "../../../../data/vietnam-provinces.json";

// const Checkout = () => {
//   const { cartItems, totalItems, totalPrice, isLoading, fetchCart } = useCart();
//   const { user } = useContext(UserContext);
//   const navigate = useNavigate();
//   const toast = useToast();

//   const [paymentMethod, setPaymentMethod] = useState("VNPAY");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [shippingAddress, setShippingAddress] = useState({
//     street: "",
//     ward: "",
//     district: "",
//     city: "",
//     country: "Việt Nam",
//   });
//   const [customerName, setCustomerName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [email, setEmail] = useState("");
//   const [shippingMethod, setShippingMethod] = useState("");
//   const [shippingMethods, setShippingMethods] = useState([]);
//   const [provinces, setProvinces] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [wards, setWards] = useState([]);
//   const [couponCode, setCouponCode] = useState("");
//   const [isCouponValid, setIsCouponValid] = useState(false);
//   const [discountRate, setDiscountRate] = useState(0);
//   const [maxDiscountAmount, setMaxDiscountAmount] = useState(null);

//   const userId = user?.id || JSON.parse(localStorage.getItem("user"))?.id || null;
//   const cartToken = !userId ? localStorage.getItem("cartToken") || null : null;

//   useEffect(() => {
//     if (user) {
//       setShippingAddress({
//         street: user.address?.street || "",
//         ward: user.address?.ward || "",
//         district: user.address?.district || "",
//         city: user.address?.city || "",
//         country: "Việt Nam",
//       });
//       setCustomerName(`${user.firstName} ${user.lastName}`.trim());
//       setPhoneNumber(user.phone || "");
//       setEmail(user.email || "");
//     }
//   }, [user]);

//   useEffect(() => {
//     const fetchShippingMethods = async () => {
//       try {
//         const response = await axiosInstance.get("/api/shipping-methods");
//         setShippingMethods(response.data);
//         if (response.data.length > 0) {
//           setShippingMethod(response.data[0].code);
//         }
//       } catch (error) {
//         console.error("Lỗi khi lấy danh sách phương thức vận chuyển:", error);
//         toast({
//           title: "Lỗi",
//           description: "Không thể tải danh sách phương thức vận chuyển.",
//           status: "error",
//           duration: 3000,
//           isClosable: true,
//         });
//       }
//     };
//     fetchShippingMethods();
//   }, [toast]);

//   useEffect(() => {
//     setProvinces(vietnamProvinces || []);
//   }, []);

//   useEffect(() => {
//     if (shippingAddress.city) {
//       const selectedProvince = vietnamProvinces.find(
//         (p) => p.name === shippingAddress.city
//       );
//       setDistricts(selectedProvince?.districts || []);
//       setShippingAddress((prev) => ({ ...prev, district: "", ward: "" }));
//     } else {
//       setDistricts([]);
//       setWards([]);
//     }
//   }, [shippingAddress.city]);

//   useEffect(() => {
//     if (shippingAddress.district) {
//       const selectedDistrict = districts.find(
//         (d) => d.name === shippingAddress.district
//       );
//       setWards(selectedDistrict?.wards || []);
//       setShippingAddress((prev) => ({ ...prev, ward: "" }));
//     } else {
//       setWards([]);
//     }
//   }, [shippingAddress.district, districts]);

//   const handleValidateCoupon = async () => {
//     if (!couponCode.trim()) {
//       setIsCouponValid(false);
//       setDiscountRate(0);
//       setMaxDiscountAmount(null);
//       return;
//     }

//     try {
//       if (!userId) {
//         throw new Error("User not logged in");
//       }

//       const response = await axiosInstance.get(`/api/coupons/validate`, {
//         params: { code: couponCode.trim(), userId },
//       });
//       const coupon = response.data;
//       setIsCouponValid(true);
//       setDiscountRate(coupon.discountRate);
//       setMaxDiscountAmount(coupon.maxDiscountAmount);
//       toast({
//         title: "Thành công",
//         description: `Mã ${couponCode} đã được áp dụng! Giảm giá: ${coupon.discountRate}%` +
//                      (coupon.maxDiscountAmount 
//                        ? ` (Tối đa ${coupon.maxDiscountAmount.toLocaleString("vi-VN")} VND)` 
//                        : ""),
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });
//     } catch (error) {
//       console.error("Lỗi khi xác thực mã giảm giá:", error);
//       setIsCouponValid(false);
//       setDiscountRate(0);
//       setMaxDiscountAmount(null);
//       toast({
//         title: "Lỗi",
//         description: error.response?.data?.message || "Mã giảm giá không hợp lệ.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   const handleAddressChange = (e) => {
//     const { name, value } = e.target;
//     setShippingAddress((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCustomerNameChange = (e) => {
//     setCustomerName(e.target.value);
//   };

//   const handlePhoneNumberChange = (e) => {
//     setPhoneNumber(e.target.value);
//   };

//   const handleEmailChange = (e) => {
//     setEmail(e.target.value);
//   };

//   const generateOrderId = () => {
//     const prefix = "ORD";
//     const userType = userId ? "U" : "G";
//     const paymentType = paymentMethod === "COD" ? "C" : "V";
//     const date = new Date()
//       .toISOString()
//       .split("T")[0]
//       .replace(/-/g, "")
//       .slice(2);
//     const sequence = String(Math.floor(Math.random() * 1000)).padStart(4, "0");
//     return `${prefix}${userType}${paymentType}-${date}-${sequence}`;
//   };

//   useEffect(() => {
//     if (!userId && !cartToken) {
//       toast({
//         title: "Lỗi",
//         description: "Vui lòng đăng nhập hoặc thêm sản phẩm vào giỏ hàng.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//       navigate("/login");
//     }
//   }, [userId, cartToken, navigate, toast]);

//   const handlePayment = async () => {
//     if (isSubmitting || isLoading) return;

//     if (cartItems.length === 0) {
//       toast({
//         title: "Lỗi",
//         description: "Giỏ hàng trống. Vui lòng thêm sản phẩm để tiếp tục.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//       navigate("/product");
//       return;
//     }

//     const requiredFields = [
//       "street",
//       "ward",
//       "district",
//       "city",
//       "country",
//       "customerName",
//       "phoneNumber",
//       "email",
//     ];
//     const isInvalid = requiredFields.some((field) => {
//       if (field === "customerName") return !customerName.trim();
//       if (field === "phoneNumber") return !phoneNumber.trim();
//       if (field === "email") return !email.trim();
//       return !shippingAddress[field].trim();
//     });
//     if (isInvalid) {
//       toast({
//         title: "Lỗi",
//         description: "Vui lòng điền đầy đủ thông tin địa chỉ giao hàng, tên, số điện thoại và email.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }

//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!emailRegex.test(email)) {
//       toast({
//         title: "Lỗi",
//         description: "Email không hợp lệ. Vui lòng nhập email đúng định dạng.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }

//     const phoneRegex = /^[0-9]{10,11}$/;
//     if (!phoneRegex.test(phoneNumber)) {
//       toast({
//         title: "Lỗi",
//         description: "Số điện thoại không hợp lệ. Vui lòng nhập 10-11 chữ số.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }

//     if (!shippingMethod) {
//       toast({
//         title: "Lỗi",
//         description: "Vui lòng chọn phương thức vận chuyển.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const cartDTO = {
//         cartToken,
//         userId,
//         items: cartItems.map((item) => ({
//           id: item.id,
//           productId: item.productId,
//           variant: item.variant,
//           sizeId: item.sizeId,
//           size: item.size,
//           quantity: item.quantity,
//           availableQuantity: item.availableQuantity,
//           price: item.price,
//           discountPrice: item.discountPrice,
//         })),
//         totalItems,
//         totalPrice,
//       };

//       const orderId = generateOrderId();
//       console.log("Mã đơn hàng được tạo:", orderId);

//       console.log("Tạo đơn hàng với cartDTO:", cartDTO);

//       const orderResponse = await axiosInstance.post("/api/orders/create", {
//         orderId,
//         userId,
//         cartDTO,
//         shippingAddress,
//         shippingMethodCode: shippingMethod,
//         couponCode: isCouponValid ? couponCode : null,
//         email,
//         customerName,
//         phoneNumber,
//       });

//       const { orderId: returnedOrderId } = orderResponse.data;
//       const paymentResponse = await axiosInstance.post("/api/payments/create", {
//         orderId: returnedOrderId,
//         userId,
//         cartDTO,
//         paymentMethod,
//         shippingAddress,
//       });

//       console.log("Phản hồi từ /api/payments/create:", paymentResponse.data);

//       const { paymentUrl } = paymentResponse.data;

//       if (paymentMethod === "VNPAY" && paymentUrl) {
//         console.log("Đang chuyển hướng đến URL thanh toán VNPay:", paymentUrl);
//         window.location.href = paymentUrl;
//       } else if (paymentMethod === "COD") {
//         navigate(`/payment-success?orderId=${returnedOrderId}&paymentMethod=COD`);
//       }
//     } catch (error) {
//       console.error("Lỗi trong quá trình thanh toán:", error);
//       const errorMessage = error.response?.data?.message || "Không thể xử lý thanh toán.";
//       console.log("Thông báo lỗi từ backend:", errorMessage);
//       toast({
//         title: "Lỗi",
//         description: errorMessage,
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//       });
//       if (errorMessage.includes("Insufficient stock")) {
//         fetchCart();
//       }
//       navigate(`/payment-error?error=${encodeURIComponent(errorMessage)}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Tính toán phí vận chuyển và giảm giá với điều kiện miễn phí ship
//   const baseShippingFee = shippingMethods.find((m) => m.code === shippingMethod)?.shippingFee || 0;
//   const isFreeShipping = totalPrice > 1000000; // Miễn phí ship nếu totalPrice > 1 triệu
//   const shippingFee = isFreeShipping ? 0 : baseShippingFee;
//   let discountAmount = isCouponValid ? (totalPrice * discountRate) / 100 : 0;
//   if (maxDiscountAmount !== null && discountAmount > maxDiscountAmount) {
//     discountAmount = maxDiscountAmount;
//   }
//   const finalTotal = totalPrice + shippingFee - discountAmount;

//   if (isLoading) {
//     return (
//       <Flex justify="center" align="center" h="100vh">
//         <Spinner size="lg" />
//       </Flex>
//     );
//   }

//   if (cartItems.length === 0) {
//     return (
//       <Flex direction="column" align="center" justify="center" h="100vh">
//         <Text>Giỏ hàng của bạn đang trống.</Text>
//         <Button as={RouterLink} to="/product" mt={4} onClick={() => navigate("/product")}>
//           Tiếp tục mua sắm
//         </Button>
//       </Flex>
//     );
//   }

//   return (
//     <Box
//       py={{ base: 8, md: 12, lg: 20 }}
//       px={{ base: 2, md: 4, lg: 8 }}
//       mx="auto"
//       w={{ base: "95%", md: "90%", lg: "70%" }}
//     >
//       <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} mb={8}>
//         <Box>
//           {cartItems.map((item) => (
//             <Grid
//               key={item.id}
//               templateColumns={{ base: "1fr 2fr", md: "1fr 3fr" }}
//               gap={4}
//               mb={4}
//               alignItems="center"
//               borderBottom="1px solid"
//               borderColor="gray.200"
//               pb={4}
//             >
//               <GridItem>
//                 <Image
//                   src={`http://localhost:8080${item.variant.mainImage}`}
//                   alt={item.productName}
//                   objectFit="cover"
//                   boxSize={{ base: "80px", md: "100px" }}
//                 />
//               </GridItem>
//               <GridItem>
//                 <Flex direction="column" justify="space-between" h="100%">
//                   <Box>
//                     <Text fontWeight="bold">{item.productName}</Text>
//                     <Text fontSize="sm" color="gray.600">
//                       {item.variant.color} - {item.size}
//                     </Text>
//                     <Text fontSize="sm" fontWeight="bold" mt={1}>
//                       {item.discountPrice > 0
//                         ? `${item.discountPrice.toLocaleString("vi-VN")} VND`
//                         : `${item.price.toLocaleString("vi-VN")} VND`}
//                     </Text>
//                   </Box>
//                   <Text fontSize="sm">Số lượng: {item.quantity}</Text>
//                 </Flex>
//               </GridItem>
//             </Grid>
//           ))}
//         </Box>

//         <Box>
//           <Box mb={4}>
//             <Text fontWeight="bold" textTransform="uppercase" mb={2}>
//               Thông tin giao hàng
//             </Text>
//             <FormControl isRequired mb={4}>
//               <FormLabel>Tên khách hàng</FormLabel>
//               <Input
//                 bg="#f7f7f7"
//                 border="1px solid var(--primary-color)"
//                 color="black"
//                 borderRadius="0"
//                 w="100%"
//                 px="4"
//                 value={customerName}
//                 onChange={handleCustomerNameChange}
//                 placeholder="Nhập tên khách hàng"
//               />
//             </FormControl>
//             <Flex gap={4} mb={4}>
//               <FormControl isRequired flex="1">
//                 <FormLabel>Số điện thoại</FormLabel>
//                 <Input
//                   bg="#f7f7f7"
//                   border="1px solid var(--primary-color)"
//                   color="black"
//                   borderRadius="0"
//                   w="100%"
//                   px="4"
//                   value={phoneNumber}
//                   onChange={handlePhoneNumberChange}
//                   placeholder="Nhập số điện thoại"
//                 />
//               </FormControl>
//               <FormControl isRequired flex="1">
//                 <FormLabel>Email</FormLabel>
//                 <Input
//                   bg="#f7f7f7"
//                   border="1px solid var(--primary-color)"
//                   color="black"
//                   borderRadius="0"
//                   w="100%"
//                   px="4"
//                   type="email"
//                   value={email}
//                   onChange={handleEmailChange}
//                   placeholder="Nhập email"
//                 />
//               </FormControl>
//             </Flex>
           
//             <FormControl isRequired mb={4}>
//               <Flex gap={2}>
//                 <FormControl isRequired flex="1">
//                   <FormLabel>Thành phố</FormLabel>
//                   <Select
//                     border="1px solid var(--primary-color)"
//                     color="black"
//                     name="city"
//                     value={shippingAddress.city}
//                     onChange={handleAddressChange}
//                     placeholder="Chọn thành phố"
//                   >
//                     {provinces.map((province) => (
//                       <option key={province.name} value={province.name}>
//                         {province.name}
//                       </option>
//                     ))}
//                   </Select>
//                 </FormControl>
//                 <FormControl isRequired flex="1">
//                   <FormLabel>Quận/Huyện</FormLabel>
//                   <Select
//                     border="1px solid var(--primary-color)"
//                     color="black"
//                     name="district"
//                     value={shippingAddress.district}
//                     onChange={handleAddressChange}
//                     placeholder="Chọn quận/huyện"
//                     disabled={!shippingAddress.city}
//                   >
//                     {districts.map((district) => (
//                       <option key={district.name} value={district.name}>
//                         {district.name}
//                       </option>
//                     ))}
//                   </Select>
//                 </FormControl>
//                 <FormControl isRequired flex="1">
//                   <FormLabel>Phường/Xã</FormLabel>
//                   <Select
//                     border="1px solid var(--primary-color)"
//                     color="black"
//                     name="ward"
//                     value={shippingAddress.ward}
//                     onChange={handleAddressChange}
//                     placeholder="Chọn phường/xã"
//                     disabled={!shippingAddress.district}
//                   >
//                     {wards.map((ward) => (
//                       <option key={ward.name} value={ward.name}>
//                         {ward.name}
//                       </option>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Flex>
//             </FormControl>
//             <FormControl isRequired mb={4}>
//               <FormLabel>Đường/Số nhà</FormLabel>
//               <Input
//                 bg="#f7f7f7"
//                 border="1px solid var(--primary-color)"
//                 color="black"
//                 borderRadius="0"
//                 w="100%"
//                 px="4"
//                 name="street"
//                 value={shippingAddress.street}
//                 onChange={handleAddressChange}
//                 placeholder="Nhập địa chỉ đường phố"
//               />
//             </FormControl>
//           </Box>

//           <Box mb={4}>
//             <Flex gap={2} mb={4}>
//               <FormControl isRequired flex="1">
//                 <FormLabel>Phương thức vận chuyển</FormLabel>
//                 <Select
//                   border="1px solid var(--primary-color)"
//                   color="black"
//                   value={shippingMethod}
//                   onChange={(e) => setShippingMethod(e.target.value)}
//                   placeholder="Chọn phương thức vận chuyển"
//                 >
//                   {shippingMethods.map((method) => (
//                     <option key={method.id} value={method.code}>
//                       {method.name} ({isFreeShipping ? "Miễn phí" : `${method.shippingFee.toLocaleString("vi-VN")} VND`})
//                     </option>
//                   ))}
//                 </Select>
//               </FormControl>
//               <FormControl isRequired flex="1">
//                 <FormLabel>Phương thức thanh toán</FormLabel>
//                 <Select
//                   border="1px solid var(--primary-color)"
//                   color="black"
//                   value={paymentMethod}
//                   onChange={(e) => setPaymentMethod(e.target.value)}
//                 >
//                   <option value="VNPAY">VNPAY</option>
//                   <option value="COD">Thanh toán khi nhận hàng (COD)</option>
//                 </Select>
//               </FormControl>
//             </Flex>
//           </Box>

//           <Box mb={4}>
//             <FormLabel>Mã giảm giá (tuỳ chọn)</FormLabel>
//             {userId ? (
//               <Flex alignItems="center">
//                 <FormControl mr={2} flex="1">
//                   <Input
//                     bg="#f7f7f7"
//                     border="1px solid var(--primary-color)"
//                     color="black"
//                     borderRadius="0"
//                     value={couponCode}
//                     onChange={(e) => setCouponCode(e.target.value)}
//                     placeholder="Nhập mã giảm giá (tùy chọn)"
//                   />
//                 </FormControl>
//                 <Button variant="solid" onClick={handleValidateCoupon}>
//                   Áp dụng
//                 </Button>
//               </Flex>
//             ) : (
//               <Text color="gray.600">
//                 Vui lòng đăng nhập để áp dụng mã giảm giá.
//                 <Button
//                   as={RouterLink}
//                   to="/login"
//                   variant="link"
//                   ml={2}
//                 >
//                   Đăng nhập
//                 </Button>
//               </Text>
//             )}
//             {isCouponValid && (
//               <Text color="green.500" mt={4}>
//                 Mã {couponCode} đã được áp dụng! Bạn được giảm {discountRate}%
//                 {maxDiscountAmount !== null ? ` (Tối đa ${maxDiscountAmount.toLocaleString("vi-VN")} VND)` : ""}
//               </Text>
//             )}
//           </Box>
//         </Box>
//       </Grid>

//       <Box mb={4} border="1px solid" borderColor="gray.200" p={4}>
//         <Flex justify="space-between" mb={2}>
//           <Text>Tổng giá sản phẩm:</Text>
//           <Text>{totalPrice.toLocaleString("vi-VN")} VND</Text>
//         </Flex>
//         <Flex justify="space-between" mb={2}>
//           <Text>Phí vận chuyển:</Text>
//           {isFreeShipping ? (
//             <Text color="green.500">Miễn phí (Đơn hàng từ 1.000.000 VND)</Text>
//           ) : (
//             <Text>{shippingFee.toLocaleString("vi-VN")} VND</Text>
//           )}
//         </Flex>
//         {isCouponValid && (
//           <Flex justify="space-between" mb={2}>
//             <Text>Giảm giá (mã {couponCode}):</Text>
//             <Text color="green.500">-{discountAmount.toLocaleString("vi-VN")} VND</Text>
//           </Flex>
//         )}
//         <Flex justify="space-between" fontSize="lg" fontWeight="bold" mt={2}>
//           <Text>Tổng thanh toán:</Text>
//           <Text color="red.500">{finalTotal.toLocaleString("vi-VN")} VND</Text>
//         </Flex>
//       </Box>

//       <Flex justify="space-between" align="center" mb={4}>
//         <Box>
//           {isSubmitting && (
//             <Text fontSize="sm" color="gray.600" mb={2}>
//               Đang xử lý, vui lòng đợi...
//             </Text>
//           )}
//         </Box>
//         <Box>
//           <Button
//             variant="solid"
//             onClick={handlePayment}
//             isLoading={isSubmitting}
//             disabled={isSubmitting || isLoading}
//             size="lg"
//           >
//             Thanh toán
//           </Button>
//         </Box>
//       </Flex>
//     </Box>
//   );
// };

// export default Checkout;
import {
  Box,
  Flex,
  Text,
  Image,
  Button,
  Select,
  Grid,
  GridItem,
  Spinner,
  useToast,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useCart } from "../../../../context/CartContext";
import { UserContext } from "../../../../context/UserContext";
import axiosInstance from "../../../../Api/axiosInstance";
import vietnamProvinces from "../../../../data/vietnam-provinces.json";

const Checkout = () => {
  const { cartItems, totalItems, totalPrice, isLoading, fetchCart } = useCart();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const toast = useToast();

  const [paymentMethod, setPaymentMethod] = useState("VNPAY");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    ward: "",
    district: "",
    city: "",
    country: "Việt Nam",
  });
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [shippingMethods, setShippingMethods] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [isCouponValid, setIsCouponValid] = useState(false);
  const [discountRate, setDiscountRate] = useState(0);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(null);

  const userId = user?.id || JSON.parse(localStorage.getItem("user"))?.id || null;
  const cartToken = !userId ? localStorage.getItem("cartToken") || null : null;

  useEffect(() => {
    if (user) {
      setShippingAddress({
        street: user.address?.street || "",
        ward: user.address?.ward || "",
        district: user.address?.district || "",
        city: user.address?.city || "",
        country: "Việt Nam",
      });
      setCustomerName(`${user.firstName} ${user.lastName}`.trim());
      setPhoneNumber(user.phone || "");
      setEmail(user.email || "");

      // Cập nhật districts và wards dựa trên dữ liệu từ user
      if (user.address?.city) {
        const selectedProvince = vietnamProvinces.find(
          (p) => p.name === user.address.city
        );
        setDistricts(selectedProvince?.districts || []);
        if (user.address?.district) {
          const selectedDistrict = selectedProvince?.districts.find(
            (d) => d.name === user.address.district
          );
          setWards(selectedDistrict?.wards || []);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const response = await axiosInstance.get("/api/shipping-methods");
        setShippingMethods(response.data);
        if (response.data.length > 0) {
          setShippingMethod(response.data[0].code);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phương thức vận chuyển:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách phương thức vận chuyển.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchShippingMethods();
  }, [toast]);

  useEffect(() => {
    setProvinces(vietnamProvinces || []);
  }, []);

  useEffect(() => {
    if (shippingAddress.city) {
      const selectedProvince = vietnamProvinces.find(
        (p) => p.name === shippingAddress.city
      );
      setDistricts(selectedProvince?.districts || []);

      // Chỉ reset district và ward nếu city thay đổi từ form, không reset nếu đang tải dữ liệu từ user
      if (user?.address?.city !== shippingAddress.city) {
        setShippingAddress((prev) => ({ ...prev, district: "", ward: "" }));
        setWards([]);
      }
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [shippingAddress.city, user]);

  useEffect(() => {
    if (shippingAddress.district) {
      const selectedDistrict = districts.find(
        (d) => d.name === shippingAddress.district
      );
      setWards(selectedDistrict?.wards || []);

      // Chỉ reset ward nếu district thay đổi từ form, không reset nếu đang tải dữ liệu từ user
      if (user?.address?.district !== shippingAddress.district) {
        setShippingAddress((prev) => ({ ...prev, ward: "" }));
      }
    } else {
      setWards([]);
    }
  }, [shippingAddress.district, districts, user]);

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setIsCouponValid(false);
      setDiscountRate(0);
      setMaxDiscountAmount(null);
      return;
    }

    try {
      if (!userId) {
        throw new Error("User not logged in");
      }

      const response = await axiosInstance.get(`/api/coupons/validate`, {
        params: { code: couponCode.trim(), userId },
      });
      const coupon = response.data;
      setIsCouponValid(true);
      setDiscountRate(coupon.discountRate);
      setMaxDiscountAmount(coupon.maxDiscountAmount);
      toast({
        title: "Thành công",
        description: `Mã ${couponCode} đã được áp dụng! Giảm giá: ${coupon.discountRate}%` +
                     (coupon.maxDiscountAmount 
                       ? ` (Tối đa ${coupon.maxDiscountAmount.toLocaleString("vi-VN")} VND)` 
                       : ""),
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Lỗi khi xác thực mã giảm giá:", error);
      setIsCouponValid(false);
      setDiscountRate(0);
      setMaxDiscountAmount(null);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Mã giảm giá không hợp lệ.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerNameChange = (e) => {
    setCustomerName(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const generateOrderId = () => {
    const prefix = "ORD";
    const userType = userId ? "U" : "G";
    const paymentType = paymentMethod === "COD" ? "C" : "V";
    const date = new Date()
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "")
      .slice(2);
    const sequence = String(Math.floor(Math.random() * 1000)).padStart(4, "0");
    return `${prefix}${userType}${paymentType}-${date}-${sequence}`;
  };

  useEffect(() => {
    if (!userId && !cartToken) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập hoặc thêm sản phẩm vào giỏ hàng.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
    }
  }, [userId, cartToken, navigate, toast]);

  const handlePayment = async () => {
    if (isSubmitting || isLoading) return;

    if (cartItems.length === 0) {
      toast({
        title: "Lỗi",
        description: "Giỏ hàng trống. Vui lòng thêm sản phẩm để tiếp tục.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/product");
      return;
    }

    const requiredFields = [
      "street",
      "ward",
      "district",
      "city",
      "country",
      "customerName",
      "phoneNumber",
      "email",
    ];
    const isInvalid = requiredFields.some((field) => {
      if (field === "customerName") return !customerName.trim();
      if (field === "phoneNumber") return !phoneNumber.trim();
      if (field === "email") return !email.trim();
      return !shippingAddress[field].trim();
    });
    if (isInvalid) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin địa chỉ giao hàng, tên, số điện thoại và email.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Lỗi",
        description: "Email không hợp lệ. Vui lòng nhập email đúng định dạng.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast({
        title: "Lỗi",
        description: "Số điện thoại không hợp lệ. Vui lòng nhập 10-11 chữ số.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!shippingMethod) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn phương thức vận chuyển.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const cartDTO = {
        cartToken,
        userId,
        items: cartItems.map((item) => ({
          id: item.id,
          productId: item.productId,
          variant: item.variant,
          sizeId: item.sizeId,
          size: item.size,
          quantity: item.quantity,
          availableQuantity: item.availableQuantity,
          price: item.price,
          discountPrice: item.discountPrice,
        })),
        totalItems,
        totalPrice,
      };

      const orderId = generateOrderId();
      console.log("Mã đơn hàng được tạo:", orderId);

      console.log("Tạo đơn hàng với cartDTO:", cartDTO);

      const orderResponse = await axiosInstance.post("/api/orders/create", {
        orderId,
        userId,
        cartDTO,
        shippingAddress,
        shippingMethodCode: shippingMethod,
        couponCode: isCouponValid ? couponCode : null,
        email,
        customerName,
        phoneNumber,
      });

      const { orderId: returnedOrderId } = orderResponse.data;
      const paymentResponse = await axiosInstance.post("/api/payments/create", {
        orderId: returnedOrderId,
        userId,
        cartDTO,
        paymentMethod,
        shippingAddress,
      });

      console.log("Phản hồi từ /api/payments/create:", paymentResponse.data);

      const { paymentUrl } = paymentResponse.data;

      if (paymentMethod === "VNPAY" && paymentUrl) {
        console.log("Đang chuyển hướng đến URL thanh toán VNPay:", paymentUrl);
        window.location.href = paymentUrl;
      } else if (paymentMethod === "COD") {
        navigate(`/payment-success?orderId=${returnedOrderId}&paymentMethod=COD`);
      }
    } catch (error) {
      console.error("Lỗi trong quá trình thanh toán:", error);
      const errorMessage = error.response?.data?.message || "Không thể xử lý thanh toán.";
      console.log("Thông báo lỗi từ backend:", errorMessage);
      toast({
        title: "Lỗi",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      if (errorMessage.includes("Insufficient stock")) {
        fetchCart();
      }
      navigate(`/payment-error?error=${encodeURIComponent(errorMessage)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const baseShippingFee = shippingMethods.find((m) => m.code === shippingMethod)?.shippingFee || 0;
  const isFreeShipping = totalPrice > 1000000;
  const shippingFee = isFreeShipping ? 0 : baseShippingFee;
  let discountAmount = isCouponValid ? (totalPrice * discountRate) / 100 : 0;
  if (maxDiscountAmount !== null && discountAmount > maxDiscountAmount) {
    discountAmount = maxDiscountAmount;
  }
  const finalTotal = totalPrice + shippingFee - discountAmount;

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="lg" />
      </Flex>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Flex direction="column" align="center" justify="center" h="100vh">
        <Text>Giỏ hàng của bạn đang trống.</Text>
        <Button as={RouterLink} to="/product" mt={4} onClick={() => navigate("/product")}>
          Tiếp tục mua sắm
        </Button>
      </Flex>
    );
  }

  return (
    <Box
      py={{ base: 8, md: 12, lg: 20 }}
      px={{ base: 2, md: 4, lg: 8 }}
      mx="auto"
      w={{ base: "95%", md: "90%", lg: "70%" }}
    >
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} mb={8}>
        <Box>
          {cartItems.map((item) => (
            <Grid
              key={item.id}
              templateColumns={{ base: "1fr 2fr", md: "1fr 3fr" }}
              gap={4}
              mb={4}
              alignItems="center"
              borderBottom="1px solid"
              borderColor="gray.200"
              pb={4}
            >
              <GridItem>
                <Image
                  src={`http://localhost:8080${item.variant.mainImage}`}
                  alt={item.productName}
                  objectFit="cover"
                  boxSize={{ base: "80px", md: "100px" }}
                />
              </GridItem>
              <GridItem>
                <Flex direction="column" justify="space-between" h="100%">
                  <Box>
                    <Text fontWeight="bold">{item.productName}</Text>
                    <Text fontSize="sm" color="gray.600">
                      {item.variant.color} - {item.size}
                    </Text>
                    <Text fontSize="sm" fontWeight="bold" mt={1}>
                      {item.discountPrice > 0
                        ? `${item.discountPrice.toLocaleString("vi-VN")} VND`
                        : `${item.price.toLocaleString("vi-VN")} VND`}
                    </Text>
                  </Box>
                  <Text fontSize="sm">Số lượng: {item.quantity}</Text>
                </Flex>
              </GridItem>
            </Grid>
          ))}
        </Box>

        <Box>
          <Box mb={4}>
            <Text fontWeight="bold" textTransform="uppercase" mb={2}>
              Thông tin giao hàng
            </Text>
            <FormControl isRequired mb={4}>
              <FormLabel>Tên khách hàng</FormLabel>
              <Input
                bg="#f7f7f7"
                border="1px solid var(--primary-color)"
                color="black"
                borderRadius="0"
                w="100%"
                px="4"
                value={customerName}
                onChange={handleCustomerNameChange}
                placeholder="Nhập tên khách hàng"
              />
            </FormControl>
            <Flex gap={4} mb={4}>
              <FormControl isRequired flex="1">
                <FormLabel>Số điện thoại</FormLabel>
                <Input
                  bg="#f7f7f7"
                  border="1px solid var(--primary-color)"
                  color="black"
                  borderRadius="0"
                  w="100%"
                  px="4"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  placeholder="Nhập số điện thoại"
                />
              </FormControl>
              <FormControl isRequired flex="1">
                <FormLabel>Email</FormLabel>
                <Input
                  bg="#f7f7f7"
                  border="1px solid var(--primary-color)"
                  color="black"
                  borderRadius="0"
                  w="100%"
                  px="4"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Nhập email"
                />
              </FormControl>
            </Flex>
           
            <FormControl isRequired mb={4}>
              <Flex gap={2}>
                <FormControl isRequired flex="1">
                  <FormLabel>Thành phố</FormLabel>
                  <Select
                    border="1px solid var(--primary-color)"
                    color="black"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    placeholder="Chọn thành phố"
                  >
                    {provinces.map((province) => (
                      <option key={province.name} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired flex="1">
                  <FormLabel>Quận/Huyện</FormLabel>
                  <Select
                    border="1px solid var(--primary-color)"
                    color="black"
                    name="district"
                    value={shippingAddress.district}
                    onChange={handleAddressChange}
                    placeholder="Chọn quận/huyện"
                    disabled={!shippingAddress.city}
                  >
                    {districts.map((district) => (
                      <option key={district.name} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired flex="1">
                  <FormLabel>Phường/Xã</FormLabel>
                  <Select
                    border="1px solid var(--primary-color)"
                    color="black"
                    name="ward"
                    value={shippingAddress.ward}
                    onChange={handleAddressChange}
                    placeholder="Chọn phường/xã"
                    disabled={!shippingAddress.district}
                  >
                    {wards.map((ward) => (
                      <option key={ward.name} value={ward.name}>
                        {ward.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Flex>
            </FormControl>
            <FormControl isRequired mb={4}>
              <FormLabel>Đường/Số nhà</FormLabel>
              <Input
                bg="#f7f7f7"
                border="1px solid var(--primary-color)"
                color="black"
                borderRadius="0"
                w="100%"
                px="4"
                name="street"
                value={shippingAddress.street}
                onChange={handleAddressChange}
                placeholder="Nhập địa chỉ đường phố"
              />
            </FormControl>
          </Box>

          <Box mb={4}>
            <Flex gap={2} mb={4}>
              <FormControl isRequired flex="1">
                <FormLabel>Phương thức vận chuyển</FormLabel>
                <Select
                  border="1px solid var(--primary-color)"
                  color="black"
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  placeholder="Chọn phương thức vận chuyển"
                >
                  {shippingMethods.map((method) => (
                    <option key={method.id} value={method.code}>
                      {method.name} ({isFreeShipping ? "Miễn phí" : `${method.shippingFee.toLocaleString("vi-VN")} VND`})
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired flex="1">
                <FormLabel>Phương thức thanh toán</FormLabel>
                <Select
                  border="1px solid var(--primary-color)"
                  color="black"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="VNPAY">VNPAY</option>
                  <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                </Select>
              </FormControl>
            </Flex>
          </Box>

          <Box mb={4}>
            <FormLabel>Mã giảm giá (tuỳ chọn)</FormLabel>
            {userId ? (
              <Flex alignItems="center">
                <FormControl mr={2} flex="1">
                  <Input
                    bg="#f7f7f7"
                    border="1px solid var(--primary-color)"
                    color="black"
                    borderRadius="0"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Nhập mã giảm giá (tùy chọn)"
                  />
                </FormControl>
                <Button variant="solid" onClick={handleValidateCoupon}>
                  Áp dụng
                </Button>
              </Flex>
            ) : (
              <Text color="gray.600">
                Vui lòng đăng nhập để áp dụng mã giảm giá.
                <Button
                  as={RouterLink}
                  to="/login"
                  variant="link"
                  ml={2}
                >
                  Đăng nhập
                </Button>
              </Text>
            )}
            {isCouponValid && (
              <Text color="green.500" mt={4}>
                Mã {couponCode} đã được áp dụng! Bạn được giảm {discountRate}%
                {maxDiscountAmount !== null ? ` (Tối đa ${maxDiscountAmount.toLocaleString("vi-VN")} VND)` : ""}
              </Text>
            )}
          </Box>
        </Box>
      </Grid>

      <Box mb={4} border="1px solid" borderColor="gray.200" p={4}>
        <Flex justify="space-between" mb={2}>
          <Text>Tổng giá sản phẩm:</Text>
          <Text>{totalPrice.toLocaleString("vi-VN")} VND</Text>
        </Flex>
        <Flex justify="space-between" mb={2}>
          <Text>Phí vận chuyển:</Text>
          {isFreeShipping ? (
            <Text color="green.500">Miễn phí (Đơn hàng từ 1.000.000 VND)</Text>
          ) : (
            <Text>{shippingFee.toLocaleString("vi-VN")} VND</Text>
          )}
        </Flex>
        {isCouponValid && (
          <Flex justify="space-between" mb={2}>
            <Text>Giảm giá (mã {couponCode}):</Text>
            <Text color="green.500">-{discountAmount.toLocaleString("vi-VN")} VND</Text>
          </Flex>
        )}
        <Flex justify="space-between" fontSize="lg" fontWeight="bold" mt={2}>
          <Text>Tổng thanh toán:</Text>
          <Text color="red.500">{finalTotal.toLocaleString("vi-VN")} VND</Text>
        </Flex>
      </Box>

      <Flex justify="space-between" align="center" mb={4}>
        <Box>
          {isSubmitting && (
            <Text fontSize="sm" color="gray.600" mb={2}>
              Đang xử lý, vui lòng đợi...
            </Text>
          )}
        </Box>
        <Box>
          <Button
            variant="solid"
            onClick={handlePayment}
            isLoading={isSubmitting}
            disabled={isSubmitting || isLoading}
            size="lg"
          >
            Thanh toán
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default Checkout;